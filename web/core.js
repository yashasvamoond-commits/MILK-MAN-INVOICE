/* Doodh Hisaab — data model & calculations.
   Plain UMD file: usable in the browser (window.MilkCore) and in Node tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MilkCore = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var TYPE_IDS = ['cow', 'buffalo'];
  var SLOTS = ['m', 'e'];
  var MAX_QTY = 200;

  function pad2(n) { n = String(n); return n.length < 2 ? '0' + n : n; }

  function dateKey(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function monthKey(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1);
  }

  function monthOf(dayKey) { return String(dayKey).slice(0, 7); }

  function parseKey(dayKey) {
    var p = String(dayKey).split('-').map(Number);
    return new Date(p[0], (p[1] || 1) - 1, p[2] || 1);
  }

  function isValidDayKey(key) {
    return typeof key === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(key) && !isNaN(parseKey(key).getTime());
  }

  function isValidMonthKey(key) {
    return typeof key === 'string' && /^\d{4}-\d{2}$/.test(key);
  }

  function addDays(dayKey, n) {
    var d = parseKey(dayKey);
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }

  function addMonths(mk, n) {
    var p = mk.split('-').map(Number);
    return monthKey(new Date(p[0], p[1] - 1 + n, 1));
  }

  function daysInMonth(mk) {
    var p = mk.split('-').map(Number);
    return new Date(p[0], p[1], 0).getDate();
  }

  function round1(n) { return Math.round(n * 10) / 10; }
  function round2(n) { return Math.round(n * 100) / 100; }

  function clampQty(n) {
    var v = Number(n);
    if (!isFinite(v) || v < 0) return 0;
    if (v > MAX_QTY) return MAX_QTY;
    return round2(v);
  }

  function emptyState() {
    return {
      v: 1,
      lang: 'en',
      onboarded: false,
      rates: { cow: 60, buffalo: 80 },
      names: {},            // custom display names, optional
      name: '',             // customer name shown on the bill
      shop: '',             // dairy / milkman name shown on the bill
      entries: {}           // "YYYY-MM-DD" -> { cow: {m,e}, buffalo: {m,e} }
    };
  }

  function safeName(v) {
    if (typeof v !== 'string') return '';
    return v.trim().slice(0, 24);
  }

  function normalizeState(raw) {
    var s = emptyState();
    if (!raw || typeof raw !== 'object') return s;

    if (raw.lang === 'hi' || raw.lang === 'en') s.lang = raw.lang;
    s.onboarded = raw.onboarded === true;

    if (raw.rates && typeof raw.rates === 'object') {
      TYPE_IDS.forEach(function (id) {
        var r = Number(raw.rates[id]);
        if (isFinite(r) && r >= 0 && r <= 100000) s.rates[id] = round2(r);
      });
    }

    if (typeof raw.name === 'string') s.name = raw.name.trim().slice(0, 40);
    if (typeof raw.shop === 'string') s.shop = raw.shop.trim().slice(0, 40);

    if (raw.names && typeof raw.names === 'object') {
      TYPE_IDS.forEach(function (id) {
        var n = safeName(raw.names[id]);
        if (n) s.names[id] = n;
      });
    }

    if (raw.entries && typeof raw.entries === 'object') {
      Object.keys(raw.entries).forEach(function (key) {
        if (!isValidDayKey(key)) return;
        var e = raw.entries[key];
        if (!e || typeof e !== 'object') return;
        var out = {};
        TYPE_IDS.forEach(function (id) {
          var t = e[id];
          if (!t || typeof t !== 'object') return;
          var m = clampQty(t.m);
          var en = clampQty(t.e);
          if (m > 0 || en > 0) out[id] = { m: m, e: en };
        });
        if (Object.keys(out).length) s.entries[key] = out;
      });
    }
    return s;
  }

  function hasEntry(state, dayKey) {
    var e = state.entries[dayKey];
    if (!e) return false;
    return TYPE_IDS.some(function (id) { return e[id] && (e[id].m > 0 || e[id].e > 0); });
  }

  function getSlot(state, dayKey, typeId, slot) {
    var e = state.entries[dayKey];
    if (!e || !e[typeId]) return 0;
    return Number(e[typeId][slot]) || 0;
  }

  function setSlot(state, dayKey, typeId, slot, value) {
    if (!isValidDayKey(dayKey) || TYPE_IDS.indexOf(typeId) < 0 || SLOTS.indexOf(slot) < 0) return state;
    var v = clampQty(value);
    var entry = state.entries[dayKey] || {};
    var t = entry[typeId] || { m: 0, e: 0 };
    t = { m: Number(t.m) || 0, e: Number(t.e) || 0 };
    t[slot] = v;
    if (t.m > 0 || t.e > 0) entry[typeId] = t;
    else delete entry[typeId];
    if (Object.keys(entry).length) state.entries[dayKey] = entry;
    else delete state.entries[dayKey];
    return state;
  }

  function dayTotals(state, dayKey) {
    var entry = state.entries[dayKey] || {};
    var out = { types: {}, qty: 0, amount: 0, m: 0, e: 0 };
    TYPE_IDS.forEach(function (id) {
      var t = entry[id] || { m: 0, e: 0 };
      var rate = Number(state.rates[id]) || 0;
      var qty = round2((Number(t.m) || 0) + (Number(t.e) || 0));
      var amount = round2(qty * rate);
      out.types[id] = {
        m: Number(t.m) || 0,
        e: Number(t.e) || 0,
        qty: qty,
        rate: rate,
        amount: amount
      };
      out.qty = round2(out.qty + qty);
      out.amount = round2(out.amount + amount);
      out.m = round2(out.m + (Number(t.m) || 0));
      out.e = round2(out.e + (Number(t.e) || 0));
    });
    return out;
  }

  function entriesForMonth(state, mk) {
    if (!isValidMonthKey(mk)) return [];
    var prefix = mk + '-';
    return Object.keys(state.entries).filter(function (k) {
      return k.indexOf(prefix) === 0 && hasEntry(state, k);
    }).sort();
  }

  function monthTotals(state, mk) {
    var out = {
      month: mk,
      types: {},
      days: [],
      qty: 0,
      amount: 0,
      m: 0,
      e: 0,
      count: 0
    };
    TYPE_IDS.forEach(function (id) {
      out.types[id] = { m: 0, e: 0, qty: 0, amount: 0, rate: Number(state.rates[id]) || 0 };
    });
    var keys = entriesForMonth(state, mk);
    keys.forEach(function (day) {
      var d = dayTotals(state, day);
      out.days.push({ day: day, totals: d });
      out.qty = round2(out.qty + d.qty);
      out.amount = round2(out.amount + d.amount);
      out.m = round2(out.m + d.m);
      out.e = round2(out.e + d.e);
      TYPE_IDS.forEach(function (id) {
        var t = out.types[id];
        var dt = d.types[id];
        t.m = round2(t.m + dt.m);
        t.e = round2(t.e + dt.e);
        t.qty = round2(t.qty + dt.qty);
        t.amount = round2(t.amount + dt.amount);
      });
    });
    out.count = keys.length;
    return out;
  }

  // Most recent day (within lookback) that has data, strictly before dayKey.
  function findPreviousEntryDay(state, dayKey, lookback) {
    var n = lookback || 14;
    for (var i = 1; i <= n; i++) {
      var k = addDays(dayKey, -i);
      if (hasEntry(state, k)) return k;
    }
    return null;
  }

  function copyDay(state, fromKey, toKey) {
    var e = state.entries[fromKey];
    if (!e) return false;
    var copy = {};
    TYPE_IDS.forEach(function (id) {
      if (e[id]) copy[id] = { m: Number(e[id].m) || 0, e: Number(e[id].e) || 0 };
    });
    if (!Object.keys(copy).length) return false;
    state.entries[toKey] = JSON.parse(JSON.stringify(copy));
    return true;
  }

  function clearDay(state, dayKey) {
    delete state.entries[dayKey];
    return state;
  }

  // Bill lines for sharing / printing. Formatting left to the UI layer.
  function billData(state, mk) {
    var t = monthTotals(state, mk);
    var lines = TYPE_IDS.map(function (id) {
      return {
        id: id,
        name: (state.names && state.names[id]) || id,
        qty: t.types[id].qty,
        rate: t.types[id].rate,
        amount: t.types[id].amount,
        m: t.types[id].m,
        e: t.types[id].e
      };
    }).filter(function (l) { return l.qty > 0; });
    return { month: mk, lines: lines, qty: t.qty, amount: t.amount, m: t.m, e: t.e, count: t.count };
  }

  function exportJSON(state) {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(text) {
    var raw = JSON.parse(text);
    if (!raw || typeof raw !== 'object' || !raw.entries) throw new Error('Not a Doodh Hisaab backup');
    return normalizeState(raw);
  }

  return {
    TYPE_IDS: TYPE_IDS,
    SLOTS: SLOTS,
    MAX_QTY: MAX_QTY,
    dateKey: dateKey,
    monthKey: monthKey,
    monthOf: monthOf,
    parseKey: parseKey,
    isValidDayKey: isValidDayKey,
    isValidMonthKey: isValidMonthKey,
    addDays: addDays,
    addMonths: addMonths,
    daysInMonth: daysInMonth,
    round1: round1,
    round2: round2,
    clampQty: clampQty,
    emptyState: emptyState,
    normalizeState: normalizeState,
    hasEntry: hasEntry,
    getSlot: getSlot,
    setSlot: setSlot,
    dayTotals: dayTotals,
    entriesForMonth: entriesForMonth,
    monthTotals: monthTotals,
    findPreviousEntryDay: findPreviousEntryDay,
    copyDay: copyDay,
    clearDay: clearDay,
    billData: billData,
    exportJSON: exportJSON,
    importJSON: importJSON
  };
});
