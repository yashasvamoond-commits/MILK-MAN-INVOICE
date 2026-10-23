/* Run with: node tests/core.test.js */
const assert = require('assert');
const C = require('../web/core.js');

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log('  ok - ' + name);
}

console.log('core tests');

test('date helpers', () => {
  assert.strictEqual(C.dateKey(new Date(2026, 0, 5)), '2026-01-05');
  assert.strictEqual(C.monthKey(new Date(2026, 9, 23)), '2026-10');
  assert.strictEqual(C.daysInMonth('2024-02'), 29);
  assert.strictEqual(C.daysInMonth('2026-02'), 28);
  assert.strictEqual(C.daysInMonth('2026-10'), 31);
  assert.strictEqual(C.addDays('2026-03-01', -1), '2026-02-28');
  assert.strictEqual(C.addMonths('2026-01', -1), '2025-12');
  assert.strictEqual(C.addMonths('2026-12', 1), '2027-01');
});

test('set / get slot and cleanup', () => {
  const s = C.emptyState();
  C.setSlot(s, '2026-10-23', 'cow', 'm', 2.5);
  C.setSlot(s, '2026-10-23', 'cow', 'e', 1.5);
  assert.strictEqual(C.getSlot(s, '2026-10-23', 'cow', 'm'), 2.5);
  assert.strictEqual(C.getSlot(s, '2026-10-23', 'cow', 'e'), 1.5);
  C.setSlot(s, '2026-10-23', 'cow', 'm', 0);
  C.setSlot(s, '2026-10-23', 'cow', 'e', 0);
  assert.strictEqual(C.hasEntry(s, '2026-10-23'), false);
  assert.deepStrictEqual(Object.keys(s.entries), []);
});

test('clamping and rounding', () => {
  const s = C.emptyState();
  C.setSlot(s, '2026-10-01', 'buffalo', 'm', 9999);
  assert.strictEqual(C.getSlot(s, '2026-10-01', 'buffalo', 'm'), C.MAX_QTY);
  C.setSlot(s, '2026-10-01', 'buffalo', 'm', 1.04);
  assert.strictEqual(C.getSlot(s, '2026-10-01', 'buffalo', 'm'), 1.04);
  C.setSlot(s, '2026-10-01', 'buffalo', 'm', 1.257);
  assert.strictEqual(C.getSlot(s, '2026-10-01', 'buffalo', 'm'), 1.26);
  C.setSlot(s, '2026-10-01', 'buffalo', 'm', -3);
  assert.strictEqual(C.hasEntry(s, '2026-10-01'), false);
});

test('daily totals use current rates', () => {
  const s = C.emptyState();
  s.rates = { cow: 60, buffalo: 80 };
  C.setSlot(s, '2026-10-02', 'cow', 'm', 2);
  C.setSlot(s, '2026-10-02', 'buffalo', 'e', 1);
  const t = C.dayTotals(s, '2026-10-02');
  assert.strictEqual(t.types.cow.amount, 120);
  assert.strictEqual(t.types.buffalo.amount, 80);
  assert.strictEqual(t.qty, 3);
  assert.strictEqual(t.amount, 200);
});

test('month totals + bill', () => {
  const s = C.emptyState();
  s.rates = { cow: 60, buffalo: 80 };
  for (let d = 1; d <= 5; d++) {
    const k = '2026-10-' + String(d).padStart(2, '0');
    C.setSlot(s, k, 'cow', 'm', 2);
    C.setSlot(s, k, 'cow', 'e', 1);
  }
  C.setSlot(s, '2026-11-01', 'cow', 'm', 5); // different month
  const t = C.monthTotals(s, '2026-10');
  assert.strictEqual(t.count, 5);
  assert.strictEqual(t.types.cow.m, 10);
  assert.strictEqual(t.types.cow.e, 5);
  assert.strictEqual(t.types.cow.qty, 15);
  assert.strictEqual(t.types.cow.amount, 900);
  const bill = C.billData(s, '2026-10');
  assert.strictEqual(bill.lines.length, 1);
  assert.strictEqual(bill.lines[0].id, 'cow');
  assert.strictEqual(bill.amount, 900);
});

