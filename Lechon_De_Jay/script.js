/* =====================================================================
   Lechon De Jay | script.js  (HTML + CSS + JavaScript only, no backend)
   Data is saved in the browser (localStorage), so this is a working
   demo of the ordering and management system for the class project.

   Sections
    1  Config
    2  Helpers (DOM, dates, money, validation, toast, modal)
    3  Storage and seed data
    4  Accounts (register, login, roles)
    5  Layout (header, footer)
    6  Menu and cart
    7  Orders, reservations, events (records) and payment
    8  Customer pages (home, menu, gallery, contact, auth, profile)
    9  Customer pages (cart, reserve, event, my orders, reviews)
   10  Admin pages
   11  Analytics (reports, forecasting, preference analysis) and charts
   12  Start
   ===================================================================== */
'use strict';

/* ===== 1. CONFIG ===== */
const KEYS = {
  users: 'ldj_users', menu: 'ldj_menu', cart: 'ldj_cart', orders: 'ldj_orders',
  reviews: 'ldj_reviews', settings: 'ldj_settings', inquiries: 'ldj_inquiries',
  notices: 'ldj_notices', session: 'ldj_session', menuVersion: 'ldj_menu_version'
};
const CATEGORIES = ['Whole Lechon', 'Meals', 'Snacks & Sides', 'Desserts & Drinks'];
const ADDON_CAT = 'Add-ons';
const ORDER_FLOW = ['Received', 'Confirmed', 'Preparing', 'Ready for pickup', 'Completed'];
const EVENT_FLOW = ['Pending', 'Confirmed', 'Completed'];
const CLOSED = ['Cancelled', 'Declined'];
const KIND_LABEL = { order: 'Order', reservation: 'Lechon reservation', event: 'Event booking' };

// Put image file names from the assets folder here, for example 'assets/banner.jpg'
const IMAGES = { hero: '', whole: '', meals: '', snacks: '' };
const GALLERY = [
  { src: '', alt: 'Whole roasted lechon with golden crispy skin', caption: 'Our whole lechon' },
  { src: '', alt: 'Plated lechon meal with rice', caption: 'Lechon meal' },
  { src: '', alt: 'Curly fries platter with cheese sauce', caption: 'Curly fries platter' },
  { src: '', alt: 'Front of the Lechon De Jay store', caption: 'Our store in Bacoor' },
  { src: '', alt: 'Staff serving customers at the counter', caption: 'Ready to serve you' },
  { src: '', alt: 'A celebration table with lechon', caption: 'Feasts and celebrations' }
];

const DEFAULT_SETTINGS = {
  phone: '', leadDays: 2, dailyLimit: 5, depositPct: 50, openHour: 10, closeHour: 22,
  // Peak dates (month-day). The owner can edit these in Admin > Settings.
  seasonal: [
    { name: 'Christmas', from: '12-23', to: '12-25', boost: 1.6 },
    { name: 'New Year', from: '12-30', to: '01-01', boost: 1.5 },
    { name: 'Town fiesta (sample dates)', from: '05-10', to: '05-16', boost: 1.3 }
  ]
};

// Menu and prices from the store's menu and price list (whole lechon sizes are Baboy).
// The owner can change anything later in Admin > Menu. Raise MENU_VERSION to reload this list.
const MENU_VERSION = 2;
const SEED_MENU = [
  { id: 'wl-deleche', cat: 'Whole Lechon', name: 'Lechon Baboy: De Leche', desc: '5 to 6 kg, serves 15 to 20', price: 11000, available: true },
  { id: 'wl-regular', cat: 'Whole Lechon', name: 'Lechon Baboy: Regular', desc: '7 to 8 kg, serves 25 to 30', price: 12000, available: true },
  { id: 'wl-medium1', cat: 'Whole Lechon', name: 'Lechon Baboy: Medium 1', desc: '9 to 10 kg, serves 30 to 35', price: 12500, available: true },
  { id: 'wl-medium2', cat: 'Whole Lechon', name: 'Lechon Baboy: Medium 2', desc: '11 to 12 kg, serves 35 to 40', price: 13000, available: true },
  { id: 'wl-large', cat: 'Whole Lechon', name: 'Lechon Baboy: Large', desc: '13 to 15 kg, serves 45 to 50', price: 14000, available: true },
  { id: 'wl-xl', cat: 'Whole Lechon', name: 'Lechon Baboy: X-Large', desc: '16 to 18 kg, serves 55 to 60', price: 15000, available: true },
  { id: 'wl-xxl', cat: 'Whole Lechon', name: 'Lechon Baboy: XX-Large', desc: '19 to 20 kg, serves 60 to 65', price: 16000, available: true },
  { id: 'wl-jumbo', cat: 'Whole Lechon', name: 'Lechon Baboy: Jumbo', desc: '21 to 23 kg, serves 65 to 70', price: 17000, available: true },
  { id: 'wl-superjumbo', cat: 'Whole Lechon', name: 'Lechon Baboy: Super Jumbo', desc: '24 to 25 kg, serves 75 to 80', price: 18000, available: true },
  { id: 'wl-oversized', cat: 'Whole Lechon', name: 'Lechon Baboy: Oversized', desc: '26 to 28 kg, serves 85 to 90', price: 19000, available: true },
  { id: 'wl-gigantic', cat: 'Whole Lechon', name: 'Lechon Baboy: Gigantic', desc: '29 to 31 kg, serves 100 to 110', price: 21000, available: true },
  { id: 'wl-titan', cat: 'Whole Lechon', name: 'Lechon Baboy: Titan', desc: '32 to 35 kg, serves 110 to 130', price: 23000, available: true },
  { id: 'wl-baka', cat: 'Whole Lechon', name: 'Lechon Baka', desc: 'Whole beef lechon', price: 0, available: false, soon: true },
  { id: 'm-budget', cat: 'Meals', name: '₱99 Budget Meal', desc: 'Lechon de Jay budget meal with rice', price: 99, available: true },
  { id: 'm-paksiw', cat: 'Meals', name: 'Lechon Paksiw', desc: 'Tender lechon slow-cooked in a savory paksiw sauce', price: 149, available: true },
  { id: 'm-unli', cat: 'Meals', name: 'Lechon Meal with Unli Rice', desc: 'Lechon meal, eat all the rice you want', price: 129, available: true },
  { id: 'm-crew150', cat: 'Meals', name: 'Crew Meal: Rice + Lechon', desc: 'Fuel your team, keep them happy', price: 150, available: true },
  { id: 'm-crew180', cat: 'Meals', name: 'Crew Meal: Rice + Lechon + Vegetable', desc: 'Fuel your team, keep them happy', price: 180, available: true },
  { id: 'm-crew200', cat: 'Meals', name: 'Crew Meal: Rice + Lechon + Vegetable + Dessert', desc: 'Fuel your team, keep them happy', price: 200, available: true },
  { id: 's-curly', cat: 'Snacks & Sides', name: 'Curly Fries Platter', desc: 'Classic fries, curly fries and crinkle-cut potato chips with a creamy dip', price: 249, available: true },
  { id: 's-nachos', cat: 'Snacks & Sides', name: 'Crazy Loaded Nachos', desc: 'Cheesy, loaded and crazy good', price: 179, available: true },
  { id: 'd-salad', cat: 'Desserts & Drinks', name: 'Fruit Salad', desc: 'Creamy, fruity and perfectly refreshing', price: 79, available: true },
  { id: 'd-refresh', cat: 'Desserts & Drinks', name: 'Refreshments', desc: 'Tokyo Red iced tea or fresh cucumber juice', price: 79, available: true },
  { id: 'a-bites', cat: ADDON_CAT, name: 'Lechon Bites', desc: 'Creamy, melty and extra delicious. Add to your meal', price: 30, available: true },
  { id: 'a-cheese', cat: ADDON_CAT, name: 'Cheese Sauce', desc: 'Add to your Curly Fries Platter', price: 50, available: true },
  { id: 'a-refresh', cat: ADDON_CAT, name: 'Refreshments', desc: 'Add to your lechon meal', price: 79, available: true }
];

// Optional photos for menu items: item id and file in assets, for example 'm-budget': 'assets/budget-meal.jpg'
const MENU_IMAGES = {};

/* ===== 2. HELPERS ===== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Build a DOM element. Text is added with textContent, so user input can never run as HTML. */
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  let value;
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'value') value = v;
    else if (k === 'checked') el.checked = !!v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  kids.flat(Infinity).forEach(c => {
    if (c === null || c === undefined || c === false) return;
    el.append(c instanceof Node ? c : String(c));
  });
  if (value !== undefined) el.value = value;
  return el;
}

const peso = n => '₱' + Number(n || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 });
const pad = n => String(n).padStart(2, '0');
const toDateStr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const todayStr = () => toDateStr(new Date());
const addDays = (s, n) => { const d = parseDate(s); d.setDate(d.getDate() + n); return toDateStr(d); };
const fmtDate = s => parseDate(s).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const fmtTime = t => { const [hh, mm] = t.split(':').map(Number); return `${((hh + 11) % 12) + 1}:${pad(mm)} ${hh >= 12 ? 'PM' : 'AM'}`; };
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const mean = a => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
const sd = a => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };

/** Pickup time slots every 30 minutes, from opening until 30 minutes before closing. */
function timeSlots(settings) {
  const slots = [];
  for (let hr = settings.openHour; hr < settings.closeHour; hr++) { slots.push(`${pad(hr)}:00`, `${pad(hr)}:30`); }
  return slots;
}

function toast(message, type) {
  const host = $('#toastHost');
  if (!host) return;
  const t = h('div', { class: 'toast' + (type === 'error' ? ' error' : ''), role: 'status' }, message);
  host.append(t);
  setTimeout(() => t.remove(), 3500);
}

/** Show an error under a form field. */
function fieldError(input, message) {
  input.classList.add('invalid');
  input.setAttribute('aria-invalid', 'true');
  const holder = input.closest('label') || input.parentElement;
  let err = holder.querySelector('.field-error');
  if (!err) { err = h('span', { class: 'field-error', role: 'alert' }); holder.append(err); }
  err.textContent = message;
}
function clearErrors(form) {
  $$('.invalid', form).forEach(i => { i.classList.remove('invalid'); i.removeAttribute('aria-invalid'); });
  $$('.field-error', form).forEach(e => e.remove());
}

/** Open a modal dialog. Returns { close }. Escape and the overlay background close it. */
function openModal(title, content, onClose) {
  const previous = document.activeElement;
  const modal = h('div', { class: 'modal' }, h('h2', { id: 'modalTitle' }, title), content);
  const overlay = h('div', { class: 'modal-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modalTitle' }, modal);
  const close = result => {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
    if (previous && previous.focus) previous.focus();
    if (onClose) onClose(result);
  };
  const onKey = e => { if (e.key === 'Escape') close(null); };
  overlay.addEventListener('click', e => { if (e.target === overlay) close(null); });
  document.addEventListener('keydown', onKey);
  document.body.append(overlay);
  const first = $('button, a, input', modal);
  if (first) first.focus();
  return { close, modal };
}

