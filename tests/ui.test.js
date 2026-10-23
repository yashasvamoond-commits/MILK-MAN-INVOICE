/* UI smoke tests with jsdom. Run: node tests/ui.test.js */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');
const C = require('../web/core.js');

const root = path.join(__dirname, '..', 'web');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const coreSrc = fs.readFileSync(path.join(root, 'core.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

const TODAY = C.dateKey(new Date());

function boot() {
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://app.local/' });
  const w = dom.window;
  w.scrollTo = () => {};
  w.eval(coreSrc);
  w.eval(appSrc);
  return { dom, w, d: w.document };
}

function click(w, sel) {
  const el = w.document.querySelector(sel);
  assert.ok(el, 'element not found: ' + sel);
  el.click();
  return el;
}

function clickAct(w, act, extra) {
  return click(w, '[data-act="' + act + '"]' + (extra || ''));
}

function all(w, sel) { return Array.from(w.document.querySelectorAll(sel)); }

function state(w) { return w.__doodh.state(); }

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log('  ok - ' + name);
}

console.log('ui tests');

test('first run shows onboarding with default prices', () => {
  const { w, d } = boot();
  assert.ok(d.querySelector('#sheet-root').classList.contains('open'), 'onboarding should open');
  assert.strictEqual(d.querySelector('#rate-ob-cow').value, '60');
  assert.strictEqual(d.querySelector('#rate-ob-buffalo').value, '80');
  assert.ok(!state(w).onboarded);
});

test('onboarding saves prices, name and language', () => {
  const { w, d } = boot();
  d.querySelector('#rate-ob-cow').value = '58';
  d.querySelector('#rate-ob-buffalo').value = '72.5';
  d.querySelector('#ob-name').value = 'Ramesh';
  clickAct(w, 'set-lang', '[data-lang="hi"]');
  assert.strictEqual(state(w).lang, 'hi');
  assert.strictEqual(d.querySelector('#rate-ob-cow').value, '58', 'typed price survives language switch');
  d.querySelector('#ob-name').value = 'Ramesh';
  clickAct(w, 'onboard-done');
  const s = state(w);
  assert.strictEqual(s.onboarded, true);
  assert.strictEqual(s.rates.cow, 58);
  assert.strictEqual(s.rates.buffalo, 72.5);
  assert.strictEqual(s.name, 'Ramesh');
  assert.ok(!d.querySelector('#sheet-root').classList.contains('open'), 'sheet closes');
  assert.ok(d.querySelector('#view-entry').classList.contains('active'));
});

test('plus/minus steppers update totals live', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  // 4 taps = 2.0 L of cow milk at 60
  for (let i = 0; i < 4; i++) click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="1"]');
  assert.strictEqual(d.querySelector('#q-cow-m').value, '2');
  assert.strictEqual(C.getSlot(state(w), TODAY, 'cow', 'm'), 2);
  assert.ok(d.querySelector('#hero-amt').textContent.indexOf('120') >= 0, 'hero shows 120');
  assert.ok(d.querySelector('#sa-cow-m').textContent.indexOf('120') >= 0);
  assert.strictEqual(d.querySelector('#hero-m').textContent, '2 L');
  // minus
  click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="-1"]');
  assert.strictEqual(d.querySelector('#q-cow-m').value, '1.5');
  // cannot go below zero
  for (let i = 0; i < 6; i++) click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="-1"]');
  assert.strictEqual(d.querySelector('#q-cow-m').value, '0');
});

test('typing an exact quantity works and is clamped', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  const input = d.querySelector('#q-buffalo-e');
  input.value = '1.25';
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.strictEqual(C.getSlot(state(w), TODAY, 'buffalo', 'e'), 1.25);
  assert.strictEqual(d.querySelector('#q-buffalo-e').value, '1.25');
  assert.ok(d.querySelector('#hero-amt').textContent.indexOf('100') >= 0, '1.25 x 80 = 100');
  const input2 = d.querySelector('#q-cow-m');
  input2.value = '999';
  input2.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.strictEqual(C.getSlot(state(w), TODAY, 'cow', 'm'), C.MAX_QTY);
});

test('copy yesterday fills the day', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="1"]');
  clickAct(w, 'day-next');
  assert.strictEqual(C.getSlot(state(w), C.addDays(TODAY, 1), 'cow', 'm'), 0);
  clickAct(w, 'copy-prev');
  assert.strictEqual(C.getSlot(state(w), C.addDays(TODAY, 1), 'cow', 'm'), 0.5);
  assert.strictEqual(d.querySelector('#q-cow-m').value, '0.5');
});

test('day navigation and date picker', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  clickAct(w, 'day-prev');
  assert.strictEqual(w.__doodh.ui().day, C.addDays(TODAY, -1));
  clickAct(w, 'day-next');
  assert.strictEqual(w.__doodh.ui().day, TODAY);
  clickAct(w, 'day-prev');
  const picker = d.querySelector('.date-overlay');
  picker.value = '2026-02-15';
  picker.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.strictEqual(w.__doodh.ui().day, '2026-02-15');
  assert.strictEqual(w.__doodh.ui().month, '2026-02');
});

