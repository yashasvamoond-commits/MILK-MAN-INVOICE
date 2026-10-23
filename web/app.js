/* Doodh Hisaab — UI (ES5, no dependencies) */
(function () {
  'use strict';

  var C = window.MilkCore;
  var KEY = 'doodh-hisaab-v1';
  var VERSION = '1.0.0';
  var TODAY = C.dateKey(new Date());

  var state = C.emptyState();
  var ui = {
    tab: 'entry',
    month: C.monthKey(new Date()),
    day: TODAY
  };

  /* ============================ text ============================ */
  var STR = {
    en: {
      appName: 'Doodh Hisaab',
      tagline: 'Daily milk record',
      todayTotal: "Today's total",
      dayTotal: 'Day total',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      morning: 'Morning',
      evening: 'Evening',
      twoTimes: 'Morning + Evening',
      cowName: 'Cow milk',
      buffaloName: 'Buffalo milk',
      cowShort: 'Cow',
      buffaloShort: 'Buffalo',
      perLitre: 'per litre',
      tapRate: 'Tap to change price',
      sameAsYesterday: 'Same as yesterday',
      clearDay: 'Clear day',
      helper: 'Use + / − for 0.5 L, or tap the number to type.',
      saved: 'Saved automatically',
      day: 'day',
      days: 'days',
      total: 'Total',
      litre: 'litre',
      monthSummary: 'Month summary',
      thisMonth: 'This month',
      totalMilk: 'Total milk',
      daysRecorded: 'Days recorded',
      average: 'Average per day',
      averageShort: 'Daily avg',
      dailyRecord: 'Daily record',
      noEntries: 'No milk recorded yet',
      noEntriesSub: 'Add your first entry in the Entry tab.',
      noEntriesMonth: 'Nothing recorded this month',
      noEntriesMonthSub: 'Tap Entry to add today’s milk.',
      missingDays: 'days not recorded',
      bill: 'Milk bill',
      monthlyBill: 'Monthly bill',
      billFor: 'Bill for',
      yourNamePh: 'Your name',
      type: 'Milk',
      qty: 'Qty',
      rate: 'Price',
      amount: 'Amount',
      share: 'Share bill',
      copy: 'Copy',
      print: 'Print / save PDF',
      billNote: 'Please pay at the start of next month. Thank you!',
      nothingToBill: 'Nothing to bill yet',
      nothingToBillSub: 'Record some milk first, then come back here.',
      viewMonth: 'View month',
      settings: 'Settings',
      entry: 'Entry',
      month: 'Month',
      prices: 'Milk prices',
      pricesSub: 'Price per litre. New price starts from this month — old bills keep their old price.',
      pricePerLitre: 'Price per litre',
      names: 'Milk type names',
      namesSub: 'Leave empty to use the default name.',
      billDetails: 'Bill details',
      billDetailsSub: 'These appear on the bill you share.',
      dairyName: 'Dairy / milkman name',
      dairyNamePh: 'e.g. Sharma Dairy',
      language: 'Language',
      backup: 'Backup',
      backupSub: 'Keep a copy of all your records.',
      exportBackup: 'Export backup',
      restoreBackup: 'Restore backup',
      exportHint: 'Copy this code and keep it safe.',
      restoreHint: 'Paste your backup code below.',
      invalidBackup: 'That backup code is not valid.',
      restoreDone: 'Backup restored',
      reset: 'Delete all data',
      resetSub: 'All months will be removed from this phone.',
      resetConfirm: 'Delete every milk record? This cannot be undone.',
      delete: 'Delete',
      cancel: 'Cancel',
      save: 'Save',
      savedToast: 'Saved',
      copiedToast: 'Copied',
      copyFailed: 'Could not copy',
      clearConfirm: 'Clear all milk for this day?',
      clear: 'Clear',
      close: 'Close',
      done: 'Done',
      editDay: 'Edit day',
      shareTitle: 'Milk bill',
      welcomeTitle: 'Welcome!',
      welcomeLead: 'Set your milk prices once. Every day you just add the litres — we add up the bill.',
      start: 'Start recording',
      yourName: 'Your name (optional)',
      namePh: 'e.g. Ramesh',
      priceHint: 'You can change these any time in Settings.',
      priceHintMonth: 'Price used for this month',
      about: 'Made for small dairy accounts. Works offline. Your data stays on this phone.',
      goToday: 'Today',
      thisMonthShort: 'This month',
      noChange: 'Nothing to copy',
      copiedDay: 'Copied from yesterday',
      areYouSure: 'Are you sure?',
      balance: 'Amount',
      milk: 'milk'
    },
    hi: {
      appName: 'दूध हिसाब',
      tagline: 'रोज़ का दूध हिसाब',
      todayTotal: 'आज का कुल',
      dayTotal: 'दिन का कुल',
      today: 'आज',
      yesterday: 'पिछला दिन',
      tomorrow: 'अगला दिन',
      morning: 'सुबह',
      evening: 'शाम',
      twoTimes: 'सुबह + शाम',
      cowName: 'गाय का दूध',
      buffaloName: 'भैंस का दूध',
      cowShort: 'गाय',
      buffaloShort: 'भैंस',
      perLitre: 'प्रति लीटर',
      tapRate: 'दाम बदलने के लिए दबाएँ',
      sameAsYesterday: 'कल जैसा ही',
      clearDay: 'दिन खाली करें',
      helper: '+ / − से 0.5 लीटर, या नंबर दबाकर सीधे लिखें।',
      saved: 'अपने आप सेव होता है',
      day: 'दिन',
      days: 'दिन',
      total: 'कुल',
      litre: 'लीटर',
      monthSummary: 'महीने का हिसाब',
      thisMonth: 'इस महीने',
      totalMilk: 'कुल दूध',
      daysRecorded: 'दिन दर्ज',
      average: 'रोज़ का औसत',
      averageShort: 'रोज़ का औसत',
      dailyRecord: 'रोज़ का रिकॉर्ड',
      noEntries: 'अभी कोई दूध दर्ज नहीं',
      noEntriesSub: 'एंट्री टैब में पहली एंट्री भरें।',
      noEntriesMonth: 'इस महीने कुछ दर्ज नहीं',
      noEntriesMonthSub: 'आज का दूध भरने के लिए एंट्री दबाएँ।',
      missingDays: 'दिन दर्ज नहीं',
      bill: 'दूध का बिल',
      monthlyBill: 'महीने का बिल',
      billFor: 'किसका बिल',
      yourNamePh: 'आपका नाम',
      type: 'दूध',
      qty: 'मात्रा',
      rate: 'दाम',
      amount: 'रकम',
      share: 'बिल भेजें',
      copy: 'कॉपी',
      print: 'प्रिंट / PDF',
      billNote: 'कृपया अगले महीने की शुरुआत में भुगतान करें। धन्यवाद!',
      nothingToBill: 'अभी बिल नहीं है',
      nothingToBillSub: 'पहले दूध दर्ज करें, फिर यहाँ आएँ।',
      viewMonth: 'महीना देखें',
      settings: 'सेटिंग',
      entry: 'एंट्री',
      month: 'महीना',
      prices: 'दूध के दाम',
      pricesSub: 'प्रति लीटर दाम। नया दाम इसी महीने से लगेगा — पुराने बिल अपने पुराने दाम पर रहेंगे।',
      pricePerLitre: 'प्रति लीटर दाम',
      names: 'दूध के नाम',
      namesSub: 'खाली छोड़ें तो डिफ़ॉल्ट नाम रहेगा।',
      billDetails: 'बिल की जानकारी',
      billDetailsSub: 'यह बिल पर दिखेगा।',
      dairyName: 'डेयरी / दूध वाले का नाम',
      dairyNamePh: 'जैसे: शर्मा डेयरी',
      language: 'भाषा',
      backup: 'बैकअप',
      backupSub: 'अपने सारे रिकॉर्ड की कॉपी रखें।',
      exportBackup: 'बैकअप निकालें',
      restoreBackup: 'बैकअप वापस लाएँ',
      exportHint: 'इस कोड को कॉपी करके संभाल कर रखें।',
      restoreHint: 'अपना बैकअप कोड नीचे पेस्ट करें।',
      invalidBackup: 'यह बैकअप कोड सही नहीं है।',
      restoreDone: 'बैकअप वापस आ गया',
      reset: 'सारा डेटा मिटाएँ',
      resetSub: 'इस फ़ोन से सारे महीने हट जाएँगे।',
      resetConfirm: 'सारा दूध रिकॉर्ड मिटाना है? यह वापस नहीं आएगा।',
      delete: 'मिटाएँ',
      cancel: 'रद्द करें',
      save: 'सेव करें',
      savedToast: 'सेव हो गया',
      copiedToast: 'कॉपी हो गया',
      copyFailed: 'कॉपी नहीं हो सका',
      clearConfirm: 'इस दिन का सारा दूध खाली करें?',
      clear: 'खाली करें',
      close: 'बंद करें',
      done: 'ठीक है',
      editDay: 'दिन बदलें',
      shareTitle: 'दूध का बिल',
      welcomeTitle: 'स्वागत है!',
      welcomeLead: 'दूध के दाम एक बार तय करें। रोज़ सिर्फ़ लीटर भरें — महीने का हिसाब अपने आप बन जाएगा।',
      start: 'हिसाब शुरू करें',
      yourName: 'आपका नाम (वैकल्पिक)',
      namePh: 'जैसे: रमेश',
      priceHint: 'दाम आप कभी भी सेटिंग में बदल सकते हैं।',
      priceHintMonth: 'इस महीने का दाम',
      about: 'छोटे डेयरी हिसाब के लिए बनाया गया। बिना इंटरनेट चलता है। आपका डेटा इसी फ़ोन में रहता है।',
      goToday: 'आज',
      thisMonthShort: 'इस महीने',
      noChange: 'कॉपी करने के लिए कुछ नहीं',
      copiedDay: 'कल के हिसाब से भर दिया',
      areYouSure: 'पक्का?',
      balance: 'रकम',
      milk: 'दूध'
    }
  };

  function t(key) {
    var d = STR[state.lang] || STR.en;
    return d[key] || STR.en[key] || key;
  }

  /* ============================ dates & numbers ============================ */
  var MON_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MON_EN_S = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON_HI = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  var MON_HI_S = ['जन', 'फ़र', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'];
  var WD_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var WD_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  function groupIndian(str) {
    var p = String(str).split('.');
    var x = p[0];
    var last3 = x.slice(-3);
    var rest = x.slice(0, -3);
    if (rest) last3 = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
    return last3 + (p[1] ? '.' + p[1] : '');
  }

  function num(n) {
    n = Number(n) || 0;
    var neg = n < 0;
    n = Math.abs(n);
    var rounded = Math.round(n * 100) / 100;
    var s;
    if (rounded % 1 === 0) s = String(Math.round(rounded));
    else s = rounded.toFixed(2).replace(/0$/, '');
    return (neg ? '-' : '') + groupIndian(s);
  }

  function money(n) { return '₹' + num(n); }

  function qty(n) {
    var v = Math.round((Number(n) || 0) * 100) / 100;
    if (v % 1 === 0) return String(v);
    return v.toFixed(2).replace(/0$/, '');
  }

  function monthName(mk, short) {
    var p = String(mk).split('-').map(Number);
    var i = (p[1] || 1) - 1;
    var names = state.lang === 'hi' ? (short ? MON_HI_S : MON_HI) : (short ? MON_EN_S : MON_EN);
    return names[i] + ' ' + p[0];
  }

  function weekday(dayKey, short) {
    var d = C.parseKey(dayKey);
    return (state.lang === 'hi' ? WD_HI : WD_EN)[d.getDay()];
  }

  function dayLabel(dayKey) {
    var d = C.parseKey(dayKey);
    var mon = state.lang === 'hi' ? MON_HI_S[d.getMonth()] : MON_EN_S[d.getMonth()];
    return weekday(dayKey) + ', ' + d.getDate() + ' ' + mon + ' ' + d.getFullYear();
  }

  function relDay(dayKey) {
    if (dayKey === TODAY) return t('today');
    if (dayKey === C.addDays(TODAY, -1)) return t('yesterday');
    if (dayKey === C.addDays(TODAY, 1)) return t('tomorrow');
    return null;
  }

  function typeName(id) {
    var custom = state.names && state.names[id];
    if (custom) return custom;
    if (id === 'cow') return t('cowName');
    return t('buffaloName');
  }

  function typeShort(id) {
    var custom = state.names && state.names[id];
    if (custom) return custom;
    if (id === 'cow') return t('cowShort');
    return t('buffaloShort');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseNum(v) {
    var n = parseFloat(String(v == null ? '' : v).replace(',', '.').replace(/[^\d.\-]/g, ''));
    return isFinite(n) ? n : 0;
  }

  /* ============================ icons ============================ */
  var S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var ICON = {
    logo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#ffffff" d="M12 2.6c3.6 4.8 6.3 8.2 6.3 11.5a6.3 6.3 0 1 1-12.6 0C5.7 10.8 8.4 7.4 12 2.6z"/></svg>',
    entry: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4 20h4L19.5 8.5a2.83 2.83 0 0 0-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><rect x="3.2" y="5" width="17.6" height="16" rx="2.6"/><path d="M8 3v4M16 3v4M3.2 10h17.6"/></svg>',
    bill: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M6 3.2h12v17.6l-3-2-3 2-3-2-3 2V3.2z"/><path d="M9.2 8.2h5.6M9.2 12h5.6"/></svg>',
    settings: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4 7h8M16 7h4M4 12h3M11 12h9M4 17h8M16 17h4"/><circle cx="14" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="14" cy="17" r="2"/></svg>',
    sun: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z"/></svg>',
    left: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    chev: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    pen: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4 20h4L19.5 8.5a2.83 2.83 0 0 0-4-4L4 16v4z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.4"/><path d="M5.5 15V5.5a2 2 0 0 1 2-2H16"/></svg>',
    share: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="18" cy="5.5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="18.5" r="2.4"/><path d="M8.2 10.9l7.6-4.2M8.2 13.1l7.6 4.2"/></svg>',
    print: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M7 9V3.5h10V9"/><rect x="4" y="9" width="16" height="7.5" rx="2"/><path d="M7 16.5h10v4H7z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4 7h16M9.5 7V4h5v3M6.5 7l1 13.5h9L17.5 7"/><path d="M10.5 11v6M13.5 11v6"/></svg>',
    download: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M12 3.5v11M7.5 10.5L12 15l4.5-4.5M5 20.5h14"/></svg>',
    restore: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4.2 12a7.8 7.8 0 1 0 2.6-5.8M4.2 4.4v4.2h4.2"/><path d="M12 8v4.6l3 1.8"/></svg>',
    target: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="12" cy="12" r="7.8"/><circle cx="12" cy="12" r="2.6"/></svg>',
    check: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>'
  };

  /* ============================ storage ============================ */
  function bridge() {
    return (typeof window.Android !== 'undefined' && window.Android) ? window.Android : null;
  }

  function loadState() {
    var raw = null;
    try {
      var b = bridge();
      if (b && typeof b.load === 'function') raw = b.load();
      else raw = window.localStorage.getItem(KEY);
    } catch (e) { raw = null; }
    if (raw && String(raw).length > 2) {
      try { state = C.importJSON(raw); } catch (e) { state = C.emptyState(); }
    } else {
      state = C.emptyState();
    }
  }

  function saveState() {
    var s;
    try { s = JSON.stringify(state); } catch (e) { return; }
    try {
      var b = bridge();
      if (b && typeof b.save === 'function') b.save(s);
      else window.localStorage.setItem(KEY, s);
    } catch (e) { /* storage full or blocked */ }
  }

  function buzz(ms) {
    try {
      var b = bridge();
      if (b && typeof b.vibrate === 'function') { b.vibrate(); return; }
      if (navigator.vibrate) navigator.vibrate(ms || 8);
    } catch (e) { /* ignore */ }
  }

  /* ============================ tiny DOM helpers ============================ */
  function byId(id) { return document.getElementById(id); }

  function toast(msg) {
    var el = byId('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove('show'); }, 2100);
  }

  function openSheet(html, dismissible) {
    var root = byId('sheet-root');
    root.innerHTML =
      '<div class="scrim" data-act="' + (dismissible === false ? 'noop' : 'sheet-close') + '"></div>' +
      '<div class="sheet" role="dialog" aria-modal="true">' +
      '<div class="sheet-grip"></div>' + html +
      '</div>';
    root.classList.add('open');
  }

  function closeSheet() {
    var root = byId('sheet-root');
    root.classList.remove('open');
    root.innerHTML = '';
    sheetState = null;
  }

  var sheetState = null;

  function confirmSheet(title, sub, okLabel, onOk, danger) {
    sheetState = { type: 'confirm', onOk: onOk };
    var html =
      '<div class="sheet-title">' + esc(title) + '</div>' +
      '<div class="sheet-sub">' + esc(sub) + '</div>' +
      '<div class="btn-row">' +
      '<button class="btn" data-act="sheet-close">' + esc(t('cancel')) + '</button>' +
      '<button class="btn ' + (danger ? 'danger' : 'primary') + '" data-act="confirm-ok">' + esc(okLabel) + '</button>' +
      '</div>';
    openSheet(html);
  }

  /* ============================ rendering ============================ */
  function renderAll() {
    document.documentElement.lang = state.lang === 'hi' ? 'hi' : 'en';
    document.body.classList.toggle('hindi', state.lang === 'hi');
    renderTopbar();
    renderTabs();
    renderView();
    if (!state.onboarded) openOnboarding();
  }

  function renderTopbar() {
    var html = '<div class="brand-row">' +
      '<div class="brand-mark">' + ICON.logo + '</div>' +
      '<div class="brand-text">' +
      '<div class="brand-title">' + esc(t('appName')) + '</div>' +
      '<div class="brand-sub">' + esc(ui.tab === 'settings' ? t('settings') : t('tagline')) + '</div>' +
      '</div>' +
      '<button class="lang-pill" data-act="lang" aria-label="Change language">' + (state.lang === 'hi' ? 'English' : 'हिंदी') + '</button>' +
      '</div>';

    if (ui.tab === 'month' || ui.tab === 'bill') {
      var mt = C.monthTotals(state, ui.month);
      var isNow = ui.month === C.monthKey(new Date());
      html += '<div class="month-bar">' +
        '<button class="icon-btn" data-act="month-prev" aria-label="Previous month">' + ICON.left + '</button>' +
        '<div class="month-label"><span>' + esc(monthName(ui.month, false)) + '</span>' +
        '<small>· ' + (mt.count || 0) + ' ' + esc(t('days')) + '</small></div>' +
        '<button class="icon-btn" data-act="month-next" aria-label="Next month">' + ICON.right + '</button>' +
        (isNow ? '' : '<button class="icon-btn ghost" data-act="month-now" aria-label="This month">' + ICON.target + '</button>') +
        '</div>';
      renderTopbar._month = true;
    }
    byId('topbar').innerHTML = html;
  }

  function renderTabs() {
    var tabs = [
      { id: 'entry', label: t('entry'), icon: ICON.entry },
      { id: 'month', label: t('month'), icon: ICON.calendar },
      { id: 'bill', label: t('bill'), icon: ICON.bill },
      { id: 'settings', label: t('settings'), icon: ICON.settings }
    ];
    var html = '';
    tabs.forEach(function (tab) {
      html += '<button class="tab ' + (ui.tab === tab.id ? 'on' : '') + '" data-act="tab" data-tab="' + tab.id + '" aria-current="' + (ui.tab === tab.id ? 'page' : 'false') + '">' +
        '<span class="tab-in">' + tab.icon + '<span>' + esc(tab.label) + '</span></span>' +
        '</button>';
    });
    byId('tabbar').innerHTML = html;
  }

  function renderView() {
    ['entry', 'month', 'bill', 'settings'].forEach(function (name) {
      var el = byId('view-' + name);
      el.classList.toggle('active', name === ui.tab);
    });
    if (ui.tab === 'entry') renderEntry();
    else if (ui.tab === 'month') renderMonth();
    else if (ui.tab === 'bill') renderBill();
    else renderSettings();
  }

  /* ---------------- entry ---------------- */
  function slotHTML(type, slot) {
    var isM = slot === 'm';
    var v = C.getSlot(state, ui.day, type, slot);
    var rate = C.rateFor(state, C.monthOf(ui.day), type);
    return '<div class="slot">' +
      '<div class="slot-head"><span class="slot-title">' + (isM ? ICON.sun : ICON.moon) + '<span>' + esc(isM ? t('morning') : t('evening')) + '</span></span><span>L</span></div>' +
      '<div class="stepper">' +
      '<button class="step-btn" data-act="step" data-type="' + type + '" data-slot="' + slot + '" data-dir="-1" aria-label="minus">&minus;</button>' +
      '<input class="qty-input" id="q-' + type + '-' + slot + '" data-type="' + type + '" data-slot="' + slot + '" type="text" inputmode="decimal" autocomplete="off" value="' + qty(v) + '" aria-label="' + esc((isM ? t('morning') : t('evening')) + ' ' + typeName(type)) + '">' +
      '<button class="step-btn" data-act="step" data-type="' + type + '" data-slot="' + slot + '" data-dir="1" aria-label="plus">+</button>' +
      '</div>' +
      '<div class="slot-amount" id="sa-' + type + '-' + slot + '">' + (v > 0 ? '= ' + money(v * rate) : '&nbsp;') + '</div>' +
      '</div>';
  }

  function typeCardHTML(type) {
    var d = C.dayTotals(state, ui.day);
    var tt = d.types[type];
    return '<div class="card type-card">' +
      '<div class="type-head">' +
      '<div class="type-name"><span class="dot ' + type + '"></span>' + esc(typeName(type)) + '</div>' +
      '<div class="type-rate">' + money(C.rateFor(state, C.monthOf(ui.day), type)) + ' / ' + esc(t('litre')) + '</div>' +
      '</div>' +
      '<div class="stepper-row">' + slotHTML(type, 'm') + slotHTML(type, 'e') + '</div>' +
      '<div class="type-foot"><span>' + esc(t('total')) + '</span>' +
      '<span><b id="tq-' + type + '">' + qty(tt.qty) + '</b> L · <b id="tf-' + type + '">' + money(tt.amount) + '</b></span></div>' +
      '</div>';
  }

  function renderEntry() {
    var el = byId('view-entry');
    var d = ui.day;
    var dt = C.dayTotals(state, d);
    var rel = relDay(d);

    var html = '';

    html += '<div class="day-nav">' +
      '<button class="icon-btn" data-act="day-prev" aria-label="Previous day">' + ICON.left + '</button>' +
      '<div class="day-btn">' +
      '<button class="btn day-btn-in" data-act="noop">' + ICON.calendar +
      '<span><b>' + esc(rel || weekday(d)) + '</b> · ' + esc(dayLabel(d)) + '</span>' +
      '</button>' +
      '<input class="date-overlay" type="date" value="' + d + '" aria-label="Pick date">' +
      '</div>' +
      '<button class="icon-btn" data-act="day-next" aria-label="Next day">' + ICON.right + '</button>' +
      (rel === t('today') ? '' : '<button class="chip-btn" data-act="day-today">' + esc(t('goToday')) + '</button>') +
      '</div>';

    html += '<div class="hero">' +
      '<div class="eyebrow">' + esc(rel === t('today') ? t('todayTotal') : t('dayTotal')) + '</div>' +
      '<div class="hero-amount" id="hero-amt"><span class="cur">₹</span>' + num(dt.amount) + '</div>' +
      '<div class="hero-meta"><span><b id="hero-qty">' + qty(dt.qty) + '</b> ' + esc(t('litre')) + ' ' + esc(t('milk')) + '</span><span>·</span><span>' + esc(t('twoTimes')) + '</span></div>' +
      '<div class="hero-split">' +
      '<div class="pill-stat">' + esc(t('morning')) + '<b id="hero-m">' + qty(dt.m) + ' L</b></div>' +
      '<div class="pill-stat">' + esc(t('evening')) + '<b id="hero-e">' + qty(dt.e) + ' L</b></div>' +
      '</div>' +
      '</div>';

    html += '<div class="rate-strip">' +
      C.TYPE_IDS.map(function (id) {
        return '<button class="rate-chip" data-act="open-prices">' +
          '<span class="dot ' + id + '"></span>' +
          '<span class="chip-txt"><span class="lbl">' + esc(typeShort(id)) + '</span>' +
          '<span class="val">' + money(C.rateFor(state, C.monthOf(d), id)) + ' / L</span></span>' +
          '<span class="pen">' + ICON.pen + '</span>' +
          '</button>';
      }).join('') +
      '</div>';

    html += typeCardHTML('cow');
    html += typeCardHTML('buffalo');

    html += '<p class="helper">' + esc(t('helper')) + '</p>';

    html += '<div class="btn-row">' +
      '<button class="btn soft" data-act="copy-prev">' + ICON.copy + '<span>' + esc(t('sameAsYesterday')) + '</span></button>' +
      '<button class="btn" data-act="clear-day">' + ICON.trash + '<span>' + esc(t('clearDay')) + '</span></button>' +
      '</div>';

    var mt = C.monthTotals(state, C.monthOf(d));
    html += '<div class="card tight month-mini" data-act="tab" data-tab="month" role="button" tabindex="0">' +
      '<div class="kv"><span class="k">' + esc(t('thisMonth')) + ' · ' + esc(monthName(C.monthOf(d), true)) + '</span>' +
      '<span class="v">' + money(mt.amount) + ' <span class="day-chev" style="display:inline-flex;vertical-align:-2px;margin-left:2px">' + ICON.chev + '</span></span></div>' +
      '<div class="kv"><span class="k">' + esc(t('totalMilk')) + '</span><span class="v">' + qty(mt.qty) + ' L · ' + mt.count + ' ' + esc(t('days')) + '</span></div>' +
      '</div>';

    html += '<div class="saved-hint">' + ICON.check + '<span>' + esc(t('saved')) + '</span></div>';

    el.innerHTML = html;
  }

  function syncEntry() {
    if (ui.tab !== 'entry') return;
    var d = ui.day;
    var dt = C.dayTotals(state, d);
    C.TYPE_IDS.forEach(function (type) {
      C.SLOTS.forEach(function (slot) {
        var input = byId('q-' + type + '-' + slot);
        if (input && document.activeElement !== input) input.value = qty(C.getSlot(state, d, type, slot));
        var sa = byId('sa-' + type + '-' + slot);
        if (sa) {
          var v = C.getSlot(state, d, type, slot);
          sa.innerHTML = v > 0 ? '= ' + money(v * C.rateFor(state, C.monthOf(d), type)) : '&nbsp;';
        }
      });
      var tq = byId('tq-' + type);
      var tf = byId('tf-' + type);
      if (tq) tq.textContent = qty(dt.types[type].qty);
      if (tf) tf.textContent = money(dt.types[type].amount);
    });
    var amt = byId('hero-amt');
    if (amt) amt.innerHTML = '<span class="cur">₹</span>' + num(dt.amount);
    var hq = byId('hero-qty');
    if (hq) hq.textContent = qty(dt.qty);
    var hm = byId('hero-m');
    if (hm) hm.textContent = qty(dt.m) + ' L';
    var he = byId('hero-e');
    if (he) he.textContent = qty(dt.e) + ' L';

    var mini = document.querySelector('.month-mini .kv .v');
    if (mini) {
      var mt = C.monthTotals(state, C.monthOf(d));
      mini.innerHTML = money(mt.amount) + ' <span class="day-chev" style="display:inline-flex;vertical-align:-2px;margin-left:2px">' + ICON.chev + '</span>';
      var mini2 = document.querySelectorAll('.month-mini .kv .v')[1];
      if (mini2) mini2.textContent = qty(mt.qty) + ' L · ' + mt.count + ' ' + t('days');
    }
  }

  /* ---------------- month ---------------- */
  function renderMonth() {
    var el = byId('view-month');
    var mt = C.monthTotals(state, ui.month);
    var html = '';

    if (!mt.count) {
      html += '<div class="card empty-card">' +
        '<div class="empty"><b>' + esc(t('noEntriesMonth')) + '</b>' + esc(t('noEntriesMonthSub')) + '</div>' +
        '<button class="btn primary" data-act="tab" data-tab="entry">' + ICON.entry + '<span>' + esc(t('entry')) + '</span></button>' +
        '</div>';
    } else {
      html += '<div class="card">' +
        '<div class="eyebrow">' + esc(t('monthSummary')) + '</div>' +
        '<div class="big-amount">' + money(mt.amount) + '</div>' +
        '<div class="sub-line">' + qty(mt.qty) + ' L · ' + mt.count + ' ' + esc(t('days')) + '</div>' +
        '<div class="stat-grid">' +
        '<div class="stat"><span>' + esc(t('morning')) + '</span><b>' + qty(mt.m) + ' L</b></div>' +
        '<div class="stat"><span>' + esc(t('evening')) + '</span><b>' + qty(mt.e) + ' L</b></div>' +
        '<div class="stat"><span class="long">' + esc(t('average')) + '</span><b>' + money(mt.count ? mt.amount / mt.count : 0) + '</b></div>' +
        '</div>' +
        '<div class="divider"></div>' +
        C.TYPE_IDS.map(function (id) {
          var tt = mt.types[id];
          if (!tt.qty) return '';
          return '<div class="kv"><span class="k"><span class="dot ' + id + '" style="display:inline-block;margin-right:6px"></span>' + esc(typeName(id)) + '</span>' +
            '<span class="v">' + qty(tt.qty) + ' L × ' + money(state.rates[id] || 0) + '</span></div>' +
            '<div class="kv"><span class="k" style="padding-left:15px">' + esc(t('amount')) + '</span><span class="v">' + money(tt.amount) + '</span></div>';
        }).join('') +
        '</div>';
    }

    if (mt.count) {
      html += '<div class="card">' +
        '<div class="card-head"><div class="card-title">' + esc(t('dailyRecord')) + '</div>' +
        '<span class="tag">' + mt.count + ' ' + esc(t('days')) + '</span></div>' +
        '<div class="day-list">' +
        mt.days.slice().reverse().map(function (row) {
          var d = C.dayTotals(state, row.day);
          var parts = C.TYPE_IDS.filter(function (id) { return d.types[id].qty > 0; }).map(function (id) {
            return typeShort(id) + ' <em>' + qty(d.types[id].m) + '+' + qty(d.types[id].e) + '</em>';
          });
          var isToday = row.day === TODAY;
          return '<button class="day-item" data-act="open-day" data-day="' + row.day + '">' +
            '<span class="date-badge' + (isToday ? ' today' : '') + '"><b>' + C.parseKey(row.day).getDate() + '</b><span>' + esc(weekday(row.day)) + '</span></span>' +
            '<span class="day-mid"><span class="day-title">' + esc(relDay(row.day) || weekday(row.day)) + '</span>' +
            '<span class="day-detail">' + parts.join(' · ') + '</span></span>' +
            '<span class="day-amount">' + money(d.amount) + '</span>' +
            '<span class="day-chev">' + ICON.chev + '</span>' +
            '</button>';
        }).join('') +
        '</div>' +
        '</div>';
    }

    // missing days note
    var dim = C.daysInMonth(ui.month);
    var nowMk = C.monthKey(new Date());
    var upto = ui.month < nowMk ? dim : (ui.month === nowMk ? C.parseKey(TODAY).getDate() : 0);
    var missing = Math.max(0, upto - mt.count);
    if (missing > 0 && mt.count > 0) {
      html += '<p class="missing-note">' + missing + ' ' + esc(t('missingDays')) + '</p>';
    }

    el.innerHTML = html;
  }

  /* ---------------- bill ---------------- */
  function billText() {
    var b = C.billData(state, ui.month);
    var lines = [];
    lines.push('🥛 ' + (state.shop ? state.shop + ' — ' : '') + t('bill'));
    lines.push(monthName(ui.month, false));
    if (state.name) lines.push(t('billFor') + ': ' + state.name);
    lines.push('');
    b.lines.forEach(function (line) {
      lines.push(typeName(line.id) + ': ' + qty(line.qty) + ' L × ₹' + num(line.rate) + ' = ₹' + num(line.amount));
    });
    lines.push('');
    lines.push(t('morning') + ': ' + qty(b.m) + ' L · ' + t('evening') + ': ' + qty(b.e) + ' L');
    lines.push(t('daysRecorded') + ': ' + b.count);
    lines.push('');
    lines.push('TOTAL: ₹' + num(b.amount));
    if (state.shop || state.name) lines.push('');
    return lines.join('\n');
  }

  function renderBill() {
    var el = byId('view-bill');
    var b = C.billData(state, ui.month);
    var html = '';

    if (!b.lines.length) {
      html += '<div class="card empty-card">' +
        '<div class="empty"><b>' + esc(t('nothingToBill')) + '</b>' + esc(t('nothingToBillSub')) + '</div>' +
        '<button class="btn primary" data-act="tab" data-tab="entry">' + ICON.entry + '<span>' + esc(t('entry')) + '</span></button>' +
        '</div>';
      el.innerHTML = html;
      return;
    }

    html += '<div class="card bill">' +
      '<div class="bill-top">' +
      '<div class="bill-title">' + esc(state.shop || t('appName')) + '</div>' +
      '<div class="bill-month">' + esc(t('monthlyBill')) + ' · ' + esc(monthName(ui.month, false)) + '</div>' +
      '</div>' +
      '<div class="bill-to no-print"><span>' + esc(t('billFor')) + '</span>' +
      '<input class="bill-name" id="bill-name" type="text" maxlength="40" placeholder="' + esc(t('yourNamePh')) + '" value="' + esc(state.name || '') + '"></div>' +
      '<div class="bill-to print-only"><span>' + esc(t('billFor')) + '</span><b>' + esc(state.name || '—') + '</b></div>' +
      '<table class="bill-table"><thead><tr>' +
      '<th>' + esc(t('type')) + '</th><th>' + esc(t('qty')) + '</th><th>' + esc(t('rate')) + '</th><th>' + esc(t('amount')) + '</th>' +
      '</tr></thead><tbody>' +
      b.lines.map(function (line) {
        return '<tr><td>' + esc(typeName(line.id)) + '</td><td>' + qty(line.qty) + ' L</td><td>' + money(line.rate) + '</td><td>' + money(line.amount) + '</td></tr>';
      }).join('') +
      '</tbody></table>' +
      '<div class="bill-total"><span>' + esc(t('total')) + '</span><b>' + money(b.amount) + '</b></div>' +
      '<div class="bill-note">' + esc(t('morning')) + ' ' + qty(b.m) + ' L · ' + esc(t('evening')) + ' ' + qty(b.e) + ' L · ' + b.count + ' ' + esc(t('days')) + '<br>' + esc(t('billNote')) + '</div>' +
      '</div>';

    html += '<div class="btn-row no-print">' +
      '<button class="btn primary" data-act="share-bill">' + ICON.share + '<span>' + esc(t('share')) + '</span></button>' +
      '<button class="btn" data-act="copy-bill">' + ICON.copy + '<span>' + esc(t('copy')) + '</span></button>' +
      '</div>';
    html += '<button class="btn ghost no-print" data-act="print-bill">' + ICON.print + '<span>' + esc(t('print')) + '</span></button>';

    el.innerHTML = html;
  }

  /* ---------------- settings ---------------- */
  function rateField(id, label, value) {
    return '<div class="field">' +
      '<label for="rate-' + id + '">' + esc(label) + ' — ' + esc(t('pricePerLitre')) + '</label>' +
      '<div class="input-wrap"><span class="prefix">₹</span>' +
      '<input class="input" id="rate-' + id + '" type="text" inputmode="decimal" autocomplete="off" value="' + num(value) + '" placeholder="0">' +
      '</div></div>';
  }

  function renderSettings() {
    var el = byId('view-settings');
    var html = '';

    html += '<div class="card" id="sec-rates">' +
      '<div class="card-title">' + esc(t('prices')) + '</div>' +
      '<div class="card-sub">' + esc(t('pricesSub')) + '</div>' +
      rateField('cow', typeName('cow'), state.rates.cow) +
      rateField('buffalo', typeName('buffalo'), state.rates.buffalo) +
      '<button class="btn primary" data-act="save-rates">' + ICON.check + '<span>' + esc(t('save')) + '</span></button>' +
      '</div>';

    html += '<div class="card">' +
      '<div class="card-title">' + esc(t('names')) + '</div>' +
      '<div class="card-sub">' + esc(t('namesSub')) + '</div>' +
      '<div class="field"><label for="name-cow">' + esc(t('cowName')) + '</label>' +
      '<input class="input" id="name-cow" type="text" maxlength="24" value="' + esc((state.names && state.names.cow) || '') + '" placeholder="' + esc(t('cowName')) + '"></div>' +
      '<div class="field"><label for="name-buffalo">' + esc(t('buffaloName')) + '</label>' +
      '<input class="input" id="name-buffalo" type="text" maxlength="24" value="' + esc((state.names && state.names.buffalo) || '') + '" placeholder="' + esc(t('buffaloName')) + '"></div>' +
      '<button class="btn" data-act="save-names">' + ICON.check + '<span>' + esc(t('save')) + '</span></button>' +
      '</div>';

    html += '<div class="card">' +
      '<div class="card-title">' + esc(t('billDetails')) + '</div>' +
      '<div class="card-sub">' + esc(t('billDetailsSub')) + '</div>' +
      '<div class="field"><label for="bill-shop">' + esc(t('dairyName')) + '</label>' +
      '<input class="input" id="bill-shop" type="text" maxlength="40" value="' + esc(state.shop || '') + '" placeholder="' + esc(t('dairyNamePh')) + '"></div>' +
      '<div class="field"><label for="bill-customer">' + esc(t('billFor')) + '</label>' +
      '<input class="input" id="bill-customer" type="text" maxlength="40" value="' + esc(state.name || '') + '" placeholder="' + esc(t('yourNamePh')) + '"></div>' +
      '<button class="btn" data-act="save-bill">' + ICON.check + '<span>' + esc(t('save')) + '</span></button>' +
      '</div>';

    html += '<div class="card">' +
      '<div class="card-title">' + esc(t('language')) + '</div>' +
      '<div class="seg" style="margin-top:10px">' +
      '<button class="' + (state.lang === 'en' ? 'on' : '') + '" data-act="set-lang" data-lang="en">English</button>' +
      '<button class="' + (state.lang === 'hi' ? 'on' : '') + '" data-act="set-lang" data-lang="hi">हिंदी</button>' +
      '</div></div>';

    html += '<div class="card">' +
      '<div class="card-title">' + esc(t('backup')) + '</div>' +
      '<div class="card-sub">' + esc(t('backupSub')) + '</div>' +
      '<div class="btn-row" style="margin-top:12px">' +
      '<button class="btn soft" data-act="backup-export">' + ICON.download + '<span>' + esc(t('exportBackup')) + '</span></button>' +
      '<button class="btn" data-act="backup-import">' + ICON.restore + '<span>' + esc(t('restoreBackup')) + '</span></button>' +
      '</div></div>';

    html += '<div class="card">' +
      '<div class="settings-row"><div><div>' + esc(t('reset')) + '</div><div class="sub">' + esc(t('resetSub')) + '</div></div>' +
      '<button class="mini-btn danger" data-act="reset-all" aria-label="' + esc(t('reset')) + '">' + ICON.trash + '</button></div>' +
      '</div>';

    html += '<div class="about">' + esc(t('appName')) + ' v' + VERSION + '<br>' + esc(t('about')) + '</div>';

    el.innerHTML = html;
  }

  /* ============================ sheets ============================ */
  function openOnboarding() {
    sheetState = { type: 'onboard' };
    var html =
      '<div class="onboard">' +
      '<div class="brand-mark">' + ICON.logo + '</div>' +
      '<div class="seg" style="margin-bottom:16px;max-width:190px">' +
      '<button class="' + (state.lang === 'en' ? 'on' : '') + '" data-act="set-lang" data-lang="en">English</button>' +
      '<button class="' + (state.lang === 'hi' ? 'on' : '') + '" data-act="set-lang" data-lang="hi">हिंदी</button>' +
      '</div>' +
      '<h1>' + esc(t('welcomeTitle')) + '</h1>' +
      '<p class="lead">' + esc(t('welcomeLead')) + '</p>' +
      rateField('ob-cow', typeName('cow'), state.rates.cow) +
      rateField('ob-buffalo', typeName('buffalo'), state.rates.buffalo) +
      '<div class="field"><label for="ob-name">' + esc(t('yourName')) + '</label>' +
      '<input class="input" id="ob-name" type="text" maxlength="40" value="' + esc(state.name || '') + '" placeholder="' + esc(t('namePh')) + '"></div>' +
      '<p class="step-hint">' + esc(t('priceHint')) + '</p>' +
      '<div class="btn-row one">' +
      '<button class="btn primary" data-act="onboard-done">' + ICON.check + '<span>' + esc(t('start')) + '</span></button>' +
      '</div>' +
      '</div>';
    openSheet(html, false);
  }

  function readRateInput(id, fallback) {
    var el = byId(id);
    if (!el) return fallback;
    var v = parseNum(el.value);
    if (v < 0 || v > 100000) return fallback;
    return C.round2(v);
  }

  function openDaySheet(dayKey) {
    var d = C.dayTotals(state, dayKey);
    sheetState = { type: 'day', day: dayKey };
    function row(id, label, icon) {
      return '<div class="sheet-section">' +
        '<div class="type-name" style="margin-bottom:8px"><span class="dot ' + id + '"></span>' + esc(label) + '</div>' +
        '<div class="stepper-row">' +
        [['m', t('morning'), ICON.sun], ['e', t('evening'), ICON.moon]].map(function (s) {
          var v = C.getSlot(state, dayKey, id, s[0]);
          return '<div class="slot">' +
            '<div class="slot-head"><span class="slot-title">' + s[2] + '<span>' + esc(s[1]) + '</span></span><span>L</span></div>' +
            '<div class="stepper">' +
            '<button class="step-btn" data-act="sheet-step" data-type="' + id + '" data-slot="' + s[0] + '" data-dir="-1" aria-label="minus">&minus;</button>' +
            '<input class="qty-input sheet-qty" data-type="' + id + '" data-slot="' + s[0] + '" type="text" inputmode="decimal" value="' + qty(v) + '">' +
            '<button class="step-btn" data-act="sheet-step" data-type="' + id + '" data-slot="' + s[0] + '" data-dir="1" aria-label="plus">+</button>' +
            '</div></div>';
        }).join('') +
        '</div></div>';
    }
    var html =
      '<div class="sheet-title">' + esc(dayLabel(dayKey)) + '</div>' +
      '<div class="sheet-sub">' + esc(t('editDay')) + ' · ' + money(d.amount) + '</div>' +
      row('cow', typeName('cow')) + row('buffalo', typeName('buffalo')) +
      '<div class="btn-row">' +
      '<button class="btn danger" data-act="day-delete">' + ICON.trash + '<span>' + esc(t('clearDay')) + '</span></button>' +
      '<button class="btn primary" data-act="sheet-close">' + ICON.check + '<span>' + esc(t('done')) + '</span></button>' +
      '</div>';
    openSheet(html);
  }

  function syncDaySheet() {
    if (!sheetState || sheetState.type !== 'day') return;
    var day = sheetState.day;
    var inputs = document.querySelectorAll('.sheet-qty');
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      if (document.activeElement !== el) el.value = qty(C.getSlot(state, day, el.getAttribute('data-type'), el.getAttribute('data-slot')));
    }
    var sub = document.querySelector('.sheet-sub');
    if (sub) sub.textContent = t('editDay') + ' · ' + money(C.dayTotals(state, day).amount);
  }

  function openPriceSheet() {
    var mk = ui.month;
    sheetState = { type: 'prices', month: mk };
    var rates = C.ratesForMonth(state, mk);
    var html =
      '<div class="sheet-title">' + esc(t('prices')) + '</div>' +
      '<div class="sheet-sub">' + esc(monthName(mk, false)) + ' · ' + esc(t('priceHintMonth')) + '</div>' +
      '<div class="field">' +
      '<label for="qs-cow"><span class="dot cow" style="display:inline-block;margin-right:6px"></span>' + esc(typeName('cow')) + '</label>' +
      '<div class="input-wrap"><span class="prefix">₹</span>' +
      '<input class="input sheet-rate" id="qs-cow" data-type="cow" type="text" inputmode="decimal" value="' + num(rates.cow) + '"></div>' +
      '</div>' +
      '<div class="field">' +
      '<label for="qs-buffalo"><span class="dot buffalo" style="display:inline-block;margin-right:6px"></span>' + esc(typeName('buffalo')) + '</label>' +
      '<div class="input-wrap"><span class="prefix">₹</span>' +
      '<input class="input sheet-rate" id="qs-buffalo" data-type="buffalo" type="text" inputmode="decimal" value="' + num(rates.buffalo) + '"></div>' +
      '</div>' +
      '<div class="btn-row">' +
      '<button class="btn" data-act="sheet-close">' + esc(t('cancel')) + '</button>' +
      '<button class="btn primary" data-act="save-prices">' + ICON.check + '<span>' + esc(t('save')) + '</span></button>' +
      '</div>';
    openSheet(html);
  }

  function openExportSheet() {
    sheetState = { type: 'export' };
    var data = C.exportJSON(state);
    var html =
      '<div class="sheet-title">' + esc(t('exportBackup')) + '</div>' +
      '<div class="sheet-sub">' + esc(t('exportHint')) + '</div>' +
      '<textarea class="input code-box" id="export-box" readonly rows="7">' + esc(data) + '</textarea>' +
      '<div class="btn-row one">' +
      '<button class="btn primary" data-act="copy-export">' + ICON.copy + '<span>' + esc(t('copy')) + '</span></button>' +
      '</div>';
    openSheet(html);
    var box = byId('export-box');
    setTimeout(function () { if (box) box.scrollTop = 0; }, 30);
  }

  function openImportSheet() {
    sheetState = { type: 'import' };
    var html =
      '<div class="sheet-title">' + esc(t('restoreBackup')) + '</div>' +
      '<div class="sheet-sub">' + esc(t('restoreHint')) + '</div>' +
      '<textarea class="input code-box" id="import-box" rows="7" placeholder="{ ... }"></textarea>' +
      '<div class="btn-row">' +
      '<button class="btn" data-act="sheet-close">' + esc(t('cancel')) + '</button>' +
      '<button class="btn primary" data-act="import-do">' + esc(t('restoreBackup')) + '</button>' +
      '</div>';
    openSheet(html);
  }

  /* ============================ actions ============================ */
  function setTab(tab) {
    ui.tab = tab;
    if (tab === 'month' || tab === 'bill') {
      // keep month in sync with what the user is looking at
      if (!ui.month) ui.month = C.monthOf(ui.day);
    }
    window.scrollTo(0, 0);
    renderTopbar();
    renderTabs();
    renderView();
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'hi') return;
    var draftRates = {
      cow: readRateInput('rate-ob-cow', readRateInput('rate-cow', state.rates.cow)),
      buffalo: readRateInput('rate-ob-buffalo', readRateInput('rate-buffalo', state.rates.buffalo))
    };
    var draftName = byId('ob-name') || byId('name-cow');
    state.lang = lang;
    saveState();
    renderTopbar();
    renderTabs();
    renderView();
    if (!state.onboarded) {
      state.rates.cow = draftRates.cow;
      state.rates.buffalo = draftRates.buffalo;
      openOnboarding();
      if (draftName) {
        var nameEl = byId('ob-name');
        if (nameEl && draftName.value) nameEl.value = draftName.value;
      }
    }
  }

  function step(type, slot, dir, fromSheet) {
    var day = fromSheet && sheetState && sheetState.type === 'day' ? sheetState.day : ui.day;
    var cur = C.getSlot(state, day, type, slot);
    var next = Math.max(0, Math.min(C.MAX_QTY, C.round1(cur + dir * 0.5)));
    C.setSlot(state, day, type, slot, next);
    saveState();
    buzz(8);
    if (fromSheet) {
      var inputs = document.querySelectorAll('.sheet-qty');
      for (var i = 0; i < inputs.length; i++) {
        var el = inputs[i];
        if (el.getAttribute('data-type') === type && el.getAttribute('data-slot') === slot) el.value = qty(next);
      }
      syncDaySheet();
    } else {
      var input = byId('q-' + type + '-' + slot);
      if (input) input.value = qty(next);
      syncEntry();
    }
  }

  function shiftDay(n) {
    ui.day = C.addDays(ui.day, n);
    ui.month = C.monthOf(ui.day);
    renderTopbar();
    renderView();
  }

  function shiftMonth(n) {
    ui.month = C.addMonths(ui.month, n);
    if (C.monthOf(ui.day) !== ui.month) {
      var last = C.daysInMonth(ui.month);
      var dayNum = Math.min(C.parseKey(ui.day).getDate(), last);
      ui.day = ui.month + '-' + (dayNum < 10 ? '0' + dayNum : String(dayNum));
    }
    renderTopbar();
    renderView();
  }

  function copyPrevious() {
    var prev = C.findPreviousEntryDay(state, ui.day, 14);
    if (!prev) { toast(t('noChange')); return; }
    C.copyDay(state, prev, ui.day);
    saveState();
    buzz(12);
    renderView();
    toast(t('copiedDay'));
  }

  function copyText(text) {
    var ok = false;
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      ok = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) { ok = false; }
    if (!ok) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch (e2) { ok = false; }
    }
    toast(ok ? t('copiedToast') : t('copyFailed'));
    return ok;
  }

  function shareBill() {
    var text = billText();
    try {
      var b = bridge();
      if (b && typeof b.shareText === 'function') { b.shareText(text); return; }
      if (navigator.share) {
        navigator.share({ title: t('shareTitle'), text: text }).catch(function () {});
        return;
      }
    } catch (e) { /* fall through */ }
    copyText(text);
  }

  function printBill() {
    try {
      var b = bridge();
      if (b && typeof b.printPage === 'function') { b.printPage(); return; }
    } catch (e) { /* ignore */ }
    window.print();
  }

  function saveRates() {
    C.TYPE_IDS.forEach(function (id) {
      state.rates[id] = readRateInput('rate-' + id, state.rates[id]);
    });
    // the new price starts with the current month; older bills keep their price
    C.lockMonthRates(state, C.monthKey(new Date()));
    saveState();
    renderTopbar();
    renderView();
    toast(t('savedToast'));
  }

  /* ============================ events ============================ */
  function handleAct(act, el) {
    var ds = el.dataset || {};
    switch (act) {
      case 'tab': setTab(ds.tab); break;
      case 'lang':
        setLang(state.lang === 'hi' ? 'en' : 'hi');
        break;
      case 'set-lang': setLang(ds.lang); break;
      case 'month-prev': shiftMonth(-1); break;
      case 'month-next': shiftMonth(1); break;
      case 'month-now':
        ui.month = C.monthKey(new Date());
        ui.day = TODAY;
        renderTopbar(); renderView();
        break;
      case 'day-prev': shiftDay(-1); break;
      case 'day-next': shiftDay(1); break;
      case 'day-today':
        ui.day = TODAY; ui.month = C.monthOf(TODAY);
        renderTopbar(); renderView();
        break;
      case 'step': step(ds.type, ds.slot, Number(ds.dir), false); break;
      case 'sheet-step': step(ds.type, ds.slot, Number(ds.dir), true); break;
      case 'copy-prev': copyPrevious(); break;
      case 'clear-day':
        confirmSheet(t('clearDay'), t('clearConfirm'), t('clear'), function () {
          C.clearDay(state, ui.day);
          saveState();
          renderView();
        }, true);
        break;
      case 'go-rates': setTab('settings'); break;
      case 'open-prices': openPriceSheet(); break;
      case 'save-prices': {
        var mk = (sheetState && sheetState.month) || ui.month;
        C.TYPE_IDS.forEach(function (id) {
          var el = byId('qs-' + id);
          var v = el ? parseNum(el.value) : C.rateFor(state, mk, id);
          if (!isFinite(v) || v < 0 || v > 100000) v = C.rateFor(state, mk, id);
          state.monthRates[mk] = state.monthRates[mk] || {};
          state.monthRates[mk][id] = C.round2(v);
          if (mk === C.monthKey(new Date())) state.rates[id] = C.round2(v);
        });
        saveState();
        closeSheet();
        renderTopbar(); renderTabs(); renderView();
        toast(t('savedToast'));
        break;
      }
      case 'open-day': openDaySheet(ds.day); break;
      case 'day-delete':
        confirmSheet(t('clearDay'), t('clearConfirm'), t('delete'), function () {
          if (sheetState && sheetState.day) C.clearDay(state, sheetState.day);
          saveState();
          renderMonth();
          renderTopbar();
          closeSheet();
          toast(t('savedToast'));
        }, true);
        break;
      case 'sheet-close': closeSheet(); break;
      case 'noop': break;
      case 'confirm-ok': {
        var fn = sheetState && sheetState.onOk;
        if (fn) { closeSheet(); fn(); }
        break;
      }
      case 'share-bill': shareBill(); break;
      case 'copy-bill': copyText(billText()); break;
      case 'print-bill': printBill(); break;
      case 'save-rates': saveRates(); break;
      case 'save-names': {
        var cw = byId('name-cow'), bf = byId('name-buffalo');
        state.names = {};
        if (cw && cw.value.trim()) state.names.cow = cw.value.trim().slice(0, 24);
        if (bf && bf.value.trim()) state.names.buffalo = bf.value.trim().slice(0, 24);
        saveState();
        renderTopbar(); renderTabs(); renderView();
        toast(t('savedToast'));
        break;
      }
      case 'save-bill': {
        var shop = byId('bill-shop'), cust = byId('bill-customer');
        state.shop = shop ? shop.value.trim().slice(0, 40) : state.shop;
        state.name = cust ? cust.value.trim().slice(0, 40) : state.name;
        saveState();
        toast(t('savedToast'));
        break;
      }
      case 'backup-export': openExportSheet(); break;
      case 'copy-export': {
        var box = byId('export-box');
        if (box) { box.focus(); box.select(); copyText(box.value); }
        break;
      }
      case 'backup-import': openImportSheet(); break;
      case 'import-do': {
        var ibox = byId('import-box');
        try {
          var next = C.importJSON(ibox.value);
          next.lang = state.lang;
          state = next;
          saveState();
          closeSheet();
          renderTopbar(); renderTabs(); renderView();
          toast(t('restoreDone'));
        } catch (e) {
          toast(t('invalidBackup'));
        }
        break;
      }
      case 'reset-all':
        confirmSheet(t('reset'), t('resetConfirm'), t('delete'), function () {
          var lang = state.lang;
          state = C.emptyState();
          state.lang = lang;
          state.onboarded = true;
          saveState();
          ui.month = C.monthKey(new Date());
          ui.day = TODAY;
          renderTopbar(); renderTabs(); renderView();
          toast(t('savedToast'));
        }, true);
        break;
      case 'onboard-done': {
        state.rates.cow = readRateInput('rate-ob-cow', state.rates.cow);
        state.rates.buffalo = readRateInput('rate-ob-buffalo', state.rates.buffalo);
        var nameEl = byId('ob-name');
        if (nameEl) state.name = nameEl.value.trim().slice(0, 40);
        state.onboarded = true;
        saveState();
        closeSheet();
        setTab('entry');
        toast(t('welcomeTitle'));
        break;
      }
      default: break;
    }
  }

  document.addEventListener('click', function (e) {
    var el = e.target;
    while (el && el !== document && !(el.getAttribute && el.getAttribute('data-act'))) el = el.parentNode;
    if (!el || el === document || !el.getAttribute) return;
    var act = el.getAttribute('data-act');
    if (!act || act === 'noop') return;
    e.preventDefault();
    handleAct(act, el);
  });

  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el || !el.classList) return;

    if (el.classList.contains('qty-input')) {
      var type = el.getAttribute('data-type');
      var slot = el.getAttribute('data-slot');
      if (el.classList.contains('sheet-qty')) {
        if (sheetState && sheetState.type === 'day') {
          C.setSlot(state, sheetState.day, type, slot, parseNum(el.value));
          saveState();
          el.value = qty(C.getSlot(state, sheetState.day, type, slot));
          syncDaySheet();
        }
      } else {
        C.setSlot(state, ui.day, type, slot, parseNum(el.value));
        saveState();
        el.value = qty(C.getSlot(state, ui.day, type, slot));
        syncEntry();
      }
      return;
    }

    if (el.classList.contains('date-overlay')) {
      if (C.isValidDayKey(el.value)) {
        ui.day = el.value;
        ui.month = C.monthOf(el.value);
        renderTopbar();
        renderView();
      }
      return;
    }

    if (el.id === 'bill-name') {
      state.name = el.value.trim().slice(0, 40);
      saveState();
      var printed = document.querySelector('.print-only b');
      if (printed) printed.textContent = state.name || '—';
      return;
    }
  });

  document.addEventListener('blur', function (e) {
    var el = e.target;
    if (el && el.classList && el.classList.contains('qty-input')) {
      // browsers fire change on blur; this covers WebViews that do not
      if (el.value !== qty(C.getSlot(state, ui.day, el.getAttribute('data-type'), el.getAttribute('data-slot')))) {
        el.dispatchEvent(new Event('change'));
      }
    }
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.classList && e.target.classList.contains('qty-input')) {
      e.target.blur();
    }
  });

  /* back button (Android shell calls this) */
  window.__appBack = function () {
    var sheetOpen = byId('sheet-root').classList.contains('open');
    if (sheetOpen && state.onboarded) { closeSheet(); return 'true'; }
    if (ui.tab !== 'entry') { setTab('entry'); return 'true'; }
    return 'false';
  };

  /* ============================ boot ============================ */
  loadState();
  ui.month = C.monthKey(new Date());
  ui.day = state.onboarded ? TODAY : TODAY;
  if (!state.onboarded) ui.month = C.monthKey(new Date());
  renderAll();

  // expose a tiny API for tests / debugging
  window.__doodh = {
    state: function () { return state; },
    ui: function () { return ui; },
    setState: function (s) { state = C.normalizeState(s); renderAll(); }
  };
})();