function download(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' }));
  const a = h('a', { href: url, download: filename });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
/** CSV cell, with quotes escaped and spreadsheet formulas neutralized. */
function csvCell(v) {
  let s = String(v ?? '');
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

function stars(n) {
  return h('span', { class: 'stars', role: 'img', 'aria-label': `${n} out of 5 stars` }, '★'.repeat(n) + '☆'.repeat(5 - n));
}
const statusBadge = s => h('span', { class: 'status status-' + slug(s) }, s);

/** Table with a header row. Rows are arrays of strings or elements. */
function dataTable(headers, rows, caption) {
  if (!rows.length) return h('p', { class: 'empty' }, 'Nothing to show yet.');
  return h('div', { class: 'table-wrap' }, h('table', { class: 'data' },
    caption ? h('caption', { class: 'sr-only' }, caption) : null,
    h('thead', {}, h('tr', {}, headers.map(x => h('th', { scope: 'col' }, x)))),
    h('tbody', {}, rows.map(r => h('tr', {}, r.map(c => h('td', {}, c)))))));
}
const statCard = (num, label) => h('div', { class: 'stat' }, h('div', { class: 'num' }, num), h('div', { class: 'lbl' }, label));

/* ===== 3. STORAGE AND SEED DATA ===== */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { toast('Could not save. Browser storage is full or blocked.', 'error'); } }
};
const getSettings = () => ({ ...DEFAULT_SETTINGS, ...store.get(KEYS.settings, {}) });
const saveSettings = s => store.set(KEYS.settings, s);
const getMenu = () => store.get(KEYS.menu, SEED_MENU);
const saveMenu = m => store.set(KEYS.menu, m);
const itemById = id => getMenu().find(i => i.id === id);
const getUsers = () => store.get(KEYS.users, []);
const saveUsers = u => store.set(KEYS.users, u);
const getRecords = () => store.get(KEYS.orders, []);
const saveRecords = r => store.set(KEYS.orders, r);
const getReviews = () => store.get(KEYS.reviews, []);
const saveReviews = r => store.set(KEYS.reviews, r);
const uid = prefix => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** Hash a password with SHA-256 (demo only; a real site hashes on the server). */
async function sha256(text) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return 'plain:' + btoa(String.fromCharCode(...new TextEncoder().encode(text)));
}

/** Create the menu, settings and demo accounts the first time the site opens. */
async function seedData() {
  if (!store.get(KEYS.menu) || store.get(KEYS.menuVersion) !== MENU_VERSION) { saveMenu(SEED_MENU); store.set(KEYS.menuVersion, MENU_VERSION); }
  if (!store.get(KEYS.settings)) saveSettings(DEFAULT_SETTINGS);
  if (!store.get(KEYS.users)) {
    saveUsers([
      { id: 'u-admin', name: 'Owner (Admin)', mobile: '', email: 'admin@lechondejay.test', passHash: await sha256('admin123'), role: 'admin' },
      { id: 'u-staff', name: 'Store Staff', mobile: '', email: 'staff@lechondejay.test', passHash: await sha256('staff123'), role: 'staff' },
      { id: 'u-demo', name: 'Demo Customer', mobile: '09171234567', email: 'customer@lechondejay.test', passHash: await sha256('customer123'), role: 'customer' }
    ]);
  }
}

/* ===== 4. ACCOUNTS ===== */
function currentUser() {
  try {
    const id = sessionStorage.getItem(KEYS.session);
    return id ? getUsers().find(u => u.id === id) || null : null;
  } catch (e) { return null; }
}
function setSession(user) { try { sessionStorage.setItem(KEYS.session, user.id); } catch (e) { /* ignore */ } }
function logout() { try { sessionStorage.removeItem(KEYS.session); } catch (e) { /* ignore */ } }
const isStaff = u => !!u && (u.role === 'admin' || u.role === 'staff');
const displayName = u => { const p = String(u.name).trim().split(/\s+/); return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : p[0]; };

/** Send guests to the login page. Returns the user, or null after redirecting. */
function requireLogin() {
  const user = currentUser();
  if (user) return user;
  const page = location.pathname.split('/').pop() || 'index.html';
  location.href = 'login.html?next=' + encodeURIComponent(page);
  return null;
}
function safeNext() {
  const next = new URLSearchParams(location.search).get('next') || '';
  return /^[a-z]+\.html$/.test(next) ? next : '';
}

/* ===== 5. LAYOUT ===== */
const NAV = [
  ['index.html', 'Home', 'home'], ['about.html', 'About Us', 'about'], ['menu.html', 'Menu', 'menu'],
  ['reserve.html', 'Reserve', 'reserve'], ['event.html', 'Events', 'event'],
  ['gallery.html', 'Gallery', 'gallery'], ['contact.html', 'Contact', 'contact']
];
const cartCount = () => getCart().reduce((n, l) => n + l.qty, 0);

function buildHeader() {
  const header = $('#siteHeader');
  if (!header) return;
  const page = document.body.dataset.page;
  const user = currentUser();
  const nav = h('nav', { class: 'site-nav', 'aria-label': 'Main' },
    NAV.map(([href, label, key]) => h('a', { href, class: key === page ? 'active' : null, 'aria-current': key === page ? 'page' : null }, label)));
  const actions = h('div', { class: 'nav-actions' },
    h('a', { href: 'cart.html', class: page === 'cart' ? 'active' : null }, 'Cart', h('span', { class: 'count-badge', id: 'cartCount' }, String(cartCount()))),
    user ? h('a', { href: 'orders.html' }, 'My Orders') : null,
    isStaff(user) ? h('a', { href: 'admin.html' }, 'Admin') : null,
    user ? h('a', { href: 'profile.html' }, 'Hi, ' + user.name.split(' ')[0]) : h('a', { href: 'login.html' }, 'Log In'),
    user ? h('button', { type: 'button', class: 'linklike', onClick: () => { logout(); location.href = 'index.html'; } }, 'Log Out')
      : h('a', { href: 'register.html' }, 'Register'));
  const menu = h('div', { class: 'header-menu', id: 'headerMenu' }, nav, actions);
  const toggle = h('button', { type: 'button', class: 'nav-toggle', 'aria-expanded': 'false', 'aria-controls': 'headerMenu' }, 'Menu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  header.replaceChildren(h('div', { class: 'header-inner' }, h('a', { class: 'logo', href: 'index.html' }, 'Lechon De Jay'), toggle, menu));
}
function updateCartBadge() { const b = $('#cartCount'); if (b) b.textContent = String(cartCount()); }

function buildFooter() {
  const footer = $('#siteFooter');
  if (!footer) return;
  const phone = getSettings().phone;
  footer.replaceChildren(
    'Casimiro Westville, Ligas 2, Bacoor City, Cavite • 10 AM to 10 PM • ' + (phone ? 'Phone: ' + phone : 'Phone: to be added') + ' • ',
    h('a', { href: 'https://www.facebook.com/share/1K9S4BzeRE/?mibextid=wwXIfr', target: '_blank', rel: 'noopener' }, 'Facebook page'));
}

/* ===== 6. MENU AND CART ===== */
const getCart = () => store.get(KEYS.cart, []);
const saveCart = c => store.set(KEYS.cart, c);

/** Add an item to the cart. Whole lechon is reserved on its own page instead. */
function addToCart(id, qty = 1, silent = false) {
  const item = itemById(id);
  if (!item || !item.available || item.soon) return false;
  if (item.cat === 'Whole Lechon') { if (!silent) toast('Whole lechon is reserved on the Reserve page.', 'error'); return false; }
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if (line) line.qty = Math.min(line.qty + qty, 50); else cart.push({ id, qty });
  saveCart(cart);
  updateCartBadge();
  if (!silent) toast(`${item.name} added to cart`);
  return true;
}
/** Cart lines joined with the current menu. Items that were removed or sold out are dropped. */
function cartLines() {
  return getCart().map(l => { const item = itemById(l.id); return item && item.available ? { item, qty: l.qty, subtotal: item.price * l.qty } : null; }).filter(Boolean);
}
const lineToRecordItem = (item, qty) => ({ id: item.id, name: item.name, cat: item.cat, qty, price: item.price });

/* ===== 7. RECORDS (orders, reservations, events) AND PAYMENT ===== */
function statusOptions(kind) { return kind === 'event' ? [...EVENT_FLOW, 'Declined', 'Cancelled'] : [...ORDER_FLOW, 'Cancelled']; }
const activeRecords = list => list.filter(r => !CLOSED.includes(r.status));
const lechonQty = r => r.items.filter(i => i.cat === 'Whole Lechon').reduce((n, i) => n + i.qty, 0);

function nextRecordId() {
  const max = getRecords().reduce((m, r) => Math.max(m, parseInt(String(r.id).replace(/\D/g, ''), 10) || 0), 1000);
  return 'LDJ-' + (max + 1);
}
function addRecord(rec) {
  const list = getRecords();
  rec.id = nextRecordId();
  rec.created = new Date().toISOString();
  rec.history = [{ status: rec.status, at: rec.created }];
  list.push(rec);
  saveRecords(list);
  return rec;
}
function updateRecord(id, fn) {
  const list = getRecords();
  const rec = list.find(r => r.id === id);
  if (!rec) return null;
  fn(rec);
  saveRecords(list);
  return rec;
}
/** Change a status and leave a message for the customer (shown on My Orders). */
function changeStatus(id, status, reason) {
  const rec = updateRecord(id, r => {
    r.status = status;
    r.history = (r.history || []).concat({ status, at: new Date().toISOString() });
    if (reason) r.reason = reason;
    if (status === 'Completed') { r.payStatus = 'Paid'; r.amountPaid = r.total; }
  });
  if (rec) notify(rec.userId, `${KIND_LABEL[rec.kind]} ${rec.id} is now: ${status}.` + (reason ? ` Note: ${reason}` : ''));
  return rec;
}
function notify(userId, text) {
  const list = store.get(KEYS.notices, []);
  list.push({ userId, text, at: new Date().toISOString() });
  store.set(KEYS.notices, list.slice(-200));
}
/** Whole lechon already booked for a date (reservations and events that are not cancelled). */
function lechonBooked(date) {
  return activeRecords(getRecords()).filter(r => r.date === date && r.kind !== 'order').reduce((n, r) => n + lechonQty(r), 0);
}

/** Simulated e-wallet payment. Resolves true (paid), false (failed) or null (cancelled). */
function simulatePayment({ amount, method, label }) {
  return new Promise(resolve => {
    const done = value => { modal.close(value); };
    const body = h('div', {},
      h('p', {}, label),
      h('p', { class: 'amount' }, peso(amount)),
      h('p', { class: 'privacy' }, 'This is a simulated payment for the school project. No real money, e-wallet or card is used.'),
      h('div', { class: 'modal-actions' },
        h('button', { type: 'button', class: 'btn btn-primary', onClick: () => done(true) }, 'Pay now (simulated)'),
        h('button', { type: 'button', class: 'btn btn-outline', onClick: () => done(false) }, 'Simulate failed payment'),
        h('button', { type: 'button', class: 'btn btn-outline', onClick: () => done(null) }, 'Cancel')));
    const modal = openModal(`Pay with ${method}`, body, result => resolve(result));
  });
}

/** Printable receipt. */
function showReceipt(rec, afterClose) {
  const paid = rec.amountPaid || 0;
  const content = h('div', { class: 'receipt' },
    h('p', { class: 'center' }, h('strong', {}, 'Lechon De Jay'), h('br'), 'Casimiro Westville, Ligas 2, Bacoor City, Cavite'),
    h('p', {}, `Receipt: ${rec.id}`, h('br'), `${KIND_LABEL[rec.kind]} · ${new Date(rec.created).toLocaleString('en-PH')}`, h('br'), `Customer: ${rec.userName}`),
    h('p', {}, `Pickup: ${fmtDate(rec.date)} at ${fmtTime(rec.time)}` + (rec.orderType ? ` (${rec.orderType})` : '')),
    rec.eventType ? h('p', {}, `Event: ${rec.eventType}, ${rec.guests} guests`) : null,
    h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Item'), h('th', {}, 'Qty'), h('th', {}, 'Price'))),
      h('tbody', {}, rec.items.map(i => h('tr', {}, h('td', {}, i.name), h('td', {}, String(i.qty)), h('td', {}, peso(i.price * i.qty)))))),
    h('p', {}, h('strong', {}, `Total: ${peso(rec.total)}`)),
    h('p', {}, `Paid online: ${peso(paid)}`, h('br'), `Balance to pay at pickup: ${peso(Math.max(0, rec.total - paid))}`, h('br'), `Payment: ${rec.payMethod} (${rec.payStatus})`),
    h('p', {}, 'Status: ' + rec.status),
    h('p', { class: 'center' }, 'Thank you! This is a school project demo receipt.'));
  const actions = h('div', { class: 'modal-actions no-print' },
    h('button', { type: 'button', class: 'btn btn-primary', onClick: () => window.print() }, 'Print'),
    h('button', { type: 'button', class: 'btn btn-outline', onClick: () => m.close(null) }, 'Close'));
  const m = openModal('Receipt', h('div', {}, content, actions), afterClose);
}