test('month view summarises and lists days', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="1"]');  // 0.5 cow
  click(w, '[data-act="step"][data-type="buffalo"][data-slot="e"][data-dir="1"]'); // 0.5 buffalo
  clickAct(w, 'tab', '[data-tab="month"]');
  const view = d.querySelector('#view-month');
  assert.ok(view.classList.contains('active'));
  const mt = C.monthTotals(state(w), C.monthKey(new Date()));
  assert.strictEqual(mt.count, 1);
  assert.strictEqual(mt.amount, 70); // 0.5*60 + 0.5*80
  assert.ok(view.textContent.indexOf('₹70') >= 0, 'month total shown');
  assert.strictEqual(all(w, '.day-item').length, 1);
  // open the day sheet from the list
  click(w, '.day-item');
  assert.ok(d.querySelector('#sheet-root').classList.contains('open'));
  assert.ok(d.querySelectorAll('.sheet-qty').length === 4);
});

test('bill shows lines and shares text', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  for (let i = 0; i < 4; i++) click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="1"]');
  clickAct(w, 'tab', '[data-tab="bill"]');
  const view = d.querySelector('#view-bill');
  assert.ok(view.textContent.indexOf('₹120') >= 0, 'bill total ₹120 (2 L x 60)');
  assert.ok(view.textContent.indexOf('Cow milk') >= 0);
  assert.strictEqual(all(w, '.bill-table tbody tr').length, 1);
  // editing the name on the bill persists
  const nameInput = d.querySelector('#bill-name');
  nameInput.value = 'Sunita';
  nameInput.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.strictEqual(state(w).name, 'Sunita');
});

test('settings save new prices and names, entries reprice', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="1"]'); // 0.5 L
  clickAct(w, 'tab', '[data-tab="settings"]');
  d.querySelector('#rate-cow').value = '70';
  d.querySelector('#rate-buffalo').value = '90';
  clickAct(w, 'save-rates');
  assert.strictEqual(state(w).rates.cow, 70);
  d.querySelector('#name-cow').value = 'Desi cow';
  clickAct(w, 'save-names');
  assert.strictEqual(state(w).names.cow, 'Desi cow');
  clickAct(w, 'tab', '[data-tab="entry"]');
  assert.strictEqual(d.querySelector('#tf-cow').textContent, '₹35');
  assert.ok(d.querySelector('#view-entry').textContent.indexOf('Desi cow') >= 0);
});

test('language switch re-renders in Hindi', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  clickAct(w, 'lang');
  assert.strictEqual(state(w).lang, 'hi');
  assert.ok(d.querySelector('#view-entry').textContent.indexOf('आज का कुल') >= 0);
  assert.strictEqual(d.querySelector('.brand-title').textContent, 'दूध हिसाब');
  clickAct(w, 'lang');
  assert.strictEqual(state(w).lang, 'en');
});

test('clear day asks for confirmation', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="1"]');
  clickAct(w, 'clear-day');
  assert.ok(d.querySelector('#sheet-root').classList.contains('open'));
  clickAct(w, 'confirm-ok');
  assert.strictEqual(C.getSlot(state(w), TODAY, 'cow', 'm'), 0);
  assert.strictEqual(d.querySelector('#hero-amt').textContent.replace(/\s/g, ''), '₹0');
});

test('backup export + restore round trip', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  click(w, '[data-act="step"][data-type="buffalo"][data-slot="m"][data-dir="1"]');
  clickAct(w, 'tab', '[data-tab="settings"]');
  clickAct(w, 'backup-export');
  const code = d.querySelector('#export-box').value;
  assert.ok(code.length > 20);
  clickAct(w, 'sheet-close');
  clickAct(w, 'backup-import');
  d.querySelector('#import-box').value = code;
  clickAct(w, 'import-do');
  assert.strictEqual(C.getSlot(state(w), TODAY, 'buffalo', 'm'), 0.5);
  // bad code
  clickAct(w, 'backup-import');
  d.querySelector('#import-box').value = 'nonsense';
  clickAct(w, 'import-do');
  assert.strictEqual(C.getSlot(state(w), TODAY, 'buffalo', 'm'), 0.5, 'state untouched after bad import');
});

test('back button closes sheet, returns to entry, then exits', () => {
  const { w } = boot();
  clickAct(w, 'onboard-done');
  clickAct(w, 'tab', '[data-tab="settings"]');
  assert.strictEqual(w.__appBack(), 'true');
  assert.ok(w.document.querySelector('#view-entry').classList.contains('active'));
  clickAct(w, 'clear-day');
  assert.strictEqual(w.__appBack(), 'true');
  assert.ok(!w.document.querySelector('#sheet-root').classList.contains('open'));
  assert.strictEqual(w.__appBack(), 'false');
});

test('state persists through localStorage reload', () => {
  const { w, d } = boot();
  clickAct(w, 'onboard-done');
  click(w, '[data-act="step"][data-type="cow"][data-slot="m"][data-dir="1"]');
  const saved = w.localStorage.getItem('doodh-hisaab-v1');
  assert.ok(saved && saved.length > 20);
  const dom2 = new JSDOM(html, { runScripts: 'outside-only', url: 'https://app.local/' });
  dom2.window.scrollTo = () => {};
  dom2.window.localStorage.setItem('doodh-hisaab-v1', saved);
  dom2.window.eval(coreSrc);
  dom2.window.eval(appSrc);
  assert.strictEqual(dom2.window.__doodh.state().onboarded, true);
  assert.strictEqual(C.getSlot(dom2.window.__doodh.state(), TODAY, 'cow', 'm'), 0.5);
  assert.ok(!dom2.window.document.querySelector('#sheet-root').classList.contains('open'));
});

console.log('\n' + passed + ' ui tests passed');