test('previous day finder', () => {
  const s = C.emptyState();
  C.setSlot(s, '2026-10-20', 'cow', 'm', 2);
  C.setSlot(s, '2026-10-22', 'cow', 'e', 1);
  assert.strictEqual(C.findPreviousEntryDay(s, '2026-10-23', 3), '2026-10-22');
  assert.strictEqual(C.findPreviousEntryDay(s, '2026-10-20', 3), null);
});

test('copy day', () => {
  const s = C.emptyState();
  C.setSlot(s, '2026-10-21', 'cow', 'm', 2);
  C.setSlot(s, '2026-10-21', 'buffalo', 'e', 1.5);
  assert.strictEqual(C.copyDay(s, '2026-10-21', '2026-10-22'), true);
  assert.strictEqual(C.getSlot(s, '2026-10-22', 'buffalo', 'e'), 1.5);
  assert.strictEqual(C.copyDay(s, '2026-01-01', '2026-01-02'), false);
});

test('normalizeState cleans bad data', () => {
  const s = C.normalizeState({
    lang: 'hi',
    onboarded: true,
    rates: { cow: '55', buffalo: -1, bad: 3 },
    entries: {
      'bad-key': { cow: { m: 1 } },
      '2026-10-05': { cow: { m: 2.44, e: '1' }, buffalo: { m: 0, e: 0 } },
      '2026-10-06': { cow: {} }
    }
  });
  assert.strictEqual(s.lang, 'hi');
  assert.strictEqual(s.onboarded, true);
  assert.strictEqual(s.rates.cow, 55);
  assert.strictEqual(s.rates.buffalo, 80); // invalid kept default
  assert.strictEqual(s.entries['bad-key'], undefined);
  assert.strictEqual(s.entries['2026-10-05'].cow.m, 2.44);
  assert.strictEqual(s.entries['2026-10-05'].cow.e, 1);
  assert.strictEqual(s.entries['2026-10-05'].buffalo, undefined);
  assert.strictEqual(s.entries['2026-10-06'], undefined);
});

test('import / export round trip', () => {
  const s = C.emptyState();
  s.rates.cow = 62;
  C.setSlot(s, '2026-10-10', 'cow', 'm', 1.5);
  const back = C.importJSON(C.exportJSON(s));
  assert.deepStrictEqual(back.rates, s.rates);
  assert.strictEqual(C.getSlot(back, '2026-10-10', 'cow', 'm'), 1.5);
  assert.throws(() => C.importJSON('{}'), /Not a Doodh Hisaab backup/);
});

test('price changes never rewrite past months', () => {
  const s = C.emptyState();
  s.rates = { cow: 60, buffalo: 80 };
  C.setSlot(s, '2026-03-10', 'cow', 'm', 2);   // March locked at 60
  assert.strictEqual(C.dayTotals(s, '2026-03-10').amount, 120);
  s.rates.cow = 75;                            // price goes up in April
  C.lockMonthRates(s, '2026-04');
  C.setSlot(s, '2026-04-02', 'cow', 'm', 2);
  assert.strictEqual(C.dayTotals(s, '2026-04-02').amount, 150);
  assert.strictEqual(C.dayTotals(s, '2026-03-10').amount, 120, 'March keeps ₹60');
  assert.strictEqual(C.monthTotals(s, '2026-03').amount, 120);
  assert.strictEqual(C.monthTotals(s, '2026-04').amount, 150);
  assert.strictEqual(C.monthTotals(s, '2026-03').types.cow.rate, 60);
  assert.strictEqual(C.monthTotals(s, '2026-04').types.cow.rate, 75);
});

test('month snapshot is created on first entry of that month', () => {
  const s = C.emptyState();
  C.setSlot(s, '2026-05-01', 'buffalo', 'e', 1);
  assert.deepStrictEqual(s.monthRates['2026-05'], { cow: 60, buffalo: 80 });
  assert.strictEqual(C.rateFor(s, '2026-06', 'buffalo'), 80, 'unused month follows current price');
});

console.log('\n' + passed + ' tests passed');