/* ===== 8. CUSTOMER PAGES: HOME, MENU, GALLERY, CONTACT, ACCOUNTS ===== */
function applyImages() {
  $$('[data-img]').forEach(el => {
    const src = IMAGES[el.dataset.img];
    if (src) { el.style.backgroundImage = `url("${src}")`; el.classList.add('has-img'); }
  });
}

function ratingStats(reviews) {
  const approved = (reviews || getReviews()).filter(r => r.status === 'Approved');
  return { count: approved.length, avg: approved.length ? mean(approved.map(r => r.rating)) : 0, approved };
}

function initHome() {
  applyImages();
  const { count, avg, approved } = ratingStats();
  $('#ratingSummary').textContent = count ? `Average rating ${avg.toFixed(1)} out of 5 from ${count} review${count > 1 ? 's' : ''}.` : 'No reviews yet. Order with us and be the first to leave one.';
  $('#homeReviews').replaceChildren(...approved.slice(-3).reverse().map(r =>
    h('article', { class: 'review-card' }, stars(r.rating), h('p', {}, r.comment || '(no comment)'), h('p', { class: 'who' }, r.userName))));
}

let menuCategory = CATEGORIES[0];
function initMenu() {
  const wanted = new URLSearchParams(location.search).get('cat');
  if (CATEGORIES.includes(wanted)) menuCategory = wanted;
  const { count, avg } = ratingStats();
  $('#menuRating').textContent = count ? `Customer rating: ${avg.toFixed(1)} out of 5 (${count} reviews)` : '';
  renderMenuTabs();
  renderMenuGrid();
  renderAddons();
}
function renderMenuTabs() {
  $('#menuTabs').replaceChildren(...CATEGORIES.map(cat =>
    h('button', { type: 'button', class: 'tab', 'aria-pressed': String(cat === menuCategory), onClick: () => { menuCategory = cat; renderMenuTabs(); renderMenuGrid(); } }, cat)));
}
function renderMenuGrid() {
  const items = getMenu().filter(i => i.cat === menuCategory);
  $('#menuGrid').replaceChildren(...items.map(item => {
    let action;
    if (item.soon) action = h('button', { type: 'button', class: 'btn btn-outline btn-sm', disabled: true }, 'Coming soon');
    else if (!item.available) action = h('button', { type: 'button', class: 'btn btn-outline btn-sm', disabled: true }, 'Sold out');
    else if (item.cat === 'Whole Lechon') action = h('a', { class: 'btn btn-primary btn-sm', href: 'reserve.html?size=' + encodeURIComponent(item.id) }, 'Reserve');
    else action = h('button', { type: 'button', class: 'btn btn-primary btn-sm', onClick: () => addToCart(item.id) }, 'Add to cart');
    const card = h('article', { class: 'menu-card photo' },
      item.soon ? h('span', { class: 'badge' }, 'Coming soon') : null,
      h('div', { class: 'info' }, h('div', { class: 'name' }, item.name), h('div', { class: 'desc' }, item.desc),
        h('div', { class: 'price' }, item.soon ? 'Coming soon' : peso(item.price)), action));
    const photo = item.img || MENU_IMAGES[item.id];
    if (photo) { card.style.backgroundImage = `url("${photo}")`; card.classList.add('has-img'); }
    return card;
  }));
}
function renderAddons() {
  $('#addonList').replaceChildren(...getMenu().filter(i => i.cat === ADDON_CAT).map(item =>
    h('li', {}, h('span', {}, `${item.name} · ${peso(item.price)}`),
      item.available ? h('button', { type: 'button', class: 'btn btn-primary btn-sm', onClick: () => addToCart(item.id) }, 'Add') : h('span', {}, 'Sold out'))));
}

function initGallery() {
  $('#galleryGrid').replaceChildren(...GALLERY.map(g => {
    const photo = g.src
      ? h('button', { type: 'button', class: 'photo has-img', 'aria-label': 'Enlarge: ' + g.caption, onClick: () => {
        const lightbox = openModal(g.caption, h('div', {}, h('img', { src: g.src, alt: g.alt }),
          h('div', { class: 'modal-actions' }, h('button', { type: 'button', class: 'btn btn-outline', onClick: () => lightbox.close(null) }, 'Close'))));
      } }, h('img', { src: g.src, alt: g.alt, loading: 'lazy', style: 'width:100%;height:100%;object-fit:cover;display:block' }))
      : h('div', { class: 'photo', role: 'img', 'aria-label': 'Photo placeholder: ' + g.alt });
    return h('figure', {}, photo, h('figcaption', {}, g.caption));
  }));
}

function initContact() {
  const phone = getSettings().phone;
  if (phone) $('#phoneText').textContent = phone;
  const form = $('#contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors(form);
    const f = form.elements;
    let ok = true;
    if (f.name.value.trim().length < 2) { fieldError(f.name, 'Enter your name.'); ok = false; }
    if (f.contact.value.trim().length < 7) { fieldError(f.contact, 'Enter a phone number or email.'); ok = false; }
    if (f.message.value.trim().length < 10) { fieldError(f.message, 'Write at least 10 characters.'); ok = false; }
    const status = $('#formStatus');
    if (!ok) { status.textContent = 'Please fix the highlighted fields.'; return; }
    const list = store.get(KEYS.inquiries, []);
    list.push({ id: uid('q'), name: f.name.value.trim(), contact: f.contact.value.trim(), message: f.message.value.trim(), at: new Date().toISOString() });
    store.set(KEYS.inquiries, list);
    status.textContent = 'Thank you! The store will reply by phone or message.';
    form.reset();
  });
}

function initRegister() {
  const form = $('#registerForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors(form);
    const f = form.elements;
    let ok = true;
    const name = f.name.value.trim(), mobile = f.mobile.value.replace(/[\s-]/g, ''), email = f.email.value.trim().toLowerCase();
    if (name.length < 2) { fieldError(f.name, 'Enter your full name.'); ok = false; }
    if (!/^(09|\+639)\d{9}$/.test(mobile)) { fieldError(f.mobile, 'Use a Philippine mobile number like 09171234567.'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fieldError(f.email, 'Enter a valid email address.'); ok = false; }
    else if (getUsers().some(u => u.email === email)) { fieldError(f.email, 'This email already has an account.'); ok = false; }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(f.password.value)) { fieldError(f.password, 'Use 8 or more characters with a letter and a number.'); ok = false; }
    if (f.confirm.value !== f.password.value) { fieldError(f.confirm, 'Passwords do not match.'); ok = false; }
    if (!f.consent.checked) { fieldError(f.consent, 'Please agree to the data privacy notice.'); ok = false; }
    if (!ok) { $('#registerStatus').textContent = 'Please fix the highlighted fields.'; return; }
    const user = { id: uid('u'), name, mobile, email, passHash: await sha256(f.password.value), role: 'customer', created: new Date().toISOString() };
    const users = getUsers(); users.push(user); saveUsers(users);
    setSession(user);
    location.href = safeNext() || 'menu.html';
  });
}

function initLogin() {
  const form = $('#loginForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors(form);
    const f = form.elements;
    const status = $('#loginStatus');
    const user = getUsers().find(u => u.email === f.email.value.trim().toLowerCase());
    const hash = await sha256(f.password.value);
    if (!user || user.passHash !== hash) { status.textContent = 'Email or password is not correct.'; return; }
    if (user.blocked) { status.textContent = 'This account is blocked. Please contact the store.'; return; }
    setSession(user);
    location.href = isStaff(user) ? 'admin.html' : (safeNext() || 'menu.html');
  });
}

function initProfile() {
  const user = requireLogin();
  if (!user) return;
  const form = $('#profileForm');
  form.elements.name.value = user.name;
  form.elements.mobile.value = user.mobile || '';
  form.elements.email.value = user.email;
  const mine = getRecords().filter(r => r.userId === user.id);
  $('#profileStats').replaceChildren(h('h2', {}, 'Your activity'),
    h('p', {}, `Account type: ${user.role}`), h('p', {}, `Orders: ${mine.filter(r => r.kind === 'order').length}`),
    h('p', {}, `Reservations: ${mine.filter(r => r.kind === 'reservation').length}`), h('p', {}, `Event bookings: ${mine.filter(r => r.kind === 'event').length}`),
    h('p', {}, h('a', { href: 'orders.html' }, 'View my orders')));
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors(form);
    const f = form.elements;
    const mobile = f.mobile.value.replace(/[\s-]/g, '');
    let ok = true;
    if (f.name.value.trim().length < 2) { fieldError(f.name, 'Enter your full name.'); ok = false; }
    if (user.role === 'customer' && !/^(09|\+639)\d{9}$/.test(mobile)) { fieldError(f.mobile, 'Use a Philippine mobile number like 09171234567.'); ok = false; }
    if (!ok) return;
    const users = getUsers();
    const me = users.find(u => u.id === user.id);
    me.name = f.name.value.trim(); me.mobile = mobile;
    saveUsers(users);
    $('#profileStatus').textContent = 'Saved.';
    buildHeader();
  });
}

/* ===== 9. CUSTOMER PAGES: CART, RESERVE, EVENT, MY ORDERS, REVIEWS ===== */
function fillTimeSelect(select, settings) {
  select.replaceChildren(h('option', { value: '' }, 'Choose a time'), ...timeSlots(settings).map(t => h('option', { value: t }, fmtTime(t))));
}
/** Show total, deposit and balance. Returns the deposit amount. */
function renderSummary(box, total, pct) {
  const deposit = Math.round(total * pct / 100);
  box.replaceChildren(
    h('p', {}, h('span', {}, 'Total'), h('span', {}, peso(total))),
    h('p', { class: 'big' }, h('span', {}, `Deposit to pay now (${pct}%)`), h('span', {}, peso(deposit))),
    h('p', {}, h('span', {}, 'Balance at pickup'), h('span', {}, peso(total - deposit))));
  return deposit;
}

/* ----- Cart and checkout ----- */
function initCart() {
  const form = $('#checkoutForm');
  const settings = getSettings();
  form.elements.date.min = todayStr();
  form.elements.date.value = todayStr();
  fillTimeSelect(form.elements.time, settings);
  renderCart();
  form.addEventListener('submit', handleCheckout);
}
function setQty(id, value) {
  const qty = Math.max(1, Math.min(50, parseInt(value, 10) || 1));
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if (line) line.qty = qty;
  saveCart(cart); updateCartBadge(); renderCart();
}
function removeFromCart(id) { saveCart(getCart().filter(l => l.id !== id)); updateCartBadge(); renderCart(); }

function renderCart() {
  const box = $('#cartContent'), form = $('#checkoutForm'), suggest = $('#suggestBox');
  const lines = cartLines();
  if (!lines.length) {
    box.replaceChildren(h('div', { class: 'info-box' }, h('p', {}, 'Your cart is empty.'), h('a', { class: 'btn btn-primary', href: 'menu.html' }, 'Browse the menu'),
      h('p', { class: 'note' }, 'For a whole lechon, use ', h('a', { href: 'reserve.html' }, 'Reserve'), '.')));
    form.hidden = true; suggest.hidden = true;
    return;
  }
  form.hidden = false;
  box.replaceChildren(dataTable(['Item', 'Price', 'Qty', 'Subtotal', ''], lines.map(({ item, qty, subtotal }) => [
    item.name, peso(item.price),
    h('input', { type: 'number', min: '1', max: '50', value: String(qty), 'aria-label': `Quantity of ${item.name}`, onChange: e => setQty(item.id, e.target.value) }),
    peso(subtotal),
    h('button', { type: 'button', class: 'btn btn-danger btn-sm', 'aria-label': 'Remove ' + item.name, onClick: () => removeFromCart(item.id) }, 'Remove')
  ]), 'Cart items'));
  $('#checkoutTotal').textContent = peso(lines.reduce((s, l) => s + l.subtotal, 0));
  // Suggestions from items that are often bought together
  const inCart = lines.map(l => l.item.id);
  const ideas = suggestFor(inCart).slice(0, 3);
  suggest.hidden = !ideas.length;
  suggest.replaceChildren(h('h2', {}, 'Customers also add'), h('div', { class: 'cta-row' },
    ideas.map(item => h('button', { type: 'button', class: 'btn btn-outline btn-sm', onClick: () => { addToCart(item.id); renderCart(); } }, `+ ${item.name} (${peso(item.price)})`))));
}

