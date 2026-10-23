#!/usr/bin/env node
/* Adds static fallback declarations before every `var(--x)` usage so the app
   still looks right on old Android WebViews that don't support CSS variables.
   Idempotent: running it twice does not duplicate anything.

   Usage: node tools/css-fallbacks.js
*/
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'web', 'style.css');
const css = fs.readFileSync(file, 'utf8');

/* ---------- 1. read the custom properties ---------- */
const vars = {};
const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
if (!rootMatch) throw new Error(':root block not found');
rootMatch[1].replace(/--([\w-]+)\s*:\s*([^;]+);/g, (m, name, value) => {
  vars[name] = value.trim();
  return m;
});

const VAR = /var\(--([\w-]+)(?:\s*,\s*([^)]+))?\)/g;

function expand(value) {
  return value.replace(VAR, (m, name, fb) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) return vars[name];
    if (fb) return fb.trim();
    return m;
  });
}

/* ---------- 2. find every innermost declaration block ---------- */
function innermostBlocks(text) {
  const stack = [];
  const blocks = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') stack.push(i);
    else if (ch === '}') {
      const start = stack.pop();
      if (start === undefined) continue;
      const inner = text.slice(start + 1, i);
      if (inner.indexOf('{') === -1 && inner.indexOf('}') === -1) {
        blocks.push([start + 1, i]);
      }
    }
  }
  return blocks;
}

let added = 0;

function rewriteBlock(inner) {
  if (inner.indexOf('var(') === -1) return inner;
  if (/(^|[\s{;])--[\w-]+\s*:/.test(inner)) return inner; // :root itself

  const out = [];
  const re = /([^{}]*?)(;|$)/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    let chunk = m[1];
    const term = m[2];
    if (!chunk.length && !term) break;
    if (!chunk.includes('var(')) { out.push(chunk + term); continue; }

    // split the chunk into "separator" (leading whitespace) + declaration
    const sepMatch = chunk.match(/^\s*/);
    const sep = sepMatch ? sepMatch[0] : '';
    const body = chunk.slice(sep.length);
    const colon = body.indexOf(':');
    if (colon < 0) { out.push(chunk + term); continue; }

    const prop = body.slice(0, colon).trim();
    const value = body.slice(colon + 1);
    const fallback = expand(value);
    if (fallback.includes('var(') || prop.startsWith('--')) { out.push(chunk + term); continue; }

    // Only add when the previous declaration is not already this fallback.
    const prevDecl = out.length ? out[out.length - 1] : '';
    const candidate = prop + ':' + fallback + (term || '');
    const prevBody = prevDecl.replace(/^[^{}]*?(?=[-a-z])/i, prevDecl.match(/^\s*/)[0]);
    if (prevBody.trim() !== candidate.trim()) {
      const indent = prevPrevIndent(out, sep);
      out.push(sep + prop + ':' + fallback + ';' + (sep.indexOf('\n') >= 0 ? indent : ' '));
      added++;
    }
    out.push(chunk + term);
  }
  return out.join('');
}

function prevPrevIndent(out, sep) {
  // use the same indentation style as the current declaration
  const nl = sep.lastIndexOf('\n');
  return nl >= 0 ? sep.slice(nl + 1) : '';
}

const blocks = innermostBlocks(css);
let out = '';
let cursor = 0;
for (const [start, end] of blocks) {
  out += css.slice(cursor, start);
  out += rewriteBlock(css.slice(start, end));
  cursor = end;
}
out += css.slice(cursor);

fs.writeFileSync(file, out);
console.log('added ' + added + ' fallback declarations (vars: ' + Object.keys(vars).length +
  ', blocks: ' + blocks.length + ')');