async function handleCheckout(e) {
  e.preventDefault();
  const form = e.target;
  clearErrors(form);
  const user = requireLogin();
  if (!user) return;
  const f = form.elements;
  const lines = cartLines();
  if (!lines.length) { toast('Your cart is empty.', 'error'); return; }
  const date = f.date.value, time = f.time.value, orderType = f.orderType.value, pay = f.pay.value;
  let ok = true;
  if (!date || date < todayStr()) { fieldError(f.date, 'Choose today or a later date.'); ok = false; }
  if (!time) { fieldError(f.time, 'Choose a pickup time.'); ok = false; }
  else if (date && new Date(`${date}T${time}:00`) < new Date(Date.now() + 30 * 60000)) { fieldError(f.time, 'Choose a time at least 30 minutes from now.'); ok = false; }
  if (!ok) return;
  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  let paid = false;
  if (pay !== 'Pay at pickup') {
    const result = await simulatePayment({ amount: total, method: pay, label: 'Payment for your Lechon De Jay order' });
    if (result === null) return;
    if (result === false) { toast('Payment failed. Your cart is kept. Please try again.', 'error'); return; }
    paid = true;
  }
  const rec = addRecord({
    kind: 'order', userId: user.id, userName: user.name, mobile: user.mobile,
    items: lines.map(l => lineToRecordItem(l.item, l.qty)), total, orderType, date, time, notes: f.notes.value.trim(),
    payMethod: pay, payStatus: paid ? 'Paid' : 'Pay at pickup', amountPaid: paid ? total : 0, status: 'Received'
  });
  saveCart([]); updateCartBadge(); renderCart();
  showReceipt(rec, () => { location.href = 'orders.html'; });
}

/* ----- Lechon reservation ----- */
function initReserve() {
  const user = requireLogin();
  if (!user) return;
  const settings = getSettings();
  const form = $('#reserveForm'), f = form.elements;
  const sizes = getMenu().filter(i => i.cat === 'Whole Lechon' && i.available && !i.soon);
  const addons = getMenu().filter(i => i.cat === ADDON_CAT && i.available);
  f.size.replaceChildren(h('option', { value: '' }, 'Choose a size'), ...sizes.map(i => h('option', { value: i.id }, `${i.name} · ${i.desc} · ${peso(i.price)}`)));
  const wanted = new URLSearchParams(location.search).get('size');
  if (sizes.some(s => s.id === wanted)) f.size.value = wanted;
  f.date.min = addDays(todayStr(), settings.leadDays);
  f.date.value = f.date.min;
  fillTimeSelect(f.time, settings);
  $('#reserveAddons').replaceChildren(...addons.map(a => h('label', { class: 'check' },
    h('input', { type: 'checkbox', name: 'addon', value: a.id, onChange: update }), `${a.name} (${peso(a.price)})`)));
  $('#reserveRules').textContent = `Reserve at least ${settings.leadDays} days ahead. The store roasts up to ${settings.dailyLimit} whole lechon per day. A ${settings.depositPct}% deposit holds your date.`;

  function chosen() {
    const size = sizes.find(s => s.id === f.size.value);
    const extras = $$('input[name="addon"]:checked', form).map(c => addons.find(a => a.id === c.value)).filter(Boolean);
    const total = (size ? size.price : 0) + extras.reduce((s, a) => s + a.price, 0);
    return { size, extras, total };
  }
  function update() { renderSummary($('#reserveSummary'), chosen().total, settings.depositPct); }
  f.size.addEventListener('change', update);
  update();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors(form);
    const { size, extras, total } = chosen();
    let ok = true;
    if (!size) { fieldError(f.size, 'Choose a lechon size.'); ok = false; }
    if (!f.date.value || f.date.value < f.date.min) { fieldError(f.date, `Choose a date at least ${settings.leadDays} days from today.`); ok = false; }
    else if (lechonBooked(f.date.value) + 1 > settings.dailyLimit) { fieldError(f.date, 'That date is full. Please choose another date.'); ok = false; }
    if (!f.time.value) { fieldError(f.time, 'Choose a pickup time.'); ok = false; }
    if (!ok) return;
    const deposit = Math.round(total * settings.depositPct / 100);
    const pay = f.pay.value;
    const result = await simulatePayment({ amount: deposit, method: pay, label: 'Deposit to hold your whole lechon reservation' });
    if (result === null) return;
    if (result === false) { toast('Payment failed. Your reservation was not saved. Please try again.', 'error'); return; }
    if (lechonBooked(f.date.value) + 1 > settings.dailyLimit) { toast('Sorry, that date was just filled. Please choose another date.', 'error'); return; }
    const rec = addRecord({
      kind: 'reservation', userId: user.id, userName: user.name, mobile: user.mobile,
      items: [lineToRecordItem(size, 1), ...extras.map(a => lineToRecordItem(a, 1))], total,
      date: f.date.value, time: f.time.value, notes: f.notes.value.trim(),
      payMethod: pay, payStatus: 'Deposit paid', amountPaid: deposit, status: 'Received'
    });
    showReceipt(rec, () => { location.href = 'orders.html'; });
  });
}

/* ----- Event booking ----- */
function initEvent() {
  const user = requireLogin();
  if (!user) return;
  const settings = getSettings();
  const form = $('#eventForm'), f = form.elements;
  const sizes = getMenu().filter(i => i.cat === 'Whole Lechon' && i.available && !i.soon);
  f.size.replaceChildren(h('option', { value: '' }, 'No lechon yet (staff will send a quote)'), ...sizes.map(i => h('option', { value: i.id }, `${i.name} · ${i.desc} · ${peso(i.price)}`)));
  f.date.min = addDays(todayStr(), settings.leadDays);
  fillTimeSelect(f.time, settings);
  $('#eventRules').textContent = `Book at least ${settings.leadDays} days ahead. Staff will confirm your date or suggest another one. If you choose a lechon size, a ${settings.depositPct}% deposit is paid now.`;

  function update() {
    const size = sizes.find(s => s.id === f.size.value);
    if (size) renderSummary($('#eventSummary'), size.price, settings.depositPct);
    else $('#eventSummary').replaceChildren(h('p', {}, 'No deposit now. Staff will send you a quote.'));
  }
  f.size.addEventListener('change', update);
  update();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors(form);
    const size = sizes.find(s => s.id === f.size.value);
    const guests = parseInt(f.guests.value, 10);
    let ok = true;
    if (!f.eventType.value) { fieldError(f.eventType, 'Choose the event type.'); ok = false; }
    if (!(guests >= 10 && guests <= 500)) { fieldError(f.guests, 'Enter 10 to 500 guests.'); ok = false; }
    if (!f.date.value || f.date.value < f.date.min) { fieldError(f.date, `Choose a date at least ${settings.leadDays} days from today.`); ok = false; }
    else if (size && lechonBooked(f.date.value) + 1 > settings.dailyLimit) { fieldError(f.date, 'We cannot roast another lechon on that date. Choose another date.'); ok = false; }
    if (!f.time.value) { fieldError(f.time, 'Choose a time.'); ok = false; }
    if (!ok) return;
    const pay = f.pay.value;
    let deposit = 0;
    if (size) {
      deposit = Math.round(size.price * settings.depositPct / 100);
      const result = await simulatePayment({ amount: deposit, method: pay, label: 'Deposit to hold your event booking' });
      if (result === null) return;
      if (result === false) { toast('Payment failed. Your booking was not saved. Please try again.', 'error'); return; }
    }
    const rec = addRecord({
      kind: 'event', userId: user.id, userName: user.name, mobile: user.mobile,
      eventType: f.eventType.value, guests, extra: f.extra.value.trim(), notes: f.notes.value.trim(),
      items: size ? [lineToRecordItem(size, 1)] : [], total: size ? size.price : 0,
      date: f.date.value, time: f.time.value,
      payMethod: size ? pay : 'None', payStatus: size ? 'Deposit paid' : 'Quote pending', amountPaid: deposit, status: 'Pending'
    });
    showReceipt(rec, () => { location.href = 'orders.html'; });
  });
}

/* ----- My Orders: tracking, history, reorder, reviews ----- */
let recordFilter = 'all';
const FILTERS = [['all', 'All'], ['order', 'Orders'], ['reservation', 'Reservations'], ['event', 'Events']];

function initOrders() {
  const user = requireLogin();
  if (!user) return;
  const notes = store.get(KEYS.notices, []).filter(n => n.userId === user.id).slice(-5).reverse();
  const box = $('#notices');
  box.hidden = !notes.length;
  box.replaceChildren(h('h2', {}, 'Latest updates'), h('ul', { class: 'record-items' }, notes.map(n => h('li', {}, `${new Date(n.at).toLocaleString('en-PH')}: ${n.text}`))));
  renderRecords(user);
}
function renderRecords(user) {
  $('#recordFilter').replaceChildren(...FILTERS.map(([key, label]) =>
    h('button', { type: 'button', class: 'tab', 'aria-pressed': String(key === recordFilter), onClick: () => { recordFilter = key; renderRecords(user); } }, label)));
  const mine = getRecords().filter(r => r.userId === user.id && (recordFilter === 'all' || r.kind === recordFilter)).sort((a, b) => b.created.localeCompare(a.created));
  $('#recordList').replaceChildren(...(mine.length ? mine.map(r => recordCard(r, user)) : [h('div', { class: 'info-box' }, h('p', {}, 'Nothing here yet.'), h('a', { class: 'btn btn-primary', href: 'menu.html' }, 'Order now'))]));
}

/** Progress steps for a record. Cancelled or declined records show a text badge instead. */
function progressList(rec) {
  if (CLOSED.includes(rec.status)) return h('p', {}, statusBadge(rec.status), rec.reason ? ' ' + rec.reason : '');
  const flow = rec.kind === 'event' ? EVENT_FLOW : ORDER_FLOW;
  const at = flow.indexOf(rec.status);
  return h('ol', { class: 'progress', 'aria-label': 'Progress' }, flow.map((s, i) =>
    h('li', { class: i < at ? 'done' : (i === at ? 'current' : null), 'aria-current': i === at ? 'step' : null }, s)));
}

function recordCard(rec, user) {
  const refresh = () => renderRecords(user);
  const reviewed = getReviews().some(r => r.recordId === rec.id);
  const paidLine = `${rec.payMethod} · ${rec.payStatus}` + (rec.amountPaid ? ` · paid ${peso(rec.amountPaid)}` : '') + (rec.total > rec.amountPaid ? ` · balance ${peso(rec.total - rec.amountPaid)}` : '');
  const actions = h('div', { class: 'record-actions' },
    h('button', { type: 'button', class: 'btn btn-outline btn-sm', onClick: () => showReceipt(rec) }, 'Receipt'),
    rec.kind === 'order' ? h('button', { type: 'button', class: 'btn btn-outline btn-sm', onClick: () => { rec.items.forEach(i => addToCart(i.id, i.qty, true)); location.href = 'cart.html'; } }, 'Order again') : null,
    ['Received', 'Pending'].includes(rec.status) ? h('button', { type: 'button', class: 'btn btn-danger btn-sm', onClick: () => {
      if (!confirm(`Cancel ${rec.id}? Staff will contact you about any deposit.`)) return;
      changeStatus(rec.id, 'Cancelled', 'Cancelled by customer'); toast('Cancelled.'); refresh();
    } }, 'Cancel') : null,
    rec.status === 'Completed' && !reviewed ? h('button', { type: 'button', class: 'btn btn-gold btn-sm', onClick: ev => { ev.target.disabled = true; card.append(reviewForm(rec, user, refresh)); } }, 'Write a review') : null);
  const card = h('article', { class: 'record-card' },
    h('div', { class: 'record-head' }, h('h3', {}, `${KIND_LABEL[rec.kind]} ${rec.id}`), statusBadge(rec.status)),
    h('p', { class: 'record-meta' }, `${rec.kind === 'order' ? rec.orderType + ' pickup' : 'Date'}: ${fmtDate(rec.date)} at ${fmtTime(rec.time)} · placed ${new Date(rec.created).toLocaleDateString('en-PH')}`),
    rec.eventType ? h('p', { class: 'record-meta' }, `${rec.eventType} · ${rec.guests} guests${rec.extra ? ' · Extra dishes: ' + rec.extra : ''}`) : null,
    h('ul', { class: 'record-items' }, rec.items.length ? rec.items.map(i => h('li', {}, `${i.qty} × ${i.name} · ${peso(i.price * i.qty)}`)) : [h('li', {}, 'To be quoted by staff')]),
    h('p', {}, h('strong', {}, `Total ${peso(rec.total)}`), ' · ', paidLine),
    rec.notes ? h('p', { class: 'record-meta' }, 'Notes: ' + rec.notes) : null,
    progressList(rec),
    reviewed ? h('p', { class: 'record-meta' }, 'Thanks for your review.') : null,
    actions);
  return card;
}

function reviewForm(rec, user, refresh) {
  const select = h('select', { name: 'rating', required: true }, [5, 4, 3, 2, 1].map(n => h('option', { value: String(n) }, `${n} star${n > 1 ? 's' : ''}`)));
  const comment = h('textarea', { name: 'comment', rows: '3', maxlength: '300' });
  const form = h('form', { class: 'review-form', novalidate: true, onSubmit: e => {
    e.preventDefault();
    const reviews = getReviews();
    reviews.push({ id: uid('r'), recordId: rec.id, userId: user.id, userName: displayName(user), rating: parseInt(select.value, 10), comment: comment.value.trim(), status: 'Pending', created: new Date().toISOString() });
    saveReviews(reviews);
    toast('Thank you! Your review will appear after the store approves it.');
    refresh();
  } },
    h('label', {}, 'Your rating ', select), h('label', {}, 'Comment (optional) ', comment),
    h('button', { type: 'submit', class: 'btn btn-primary btn-sm' }, 'Submit review'));
  return form;
}

/* ===== 10. ADMIN PAGES ===== */
const ADMIN_TABS = [
  { key: 'dashboard', label: 'Dashboard', roles: ['admin', 'staff'], render: adminDashboard },
  { key: 'orders', label: 'Orders', roles: ['admin', 'staff'], render: adminOrders },
  { key: 'calendar', label: 'Calendar', roles: ['admin', 'staff'], render: adminCalendar },
  { key: 'menu', label: 'Menu', roles: ['admin', 'staff'], render: adminMenu },
  { key: 'customers', label: 'Customers', roles: ['admin'], render: adminCustomers },
  { key: 'reviews', label: 'Reviews', roles: ['admin'], render: adminReviews },
  { key: 'reports', label: 'Reports', roles: ['admin'], render: adminReports },
  { key: 'forecast', label: 'Forecast & Insights', roles: ['admin'], render: adminForecast },
  { key: 'settings', label: 'Settings', roles: ['admin'], render: adminSettings }
];
let adminUser = null;

function initAdmin() {
  adminUser = requireLogin();
  if (!adminUser) return;
  if (!isStaff(adminUser)) {
    $('#adminTabs').hidden = true;
    $('#adminPanel').replaceChildren(h('div', { class: 'info-box' }, h('p', {}, 'This area is for the owner and staff only.'), h('a', { class: 'btn btn-primary', href: 'index.html' }, 'Back to Home')));
    return;
  }
  window.addEventListener('hashchange', renderAdmin);
  renderAdmin();
}
function renderAdmin() {
  const tabs = ADMIN_TABS.filter(t => t.roles.includes(adminUser.role));
  const tab = tabs.find(t => t.key === location.hash.replace('#', '')) || tabs[0];
  $('#adminTabs').replaceChildren(...tabs.map(t => h('a', { href: '#' + t.key, class: t === tab ? 'active' : null, 'aria-current': t === tab ? 'page' : null }, t.label)));
  const panel = $('#adminPanel');
  panel.replaceChildren();
  tab.render(panel);
}
const summarizeItems = rec => rec.items.map(i => `${i.qty}× ${i.name}`).join(', ') || 'Quote needed';

/** Status dropdown that saves the change and tells the customer. */
function statusSelect(rec, after) {
  const options = statusOptions(rec.kind);
  if (!options.includes(rec.status)) options.unshift(rec.status);
  const sel = h('select', { 'aria-label': `Status of ${rec.id}` }, options.map(s => h('option', { value: s, selected: s === rec.status }, s)));
  sel.addEventListener('change', () => {
    let reason = '';
    if (CLOSED.includes(sel.value)) {
      reason = prompt('Reason (the customer will see this):', '');
      if (reason === null) { sel.value = rec.status; return; }
    }
    changeStatus(rec.id, sel.value, reason.trim());
    toast(`${rec.id} is now ${sel.value}`);
    if (after) after();
  });
  return sel;
}
function recordsTable(list, after) {
  return dataTable(['ID', 'Customer', 'Type', 'Pickup / date', 'Items', 'Status'], list.map(r => [
    r.id, r.userName, KIND_LABEL[r.kind], `${fmtDate(r.date)} ${fmtTime(r.time)}`, summarizeItems(r), statusSelect(r, after)
  ]), 'Records');
}
/** Add a canvas chart inside a box. The box must already be in the page so its width is known. */
function addChart(parent, label, draw) {
  const canvas = h('canvas', { role: 'img', 'aria-label': label });
  parent.append(h('div', { class: 'chart-box' }, canvas));
  draw(canvas);
}

/* ----- Dashboard ----- */
function adminDashboard(panel) {
  const today = todayStr(), settings = getSettings();
  const all = getRecords(), live = activeRecords(all);
  const todays = live.filter(r => r.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const pending = all.filter(r => ['Received', 'Pending'].includes(r.status)).sort((a, b) => a.date.localeCompare(b.date));
  const stats = [
    statCard(String(todays.filter(r => r.kind === 'order').length), 'Orders for pickup today'),
    statCard(String(pending.length), 'Waiting for confirmation'),
    statCard(String(live.filter(r => r.kind === 'event' && r.date >= today).length), 'Upcoming events'),
    statCard(`${lechonBooked(today)} / ${settings.dailyLimit}`, 'Whole lechon today / daily limit')
  ];
  if (adminUser.role === 'admin') {
    stats.push(statCard(peso(todays.filter(r => r.status === 'Completed').reduce((s, r) => s + r.total, 0)), 'Completed sales today'));
    stats.push(statCard(peso(all.filter(r => r.created.slice(0, 10) === today).reduce((s, r) => s + (r.amountPaid || 0), 0)), 'Payments received today'));
  }
  panel.append(h('h2', {}, 'Dashboard'), h('div', { class: 'stat-grid' }, stats),
    h('h2', {}, 'Needs action'), recordsTable(pending, renderAdmin),
    h('h2', {}, "Today's pickups"), recordsTable(todays, renderAdmin));
}

/* ----- Orders queue ----- */
function adminOrders(panel) {
  const state = { kind: 'all', status: 'all', q: '' };
  const listBox = h('div');
  const allStatuses = [...new Set([...ORDER_FLOW, ...EVENT_FLOW, ...CLOSED])];
  const toolbar = h('div', { class: 'toolbar' },
    h('label', {}, 'Type', h('select', { onChange: e => { state.kind = e.target.value; draw(); } },
      h('option', { value: 'all' }, 'All'), ...Object.entries(KIND_LABEL).map(([k, v]) => h('option', { value: k }, v)))),
    h('label', {}, 'Status', h('select', { onChange: e => { state.status = e.target.value; draw(); } },
      h('option', { value: 'all' }, 'All'), ...allStatuses.map(s => h('option', { value: s }, s)))),
    h('label', {}, 'Search ID or customer', h('input', { type: 'search', onInput: e => { state.q = e.target.value.trim().toLowerCase(); draw(); } })));
  function draw() {
    const list = getRecords().slice().sort((a, b) => b.created.localeCompare(a.created)).filter(r =>
      (state.kind === 'all' || r.kind === state.kind) && (state.status === 'all' || r.status === state.status) &&
      (!state.q || r.id.toLowerCase().includes(state.q) || r.userName.toLowerCase().includes(state.q)));
    listBox.replaceChildren(dataTable(['Order', 'Customer', 'Pickup / date', 'Items', 'Payment', 'Status', 'Action'], list.map(r => [
      h('span', {}, r.id, h('br'), h('span', { class: 'small' }, KIND_LABEL[r.kind])),
      h('span', {}, r.userName, h('br'), h('span', { class: 'small' }, r.mobile || '')),
      h('span', {}, `${fmtDate(r.date)} ${fmtTime(r.time)}`, r.orderType ? h('br') : null, r.orderType ? h('span', { class: 'small' }, r.orderType) : null),
      h('span', {}, summarizeItems(r), r.eventType ? h('br') : null, r.eventType ? h('span', { class: 'small' }, `${r.eventType}, ${r.guests} guests${r.extra ? '. Extra: ' + r.extra : ''}`) : null, r.notes ? h('br') : null, r.notes ? h('span', { class: 'small' }, 'Notes: ' + r.notes) : null),
      h('span', {}, peso(r.total), h('br'), h('span', { class: 'small' }, `${r.payMethod}: ${r.payStatus}`)),
      statusSelect(r, draw),
      r.payStatus !== 'Paid' && r.total > 0 && !CLOSED.includes(r.status) ? h('button', { type: 'button', class: 'btn btn-outline btn-sm', onClick: () => {
        updateRecord(r.id, x => { x.payStatus = 'Paid'; x.amountPaid = x.total; }); toast(`${r.id} marked as paid`); draw();
      } }, 'Mark paid') : ''
    ]), 'All records'));
  }
  panel.append(h('h2', {}, 'Orders, reservations and events'), toolbar, listBox);
  draw();
}

/* ----- Reservation and event calendar ----- */
function adminCalendar(panel) {
  const settings = getSettings();
  const now = new Date();
  const state = { y: now.getFullYear(), m: now.getMonth(), sel: todayStr() };
  const wrap = h('div');
  const move = n => { const d = new Date(state.y, state.m + n, 1); state.y = d.getFullYear(); state.m = d.getMonth(); draw(); };
  function draw() {
    const records = getRecords().filter(r => r.kind !== 'order');
    const live = activeRecords(records);
    const first = new Date(state.y, state.m, 1), days = new Date(state.y, state.m + 1, 0).getDate();
    const cells = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => h('div', { class: 'cal-head' }, d));
    for (let i = 0; i < first.getDay(); i++) cells.push(h('div', { class: 'cal-day blank', 'aria-hidden': 'true' }));
    for (let d = 1; d <= days; d++) {
      const ds = `${state.y}-${pad(state.m + 1)}-${pad(d)}`;
      const onDay = live.filter(r => r.date === ds);
      const lechon = onDay.reduce((n, r) => n + lechonQty(r), 0);
      const events = onDay.filter(r => r.kind === 'event').length;
      const full = lechon >= settings.dailyLimit;
      cells.push(h('button', {
        type: 'button', class: ['cal-day', ds === todayStr() ? 'today' : '', ds === state.sel ? 'selected' : '', full ? 'full' : ''].join(' ').trim(),
        'aria-pressed': String(ds === state.sel), 'aria-label': `${fmtDate(ds)}: ${lechon} of ${settings.dailyLimit} whole lechon, ${events} events`,
        onClick: () => { state.sel = ds; draw(); }
      }, h('span', { class: 'd' }, String(d)),
        lechon ? h('span', { class: 'tag' }, `Lechon ${lechon}/${settings.dailyLimit}${full ? ' FULL' : ''}`) : null,
        events ? h('span', { class: 'tag' }, `Events ${events}`) : null));
    }
    const dayList = records.filter(r => r.date === state.sel).sort((a, b) => a.time.localeCompare(b.time));
    wrap.replaceChildren(
      h('div', { class: 'cal-nav' },
        h('button', { type: 'button', class: 'btn btn-outline btn-sm', onClick: () => move(-1) }, '‹ Previous'),
        h('strong', { 'aria-live': 'polite' }, new Date(state.y, state.m, 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })),
        h('button', { type: 'button', class: 'btn btn-outline btn-sm', onClick: () => move(1) }, 'Next ›')),
      h('div', { class: 'cal-grid' }, cells),
      h('h2', {}, fmtDate(state.sel)),
      dayList.length ? recordsTable(dayList, draw) : h('p', { class: 'empty' }, 'No reservations or events on this date.'));
  }
  panel.append(h('h2', {}, 'Reservation and event calendar'), wrap);
  draw();
}

/* ----- Menu management ----- */
function adminMenu(panel) {
  const isAdmin = adminUser.role === 'admin';
  const wrap = h('div');
  const edit = (id, field, value) => {
    const menu = getMenu();
    const item = menu.find(i => i.id === id);
    if (!item) return;
    item[field] = value;
    saveMenu(menu);
    toast('Saved');
  };
  function draw() {
    const cats = [...CATEGORIES, ADDON_CAT];
    const rows = getMenu().map(item => [
      isAdmin ? h('input', { type: 'text', value: item.name, 'aria-label': 'Name', maxlength: '60', onChange: e => edit(item.id, 'name', e.target.value.trim() || item.name) }) : item.name,
      isAdmin ? h('input', { type: 'text', value: item.desc, 'aria-label': 'Description of ' + item.name, maxlength: '100', onChange: e => edit(item.id, 'desc', e.target.value.trim()) }) : item.desc,
      isAdmin ? h('select', { 'aria-label': 'Category of ' + item.name, onChange: e => edit(item.id, 'cat', e.target.value) }, cats.map(c => h('option', { value: c, selected: c === item.cat }, c))) : item.cat,
      isAdmin ? h('input', { type: 'number', min: '0', step: '1', value: String(item.price), 'aria-label': 'Price of ' + item.name, onChange: e => edit(item.id, 'price', Math.max(0, Number(e.target.value) || 0)) }) : peso(item.price),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: item.available, onChange: e => edit(item.id, 'available', e.target.checked) }), 'Available'),
      isAdmin ? h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !!item.soon, onChange: e => edit(item.id, 'soon', e.target.checked) }), 'Coming soon') : (item.soon ? 'Coming soon' : ''),
      isAdmin ? h('button', { type: 'button', class: 'btn btn-danger btn-sm', 'aria-label': 'Delete ' + item.name, onClick: () => {
        if (!confirm(`Delete ${item.name}?`)) return;
        saveMenu(getMenu().filter(i => i.id !== item.id)); draw();
      } }, 'Delete') : ''
    ]);
    wrap.replaceChildren(dataTable(['Name', 'Description', 'Category', 'Price (₱)', 'Availability', 'Launch', ''], rows, 'Menu items'));
  }
  panel.append(h('h2', {}, 'Menu'),
    h('p', { class: 'note' }, isAdmin ? 'Changes save right away and appear on the public Menu page.' : 'Staff can mark items available or sold out. Only the owner can change names and prices.'),
    wrap);
  draw();
  if (isAdmin) {
    const form = h('form', { class: 'form-box', novalidate: true, onSubmit: e => {
      e.preventDefault();
      clearErrors(form);
      const f = form.elements;
      if (f.name.value.trim().length < 2) { fieldError(f.name, 'Enter an item name.'); return; }
      const price = Number(f.price.value);
      if (!(price >= 0) || f.price.value === '') { fieldError(f.price, 'Enter a price.'); return; }
      const menu = getMenu();
      menu.push({ id: uid('i'), cat: f.cat.value, name: f.name.value.trim(), desc: f.desc.value.trim(), price, available: true });
      saveMenu(menu); toast('Item added'); form.reset(); draw();
    } },
      h('h2', {}, 'Add a menu item'),
      h('div', { class: 'form-row' }, h('label', {}, 'Name', h('input', { name: 'name', type: 'text', maxlength: '60' })), h('label', {}, 'Category', h('select', { name: 'cat' }, [...CATEGORIES, ADDON_CAT].map(c => h('option', { value: c }, c))))),
      h('div', { class: 'form-row' }, h('label', {}, 'Description', h('input', { name: 'desc', type: 'text', maxlength: '100' })), h('label', {}, 'Price (₱)', h('input', { name: 'price', type: 'number', min: '0', step: '1' }))),
      h('button', { type: 'submit', class: 'btn btn-primary' }, 'Add item'));
    panel.append(form);
  }
}

/* ----- Customers and inquiries ----- */
function adminCustomers(panel) {
  const records = getRecords();
  const customers = getUsers().filter(u => u.role === 'customer');
  panel.append(h('h2', {}, 'Customers'), dataTable(['Name', 'Email', 'Mobile', 'Records', 'Paid online', 'Account'], customers.map(u => {
    const mine = records.filter(r => r.userId === u.id);
    return [u.name, u.email, u.mobile || '', String(mine.length), peso(mine.reduce((s, r) => s + (r.amountPaid || 0), 0)),
      h('button', { type: 'button', class: u.blocked ? 'btn btn-gold btn-sm' : 'btn btn-danger btn-sm', onClick: () => {
        const users = getUsers(); const me = users.find(x => x.id === u.id); me.blocked = !me.blocked; saveUsers(users); renderAdmin();
      } }, u.blocked ? 'Unblock' : 'Block')];
  }), 'Customers'));
  const inquiries = store.get(KEYS.inquiries, []).slice().reverse();
  panel.append(h('h2', {}, 'Messages from the contact form'), dataTable(['Date', 'Name', 'Contact', 'Message'], inquiries.map(q => [new Date(q.at).toLocaleString('en-PH'), q.name, q.contact, q.message]), 'Inquiries'));
}

/* ----- Review moderation ----- */
function adminReviews(panel) {
  const set = (id, status) => { const list = getReviews(); const r = list.find(x => x.id === id); if (r) r.status = status; saveReviews(list); renderAdmin(); };
  const list = getReviews().slice().reverse();
  panel.append(h('h2', {}, 'Customer reviews'), h('p', { class: 'note' }, 'Only approved reviews are shown on the website.'),
    dataTable(['Date', 'Order', 'Customer', 'Rating', 'Comment', 'Status', 'Action'], list.map(r => [
      new Date(r.created).toLocaleDateString('en-PH'), r.recordId, r.userName, stars(r.rating), r.comment || '', statusBadge(r.status),
      h('span', {}, r.status !== 'Approved' ? h('button', { type: 'button', class: 'btn btn-primary btn-sm', onClick: () => set(r.id, 'Approved') }, 'Approve') : null,
        r.status !== 'Hidden' ? h('button', { type: 'button', class: 'btn btn-danger btn-sm', onClick: () => set(r.id, 'Hidden') }, 'Hide') : null)
    ]), 'Reviews'));
}

/* ----- Settings ----- */
function adminSettings(panel) {
  const s = getSettings();
  const seasonal = (s.seasonal || []).map(x => ({ ...x }));
  const seasonBox = h('div');
  function drawSeasons() {
    seasonBox.replaceChildren(dataTable(['Period name', 'From (MM-DD)', 'To (MM-DD)', 'Demand multiplier', ''], seasonal.map((p, i) => [
      h('input', { type: 'text', value: p.name, 'aria-label': 'Period name', maxlength: '40', onChange: e => { p.name = e.target.value.trim(); } }),
      h('input', { type: 'text', value: p.from, 'aria-label': 'From', placeholder: '12-23', maxlength: '5', onChange: e => { p.from = e.target.value.trim(); } }),
      h('input', { type: 'text', value: p.to, 'aria-label': 'To', placeholder: '12-25', maxlength: '5', onChange: e => { p.to = e.target.value.trim(); } }),
      h('input', { type: 'number', value: String(p.boost), step: '0.1', min: '1', max: '3', 'aria-label': 'Multiplier', onChange: e => { p.boost = Number(e.target.value) || 1; } }),
      h('button', { type: 'button', class: 'btn btn-danger btn-sm', onClick: () => { seasonal.splice(i, 1); drawSeasons(); } }, 'Remove')
    ]), 'Peak periods'), h('button', { type: 'button', class: 'btn btn-outline btn-sm', onClick: () => { seasonal.push({ name: 'New period', from: '01-01', to: '01-01', boost: 1.2 }); drawSeasons(); } }, 'Add a period'));
  }
  const num = (name, label, value, min, max) => h('label', {}, label, h('input', { name, type: 'number', min: String(min), max: String(max), value: String(value) }));
  const form = h('form', { class: 'form-box', novalidate: true, onSubmit: e => {
    e.preventDefault();
    clearErrors(form);
    const f = form.elements;
    const next = { phone: f.phone.value.trim(), leadDays: Number(f.leadDays.value), dailyLimit: Number(f.dailyLimit.value), depositPct: Number(f.depositPct.value), openHour: Number(f.openHour.value), closeHour: Number(f.closeHour.value), seasonal };
    let ok = true;
    if (!(next.leadDays >= 0 && next.leadDays <= 30)) { fieldError(f.leadDays, 'Use 0 to 30 days.'); ok = false; }
    if (!(next.dailyLimit >= 1 && next.dailyLimit <= 50)) { fieldError(f.dailyLimit, 'Use 1 to 50.'); ok = false; }
    if (!(next.depositPct >= 0 && next.depositPct <= 100)) { fieldError(f.depositPct, 'Use 0 to 100.'); ok = false; }
    if (!(next.openHour >= 0 && next.openHour < next.closeHour && next.closeHour <= 24)) { fieldError(f.openHour, 'Opening hour must be before closing hour.'); ok = false; }
    if (seasonal.some(p => !/^\d{2}-\d{2}$/.test(p.from) || !/^\d{2}-\d{2}$/.test(p.to))) { toast('Peak period dates must look like 12-24.', 'error'); ok = false; }
    if (!ok) return;
    saveSettings(next); toast('Settings saved'); buildFooter();
  } },
    h('h2', {}, 'Store rules'),
    h('label', {}, 'Store phone number', h('input', { name: 'phone', type: 'text', value: s.phone, maxlength: '30' })),
    h('div', { class: 'form-row' }, num('leadDays', 'Minimum days ahead for reservations', s.leadDays, 0, 30), num('dailyLimit', 'Whole lechon the store can roast per day', s.dailyLimit, 1, 50)),
    h('div', { class: 'form-row' }, num('depositPct', 'Deposit (% of total)', s.depositPct, 0, 100), h('span')),
    h('div', { class: 'form-row' }, num('openHour', 'Opening hour (24h)', s.openHour, 0, 23), num('closeHour', 'Closing hour (24h)', s.closeHour, 1, 24)),
    h('h2', {}, 'Peak periods for the forecast'),
    h('p', { class: 'note' }, 'Dates when demand is higher than usual. The forecast multiplies its prediction by the multiplier. Holy Week and fiesta dates change each year, so please update them.'),
    seasonBox,
    h('button', { type: 'submit', class: 'btn btn-primary' }, 'Save Settings'));
  drawSeasons();
  const reset = h('div', { class: 'form-box' }, h('h2', {}, 'Demo data'),
    h('p', { class: 'note' }, 'Clears all orders, reservations, events, reviews, messages and carts saved in this browser. Menu, accounts and settings are kept.'),
    h('button', { type: 'button', class: 'btn btn-danger', onClick: () => {
      if (!confirm('Clear all orders, reservations, events, reviews and messages in this browser?')) return;
      [KEYS.orders, KEYS.reviews, KEYS.notices, KEYS.inquiries, KEYS.cart].forEach(k => store.set(k, []));
      toast('Demo data cleared'); renderAdmin();
    } }, 'Clear demo data'));
  panel.append(h('h2', {}, 'Settings'), form, reset);
}

/* ===== 11. ANALYTICS: REPORTS, FORECASTING, PREFERENCE ANALYSIS, CHARTS ===== */
const shortDate = d => parseDate(d).toLocaleDateString('en-PH', { day: 'numeric', month: 'short' });
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Small seeded random generator so the sample data is the same every time. */
function seededRandom(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sample sales for the last 70 days, so the forecast and charts can be shown before the
 * store has real online history. It stands in for the owner's manual sales log.
 */
let sampleCache = null;
function sampleHistory() {
  if (sampleCache) return sampleCache;
  const rnd = seededRandom(2026);
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const byId = id => SEED_MENU.find(i => i.id === id);
  const ri = (item, qty) => ({ id: item.id, name: item.name, cat: item.cat, qty, price: item.price });
  const sizes = ['wl-regular', 'wl-regular', 'wl-medium1', 'wl-medium2', 'wl-large', 'wl-xl'].map(byId);
  const regular = SEED_MENU.filter(i => ['Meals', 'Snacks & Sides', 'Desserts & Drinks'].includes(i.cat));
  const lechonPerDay = [3.4, 0.9, 0.9, 1.1, 1.3, 2.2, 3.6]; // Sunday to Saturday
  const hours = [11, 12, 12, 13, 17, 18, 18, 19, 19, 20];
  const out = [];
  const make = (kind, date, time, items) => {
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    out.push({ id: 'S-' + (out.length + 1), sample: true, kind, userId: 'sample-' + (1 + Math.floor(rnd() * 400)), userName: 'Sample customer',
      date, time, items, total, payMethod: pick(['GCash', 'Maya', 'Pay at pickup']), payStatus: 'Paid', amountPaid: total, status: 'Completed', created: date + 'T09:00:00' });
  };
  for (let back = 70; back >= 1; back--) {
    const date = addDays(todayStr(), -back);
    const wd = parseDate(date).getDay();
    const boost = seasonFor(date, DEFAULT_SETTINGS).boost;
    const lechonCount = Math.max(0, Math.round((lechonPerDay[wd] + (rnd() - 0.5) * 2.2) * boost));
    for (let k = 0; k < lechonCount; k++) {
      const items = [ri(pick(sizes), 1)];
      if (rnd() < 0.4) items.push(ri(byId('a-bites'), 1));
      if (rnd() < 0.25) items.push(ri(byId('a-refresh'), 1));
      make('reservation', date, pick(['10:00', '11:00', '12:00', '15:00', '17:00']), items);
    }
    const orderCount = Math.round(7 + (wd === 0 || wd === 6 ? 6 : 0) + rnd() * 5);
    for (let k = 0; k < orderCount; k++) {
      const first = rnd() < 0.3 ? byId('m-budget') : pick(regular);
      const items = [ri(first, rnd() < 0.2 ? 2 : 1)];
      const second = pick(regular);
      if (rnd() < 0.5 && second.id !== first.id) items.push(ri(second, 1));
      if (first.id === 'm-paksiw' && rnd() < 0.5) items.push(ri(byId('a-refresh'), 1));
      if (first.id === 's-curly' && rnd() < 0.45) items.push(ri(byId('a-cheese'), 1));
      if (['m-unli', 'm-crew150', 'm-crew180'].includes(first.id) && rnd() < 0.4) items.push(ri(byId('a-refresh'), 1));
      make('order', date, `${pad(pick(hours))}:${pick(['00', '30'])}`, items);
    }
  }
  sampleCache = out;
  return out;
}
const allRecords = includeSample => (includeSample ? getRecords().concat(sampleHistory()) : getRecords());

/* ----- Demand forecasting for whole lechon ----- */
/** Whole lechon per date. */
function dailyLechonMap(records) {
  const m = {};
  activeRecords(records).forEach(r => { const q = lechonQty(r); if (q) m[r.date] = (m[r.date] || 0) + q; });
  return m;
}
/** Values for each weekday (Sunday = 0) between two dates, counting days with no lechon as 0. */
function weekdayValues(map, from, to) {
  const vals = [[], [], [], [], [], [], []];
  for (let d = from; d <= to; d = addDays(d, 1)) vals[parseDate(d).getDay()].push(map[d] || 0);
  return vals;
}
/**
 * Forecast = average of the same weekday in the past, times the peak-period multiplier.
 * The range is one standard deviation either side.
 */
function buildForecast(records, days, settings) {
  const active = activeRecords(records);
  if (!active.length) return null;
  const start = active.map(r => r.date).sort()[0];
  const yesterday = addDays(todayStr(), -1);
  if (start > yesterday) return null;
  const vals = weekdayValues(dailyLechonMap(active), start, yesterday);
  const sizeTotals = {};
  active.forEach(r => r.items.forEach(i => { if (i.cat === 'Whole Lechon') sizeTotals[i.name] = (sizeTotals[i.name] || 0) + i.qty; }));
  const grand = Object.values(sizeTotals).reduce((a, b) => a + b, 0) || 1;
  const reserved = dailyLechonMap(getRecords());
  const rows = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(todayStr(), i);
    const wd = parseDate(date).getDay();
    const season = seasonFor(date, settings);
    const mid = mean(vals[wd]) * season.boost;
    const spread = sd(vals[wd]) * season.boost;
    const booked = reserved[date] || 0;
    rows.push({
      date, mid, low: Math.max(0, mid - spread), high: mid + spread, season: season.name, reserved: booked,
      sizes: Object.fromEntries(Object.entries(sizeTotals).map(([n, t]) => [n, mid * t / grand])),
      note: booked >= settings.dailyLimit ? 'Full' : (mid + spread > settings.dailyLimit ? 'Near limit' : 'OK')
    });
  }
  return { rows, sizeNames: Object.keys(sizeTotals) };
}
/** Back-test: predict each of the last 14 days using only earlier days, and report the average % error (MAPE). */
function forecastAccuracy(records) {
  const active = activeRecords(records);
  if (active.length < 20) return null;
  const map = dailyLechonMap(active);
  const start = active.map(r => r.date).sort()[0];
  const errors = [];
  for (let k = 1; k <= 14; k++) {
    const d = addDays(todayStr(), -k);
    if (d <= start) continue;
    const prior = weekdayValues(map, start, addDays(d, -1))[parseDate(d).getDay()];
    const actual = map[d] || 0;
    if (prior.length >= 2 && actual > 0) errors.push(Math.abs(actual - mean(prior)) / actual);
  }
  return errors.length >= 3 ? mean(errors) * 100 : null;
}

/* ----- Customer preference analysis ----- */
function itemSales(records) {
  const m = {};
  records.forEach(r => r.items.forEach(i => { const e = m[i.name] || (m[i.name] = { qty: 0, sales: 0 }); e.qty += i.qty; e.sales += i.qty * i.price; }));
  return m;
}
function pairCounts(records) {
  const m = {};
  records.forEach(r => {
    const names = [...new Set(r.items.map(i => i.name))].sort();
    for (let a = 0; a < names.length; a++) for (let b = a + 1; b < names.length; b++) { const key = names[a] + ' + ' + names[b]; m[key] = (m[key] || 0) + 1; }
  });
  return m;
}
/** Customer groups by how often and how recently they order. Only counts are shown, no personal details. */
function customerSegments(records) {
  const byUser = {};
  records.forEach(r => { if (!r.userId) return; const u = byUser[r.userId] || (byUser[r.userId] = { n: 0, last: '' }); u.n++; if (r.date > u.last) u.last = r.date; });
  const segments = { 'Loyal (4 or more orders)': 0, 'Regular (2 to 3 orders)': 0, 'New (1 order)': 0, 'Lapsed (no order in 30+ days)': 0 };
  const cutoff = addDays(todayStr(), -30);
  Object.values(byUser).forEach(u => {
    if (u.last < cutoff) segments['Lapsed (no order in 30+ days)']++;
    else if (u.n >= 4) segments['Loyal (4 or more orders)']++;
    else if (u.n >= 2) segments['Regular (2 to 3 orders)']++;
    else segments['New (1 order)']++;
  });
  const total = Object.keys(byUser).length;
  return { segments, total, repeatRate: total ? Object.values(byUser).filter(u => u.n >= 2).length / total * 100 : 0 };
}
function ratingByItem() {
  const recs = getRecords(), map = {};
  getReviews().filter(r => r.status === 'Approved').forEach(rv => {
    const rec = recs.find(x => x.id === rv.recordId);
    if (rec) new Set(rec.items.map(i => i.name)).forEach(n => (map[n] || (map[n] = [])).push(rv.rating));
  });
  return Object.entries(map).map(([name, arr]) => ({ name, avg: mean(arr), n: arr.length })).sort((a, b) => b.avg - a.avg);
}
/** Items often bought with the items in the cart (used for "Customers also add"). */
function suggestFor(cartIds) {
  const counts = {};
  activeRecords(allRecords(true)).forEach(r => {
    const ids = r.items.map(i => i.id);
    if (!ids.some(id => cartIds.includes(id))) return;
    ids.forEach(id => { if (!cartIds.includes(id)) counts[id] = (counts[id] || 0) + 1; });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([id]) => itemById(id)).filter(i => i && i.available && !i.soon && i.cat !== 'Whole Lechon');
}
/** Peak period (month-day ranges set in Settings) for a date. */
function seasonFor(date, settings) {
  const md = date.slice(5);
  let best = { boost: 1, name: '' };
  (settings.seasonal || []).forEach(s => {
    const inRange = s.from <= s.to ? md >= s.from && md <= s.to : md >= s.from || md <= s.to;
    const boost = Number(s.boost) || 1;
    if (inRange && boost > best.boost) best = { boost, name: s.name };
  });
  return best;
}

/* ----- Charts (plain canvas, no library) ----- */
function chartColors() {
  const cs = getComputedStyle(document.documentElement);
  const get = n => cs.getPropertyValue(n).trim();
  return { red: get('--red'), brown: get('--brown'), gold: get('--gold'), text: get('--charcoal'), grid: '#d9c9bd' };
}
function prepCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(300, canvas.parentElement.clientWidth - 16);
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}
function niceMax(v) {
  if (v <= 5) return 5;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}
const tick = v => (v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : String(Math.round(v * 10) / 10));
function drawAxes(ctx, area, max, c) {
  ctx.strokeStyle = c.grid; ctx.fillStyle = c.text; ctx.lineWidth = 1;
  ctx.font = '12px "Open Sans", Arial'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const y = area.bottom - (area.bottom - area.top) * i / 4;
    ctx.beginPath(); ctx.moveTo(area.left, y); ctx.lineTo(area.right, y); ctx.stroke();
    ctx.fillText(tick(max * i / 4), area.left - 6, y);
  }
}
function drawBarChart(canvas, labels, values) {
  const c = chartColors();
  const { ctx, width, height } = prepCanvas(canvas, 240);
  const area = { left: 46, right: width - 10, top: 12, bottom: height - 34 };
  const max = niceMax(Math.max(...values, 1));
  drawAxes(ctx, area, max, c);
  const slot = (area.right - area.left) / labels.length;
  const bw = Math.min(40, slot * 0.6);
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = '11px "Open Sans", Arial';
  values.forEach((v, i) => {
    const bh = (area.bottom - area.top) * v / max;
    ctx.fillStyle = c.red;
    ctx.fillRect(area.left + slot * i + (slot - bw) / 2, area.bottom - bh, bw, bh);
    ctx.fillStyle = c.text;
    if (labels.length <= 12 || i % 2 === 0) ctx.fillText(labels[i], area.left + slot * i + slot / 2, area.bottom + 6);
  });
}
/** Forecast line with a low-to-high band, reserved lechon as bars and the daily limit as a dashed line. */
function drawForecastChart(canvas, rows, limit) {
  const c = chartColors();
  const { ctx, width, height } = prepCanvas(canvas, 290);
  const area = { left: 40, right: width - 10, top: 30, bottom: height - 34 };
  const max = niceMax(Math.max(limit, ...rows.map(r => Math.max(r.high, r.reserved)), 1) * 1.1);
  drawAxes(ctx, area, max, c);
  const slot = (area.right - area.left) / rows.length;
  const xAt = i => area.left + slot * i + slot / 2;
  const yAt = v => area.bottom - (area.bottom - area.top) * v / max;
  ctx.fillStyle = c.brown;
  rows.forEach((r, i) => { const bw = Math.min(24, slot * 0.5); ctx.fillRect(xAt(i) - bw / 2, yAt(r.reserved), bw, area.bottom - yAt(r.reserved)); });
  ctx.fillStyle = 'rgba(233,162,59,0.5)';
  ctx.beginPath();
  rows.forEach((r, i) => (i ? ctx.lineTo(xAt(i), yAt(r.high)) : ctx.moveTo(xAt(i), yAt(r.high))));
  for (let i = rows.length - 1; i >= 0; i--) ctx.lineTo(xAt(i), yAt(rows[i].low));
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = c.red; ctx.lineWidth = 2.5; ctx.beginPath();
  rows.forEach((r, i) => (i ? ctx.lineTo(xAt(i), yAt(r.mid)) : ctx.moveTo(xAt(i), yAt(r.mid))));
  ctx.stroke();
  ctx.fillStyle = c.red;
  rows.forEach((r, i) => { ctx.beginPath(); ctx.arc(xAt(i), yAt(r.mid), 3.5, 0, Math.PI * 2); ctx.fill(); });
  ctx.setLineDash([6, 4]); ctx.strokeStyle = c.text; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(area.left, yAt(limit)); ctx.lineTo(area.right, yAt(limit)); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = c.text; ctx.font = '11px "Open Sans", Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  rows.forEach((r, i) => { if (rows.length <= 8 || i % 2 === 0) ctx.fillText(shortDate(r.date), xAt(i), area.bottom + 6); });
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '12px "Open Sans", Arial';
  ctx.fillText('Red line: forecast · Gold band: likely range · Brown bars: already reserved · Dashed: daily limit', area.left, 12);
}

/* ----- Admin: Reports ----- */
function sampleToggle(onChange) {
  return h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: true, onChange: e => onChange(e.target.checked) }),
    'Include sample data (stands in for the manual sales log, so the demo has something to show)');
}
function adminReports(panel) {
  const state = { sample: true };
  const wrap = h('div');
  panel.append(h('h2', {}, 'Reports'), sampleToggle(v => { state.sample = v; draw(); }),
    h('button', { type: 'button', class: 'btn btn-outline btn-sm', onClick: exportCsv }, 'Export my orders to CSV'), wrap);
  function draw() {
    const recs = activeRecords(allRecords(state.sample));
    const total = recs.reduce((s, r) => s + r.total, 0);
    const best = Object.entries(itemSales(recs)).sort((a, b) => b[1].qty - a[1].qty).slice(0, 8);
    const days = Array.from({ length: 14 }, (_, i) => addDays(todayStr(), i - 13));
    const perDay = days.map(d => recs.filter(r => r.date === d).reduce((s, r) => s + r.total, 0));
    const pay = {};
    recs.forEach(r => { pay[r.payMethod] = (pay[r.payMethod] || 0) + 1; });
    const status = {};
    getRecords().forEach(r => { status[r.status] = (status[r.status] || 0) + 1; });
    wrap.replaceChildren(
      h('div', { class: 'stat-grid' }, statCard(String(recs.length), 'Orders, reservations and events'), statCard(peso(total), 'Total sales'), statCard(peso(recs.length ? total / recs.length : 0), 'Average per record')),
      h('h2', {}, 'Sales per day, last 14 days (₱)'));
    addChart(wrap, 'Bar chart of sales per day for the last 14 days', canvas => drawBarChart(canvas, days.map(shortDate), perDay));
    wrap.append(h('div', { class: 'two-up' },
      h('div', {}, h('h2', {}, 'Best sellers'), dataTable(['Item', 'Sold', 'Sales'], best.map(([n, v]) => [n, String(v.qty), peso(v.sales)]), 'Best sellers')),
      h('div', {}, h('h2', {}, 'Payment methods'), dataTable(['Method', 'Records'], Object.entries(pay).map(([k, v]) => [k, String(v)]), 'Payment methods'),
        h('h2', {}, 'Your store records by status'), dataTable(['Status', 'Records'], Object.entries(status).map(([k, v]) => [statusBadge(k), String(v)]), 'Status counts'))));
  }
  function exportCsv() {
    const rows = [['ID', 'Type', 'Customer', 'Items', 'Pickup date', 'Pickup time', 'Total', 'Paid', 'Payment method', 'Payment status', 'Status', 'Created']];
    getRecords().forEach(r => rows.push([r.id, KIND_LABEL[r.kind], r.userName, summarizeItems(r), r.date, r.time, r.total, r.amountPaid || 0, r.payMethod, r.payStatus, r.status, r.created]));
    download('lechon-de-jay-orders.csv', rows.map(r => r.map(csvCell).join(',')).join('\r\n'), 'text/csv');
  }
  draw();
}

/* ----- Admin: Forecast and preference analysis ----- */
function adminForecast(panel) {
  const settings = getSettings();
  const state = { sample: true };
  const wrap = h('div');
  panel.append(h('h2', {}, 'Demand forecast for whole lechon'), sampleToggle(v => { state.sample = v; draw(); }), wrap);
  function draw() {
    const recs = allRecords(state.sample);
    const fc = buildForecast(recs, 14, settings);
    const mape = forecastAccuracy(recs);
    wrap.replaceChildren();
    if (!fc) { wrap.append(h('p', { class: 'empty' }, 'Not enough order history yet. Turn on sample data, or wait until the store has a few weeks of orders.')); }
    else {
      const next7 = fc.rows.slice(0, 7).reduce((s, r) => s + r.mid, 0);
      const peak = fc.rows.slice().sort((a, b) => b.mid - a.mid)[0];
      wrap.append(h('div', { class: 'stat-grid' },
        statCard(next7.toFixed(1), 'Whole lechon expected in the next 7 days'),
        statCard(`${peak.mid.toFixed(1)} on ${shortDate(peak.date)}`, 'Busiest day in the next 14 days'),
        statCard(mape === null ? 'Not enough data' : mape.toFixed(0) + '%', 'Average forecast error (last 14 days)')));
      addChart(wrap, 'Chart of the lechon forecast for the next 14 days with likely range, reserved lechon and the daily limit', canvas => drawForecastChart(canvas, fc.rows, settings.dailyLimit));
      wrap.append(dataTable(['Date', 'Forecast', 'Likely range', 'Reserved', ...fc.sizeNames.map(n => n.replace('Lechon Baboy: ', '')), 'Note'], fc.rows.map(r => [
        `${WEEKDAYS[parseDate(r.date).getDay()]} ${shortDate(r.date)}`, r.mid.toFixed(1), `${r.low.toFixed(1)} to ${r.high.toFixed(1)}`, String(r.reserved),
        ...fc.sizeNames.map(n => r.sizes[n].toFixed(1)), r.note + (r.season ? ` · ${r.season}` : '')
      ]), 'Forecast table'),
      h('p', { class: 'note' }, `Method: for each coming day, the average whole lechon sold on the same weekday in the past, multiplied by the peak-period multiplier from Settings. The likely range is one standard deviation either side. "Near limit" means the high end passes the daily limit of ${settings.dailyLimit}. This is a guide for planning, not an exact prediction. With about six months of real data the team can test a regression or smoothing model.`));
    }
    insights(wrap, recs);
  }
  draw();
}

function insights(wrap, recs) {
  const live = activeRecords(recs);
  const sales = itemSales(live);
  const menuItems = getMenu().filter(i => i.available && !i.soon);
  const slow = menuItems.map(i => [i.name, (sales[i.name] || { qty: 0 }).qty]).sort((a, b) => a[1] - b[1]).slice(0, 5);
  const best = Object.entries(sales).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
  const weekday = [0, 0, 0, 0, 0, 0, 0];
  live.forEach(r => { weekday[parseDate(r.date).getDay()]++; });
  const hourLabels = Array.from({ length: 12 }, (_, i) => String(10 + i)), hourCounts = new Array(12).fill(0);
  live.filter(r => r.kind === 'order').forEach(r => { const idx = parseInt(r.time, 10) - 10; if (idx >= 0 && idx < 12) hourCounts[idx]++; });
  const pairs = Object.entries(pairCounts(live)).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const seg = customerSegments(live);
  const ratings = ratingByItem();
  wrap.append(h('h2', {}, 'Customer preference analysis'),
    h('p', { class: 'note' }, 'Built from order data. Only counts are shown, never personal details.'),
    h('div', { class: 'two-up' },
      h('div', {}, h('h3', {}, 'Best sellers'), dataTable(['Item', 'Sold'], best.map(([n, v]) => [n, String(v.qty)]), 'Best sellers')),
      h('div', {}, h('h3', {}, 'Slow movers (current menu)'), dataTable(['Item', 'Sold'], slow.map(([n, q]) => [n, String(q)]), 'Slow movers'))),
    h('h3', {}, 'Busiest days of the week (number of records)'));
  addChart(wrap, 'Bar chart of records per day of the week', canvas => drawBarChart(canvas, WEEKDAYS, weekday));
  wrap.append(h('h3', {}, 'Busiest hours for orders (24-hour clock)'));
  addChart(wrap, 'Bar chart of orders by hour of the day', canvas => drawBarChart(canvas, hourLabels, hourCounts));
  wrap.append(h('div', { class: 'two-up' },
    h('div', {}, h('h3', {}, 'Often bought together'), dataTable(['Items', 'Times'], pairs.map(([k, v]) => [k, String(v)]), 'Items bought together'),
      h('p', { class: 'note' }, 'These pairs power the "Customers also add" suggestions in the cart.')),
    h('div', {}, h('h3', {}, 'Customer groups'),
      h('div', { class: 'stat-grid' }, statCard(seg.repeatRate.toFixed(0) + '%', 'Repeat customers'), statCard(String(seg.total), 'Customers counted')),
      dataTable(['Group', 'Customers'], Object.entries(seg.segments).map(([k, v]) => [k, String(v)]), 'Customer groups'))),
    h('h3', {}, 'Average rating per item (real reviews only)'),
    ratings.length ? dataTable(['Item', 'Average', 'Reviews'], ratings.map(r => [r.name, r.avg.toFixed(1) + ' / 5', String(r.n)]), 'Ratings per item') : h('p', { class: 'empty' }, 'No approved reviews yet.'));
}

/* ===== 12. START ===== */
const PAGE_INIT = {
  home: initHome, menu: initMenu, gallery: initGallery, contact: initContact, register: initRegister, login: initLogin,
  profile: initProfile, cart: initCart, reserve: initReserve, event: initEvent, orders: initOrders, admin: initAdmin
};
document.addEventListener('DOMContentLoaded', async () => {
  await seedData();
  buildHeader();
  buildFooter();
  const init = PAGE_INIT[document.body.dataset.page];
  if (init) init();
});
