import { cloud } from './supabase-client.js';

const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const nowTime = () => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date());

const defaultProducts = [
  { id: 1, name: 'Caramel', category: 'Variant Diet Coffee', price: 10000, image: 'assets/menu/soft.png', badge: 'TERLARIS', sold: 0 },
  { id: 2, name: 'Hazelnut', category: 'Variant Diet Coffee', price: 10000, image: 'assets/menu/strong.png', badge: 'FAVORIT', sold: 0 },
  { id: 3, name: 'Cold Brew', category: 'Variant Diet Coffee', price: 10000, image: 'assets/menu/montblanc.png', sold: 0 },
  { id: 4, name: 'Montblanc', category: 'Variant Diet Coffee', price: 15000, image: 'assets/menu/montblanc.png', badge: 'SIGNATURE', sold: 0 },
  { id: 5, name: 'Original Soft', category: 'Classic Diet Coffee', price: 8000, image: 'assets/menu/soft.png', sold: 0 },
  { id: 6, name: 'Original Strong', category: 'Classic Diet Coffee', price: 8000, image: 'assets/menu/strong.png', sold: 0 },
  { id: 7, name: 'Blue Cloud Matcha', category: 'Non-Coffee', price: 15000, image: 'assets/menu/bluecloud.png', badge: 'BARU', sold: 0 },
  { id: 8, name: 'Matcha', category: 'Non-Coffee', price: 15000, image: 'assets/menu/matcha.png', sold: 0 },
  { id: 9, name: 'Swiss Chocolate', category: 'Non-Coffee', price: 15000, image: 'assets/menu/chocolate.png', sold: 0 },
  { id: 10, name: 'Sorgteam Vest', category: 'Toserba', price: 250000, image: 'assets/products/vest.png', type: 'retail', sold: 0 },
  { id: 11, name: 'Meal Replacement', category: 'Toserba', price: 150000, image: 'assets/products/sorgmeal.png', type: 'retail', sold: 0 },
  { id: 12, name: 'Sorgtime Tumbler', category: 'Toserba', price: 230000, image: 'assets/products/tumbler.png', type: 'retail', soldOut: true, sold: 0 }
];

const defaultAddOns = [
  { id: 'oat-milk', name: 'Oat milk', price: 6000 },
  { id: 'extra-shot', name: 'Extra shot', price: 5000 },
  { id: 'less-ice', name: 'Less ice', price: 0 }
];

const ingredients = [
  { id: 1, name: 'Cold brew concentrate', sku: 'BB-CBR-01', category: 'Kopi', icon: '●', stock: 6.8, unit: 'L', min: 3, max: 10 },
  { id: 2, name: 'Susu rendah lemak', sku: 'BB-SUS-01', category: 'Dairy', icon: '▱', stock: 7.2, unit: 'L', min: 5, max: 15 },
  { id: 3, name: 'Gula sorgum cair', sku: 'BB-SOR-01', category: 'Pemanis', icon: '◆', stock: 2.1, unit: 'L', min: 2.5, max: 8 },
  { id: 4, name: 'Creamer', sku: 'BB-CRM-01', category: 'Dairy', icon: '◇', stock: 1.4, unit: 'L', min: 2, max: 8 },
  { id: 5, name: 'Matcha powder', sku: 'BB-MTC-01', category: 'Bubuk', icon: '✦', stock: 0.82, unit: 'kg', min: 0.5, max: 2 },
  { id: 6, name: 'Cup dingin 16 oz', sku: 'PK-CUP-16', category: 'Kemasan', icon: '▯', stock: 186, unit: 'pcs', min: 100, max: 400 },
  { id: 7, name: 'Tutup cup 16 oz', sku: 'PK-LID-16', category: 'Kemasan', icon: '═', stock: 174, unit: 'pcs', min: 100, max: 400 },
  { id: 8, name: 'Saus karamel', sku: 'BB-SIR-05', category: 'Sirup', icon: '◆', stock: 3.6, unit: 'L', min: 1.5, max: 6 }
];

const hppIngredientCatalog = [
  { key: 'kopi', aliases: [], name: 'Kopi', sku: 'BB-KOP-01', category: 'Kopi', icon: '●', unit: 'kg', stock: 0, min: .5, max: 5 },
  { key: 'bubuk-creamer', aliases: [], name: 'Bubuk Creamer', sku: 'BB-CRM-00', category: 'Bubuk', icon: '◇', unit: 'kg', stock: 0, min: .5, max: 5 },
  { key: 'cold-brew', aliases: ['Cold brew concentrate'], name: 'Cold Brew', sku: 'BB-CBR-01', category: 'Kopi olahan', icon: '●', unit: 'L', stock: 6.8, min: 3, max: 10 },
  { key: 'creamer-cair', aliases: ['Creamer'], name: 'Creamer Cair', sku: 'BB-CRM-01', category: 'Dairy', icon: '◇', unit: 'L', stock: 1.4, min: 2, max: 8 },
  { key: 'susu-grandairy', aliases: ['Susu rendah lemak'], name: 'Susu (Grandairy)', sku: 'BB-SUS-01', category: 'Dairy', icon: '▱', unit: 'L', stock: 7.2, min: 5, max: 15 },
  { key: 'gula-sorgum', aliases: ['Gula sorgum cair'], name: 'Gula Sorgum', sku: 'BB-SOR-01', category: 'Pemanis', icon: '◆', unit: 'L', stock: 2.1, min: 2.5, max: 8 },
  { key: 'syrup-caramel', aliases: ['Saus karamel'], name: 'Syrup Caramel (Rasbell)', sku: 'BB-SIR-05', category: 'Sirup', icon: '◆', unit: 'L', stock: 3.6, min: 1.5, max: 6 },
  { key: 'syrup-tiramisu', aliases: [], name: 'Syrup Tiramisu', sku: 'BB-SIR-06', category: 'Sirup', icon: '◆', unit: 'L', stock: 0, min: 1.5, max: 6 },
  { key: 'syrup-hazelnut', aliases: [], name: 'Syrup Hazelnut (Rasbell)', sku: 'BB-SIR-07', category: 'Sirup', icon: '◆', unit: 'L', stock: 0, min: 1.5, max: 6 },
  { key: 'matcha', aliases: ['Matcha powder'], name: 'Matcha', sku: 'BB-MTC-01', category: 'Bubuk', icon: '✦', unit: 'kg', stock: .82, min: .5, max: 2 },
  { key: 'air', aliases: [], name: 'Air', sku: 'BB-AIR-01', category: 'Bahan cair', icon: '○', unit: 'L', stock: 0, min: 5, max: 25 },
  { key: 'kemasan', aliases: ['Cup dingin 16 oz'], name: 'Kemasan', sku: 'PK-CUP-16', category: 'Kemasan', icon: '▯', unit: 'pcs', stock: 186, min: 100, max: 400 }
];

const hppWorkbookRecipes = [
  { name: 'Original Soft', sellingPrice: 8000, components: [
    ['cold-brew', 'Cold Brew', 90, 'ml', 12807.8349473684, 2000], ['creamer-cair', 'Creamer Cair', 30, 'ml', 18071.052631578947, 700], ['susu-grandairy', 'Susu (Grandairy)', 30, 'ml', 154000, 12000], ['gula-sorgum', 'Gula Sorgum', 20, 'ml', 50000, 1000], [null, 'Pekerja', 1, 'person', 1000, 1], ['kemasan', 'Kemasan', 1, 'cup', 1150, 1], [null, 'Es batu', 1, 'porsi', 93, 1]
  ]},
  { name: 'Original Strong', sellingPrice: 8000, components: [
    ['cold-brew', 'Cold Brew', 100, 'ml', 12807.8349473684, 2000], ['creamer-cair', 'Creamer Cair', 30, 'ml', 18071.052631578947, 700], ['susu-grandairy', 'Susu (Grandairy)', 30, 'ml', 154000, 12000], ['gula-sorgum', 'Gula Sorgum', 10, 'ml', 50000, 1000], [null, 'Pekerja', 1, 'person', 1000, 1], ['kemasan', 'Kemasan', 1, 'cup', 1150, 1], [null, 'Es batu', 1, 'porsi', 93, 1]
  ]},
  { name: 'Caramel', sellingPrice: 10000, components: [
    ['cold-brew', 'Cold Brew', 90, 'ml', 12807.8349473684, 2000], ['creamer-cair', 'Creamer Cair', 25, 'ml', 18071.052631578947, 700], ['susu-grandairy', 'Susu (Grandairy)', 25, 'ml', 154000, 12000], ['syrup-caramel', 'Syrup Caramel (Rasbell)', 20, 'ml', 50000, 750], ['gula-sorgum', 'Gula Sorgum', 10, 'ml', 1000, 1000], [null, 'Pekerja', 1, 'person', 1000, 1], ['kemasan', 'Kemasan', 1, 'cup', 1150, 1], [null, 'Es batu', 1, 'porsi', 93, 1]
  ]},
  { name: 'Tiramisu', sellingPrice: 10000, components: [
    ['cold-brew', 'Cold Brew', 100, 'ml', 12807.8349473684, 2000], ['creamer-cair', 'Creamer Cair', 25, 'ml', 18071.052631578947, 700], ['susu-grandairy', 'Susu (Grandairy)', 25, 'ml', 154000, 12000], ['syrup-tiramisu', 'Syrup Tiramisu', 20, 'ml', 50000, 650], ['gula-sorgum', 'Gula Sorgum', 10, 'ml', 1000, 1000], [null, 'Pekerja', 1, 'person', 1000, 1], ['kemasan', 'Kemasan', 1, 'cup', 1150, 1], [null, 'Es batu', 1, 'porsi', 93, 1]
  ]},
  { name: 'Hazelnut', sellingPrice: 10000, components: [
    ['cold-brew', 'Cold Brew', 100, 'ml', 12807.8349473684, 2000], ['creamer-cair', 'Creamer Cair', 25, 'ml', 18071.052631578947, 700], ['susu-grandairy', 'Susu (Grandairy)', 25, 'ml', 154000, 12000], ['syrup-hazelnut', 'Syrup Hazelnut (Rasbell)', 20, 'ml', 50000, 750], ['gula-sorgum', 'Gula Sorgum', 10, 'ml', 1000, 1000], [null, 'Pekerja', 1, 'person', 1000, 1], ['kemasan', 'Kemasan', 1, 'cup', 1150, 1], [null, 'Es batu', 1, 'porsi', 93, 1]
  ]},
  { name: 'Matcha', sellingPrice: 15000, components: [
    ['matcha', 'Matcha', 20, 'gram', 90000, 1000], ['air', 'Air', 30, 'ml', 6000, 1900], ['susu-grandairy', 'Susu (Grandairy)', 75, 'ml', 154000, 12000], ['creamer-cair', 'Creamer Cair', 75, 'ml', 18071.052631578947, 700], ['gula-sorgum', 'Gula Sorgum', 10, 'ml', 50000, 1000], [null, 'Pekerja', 1, 'person', 1000, 1], ['kemasan', 'Kemasan', 1, 'cup', 1150, 1], [null, 'Es batu', 1, 'porsi', 93, 1]
  ]}
];

const customers = [];

localStorage.removeItem('sorgtimePosStateV2');
localStorage.removeItem('ruangSeduhState');
const LOCAL_STATE_KEY = 'sorgtimePosStateV3';
const LOCAL_DIRTY_KEY = 'sorgtimePosStateDirtyV1';
const localSaved = JSON.parse(localStorage.getItem(LOCAL_STATE_KEY) || 'null');
// Tanda bahwa snapshot lokal belum berhasil diunggah ke Supabase. Selama
// dirty, state lokal dipakai saat boot agar perubahan (mis. stok) tidak
// tertimpa snapshot remote yang lebih lama.
let localDirty = Boolean(localSaved) && cloud.enabled && localStorage.getItem(LOCAL_DIRTY_KEY) === '1';
if (cloud.enabled) {
  const gate = document.getElementById('auth-content');
  if (gate && !gate.innerHTML.trim()) gate.innerHTML = '<div class="auth-form-wrap"><span class="auth-step">MENYAMBUNGKAN</span><h2>Memuat data outlet</h2><p>Mengambil data terbaru dari Supabase...</p></div>';
}
const authFlag = localStorage.getItem('sorgtimeAuthBackendV1') === '1';
const canProbeAuth = cloud.enabled && (navigator.onLine !== false || authFlag);
const authProbe = canProbeAuth ? await cloud.hasAnyUser() : { ok: authFlag, exists: authFlag };
const authBackendReady = Boolean(cloud.enabled && authProbe.ok);
const legacyMode = !authBackendReady;
if (authBackendReady) localStorage.setItem('sorgtimeAuthBackendV1', '1');
let cloudHasUsers = authBackendReady ? authProbe.exists : false;
const bootSession = authBackendReady ? await cloud.getSession() : null;
let cloudResult = { ok: false, enabled: cloud.enabled, state: null, users: null };
if (!authBackendReady) cloudResult = await cloud.loadLegacy();
else if (bootSession) cloudResult = await cloud.load();
const remoteState = cloudResult.state && Object.keys(cloudResult.state).length ? cloudResult.state : null;
const remoteUsers = Array.isArray(cloudResult.users) && cloudResult.users.length ? cloudResult.users : null;
const bootProfiles = (authBackendReady && bootSession) ? await cloud.loadProfiles() : { ok: false, users: [] };
let cachedProfiles = [];
try { const storedProfiles = JSON.parse(localStorage.getItem('sorgtimeAuthUsersV1') || '[]'); cachedProfiles = Array.isArray(storedProfiles) ? storedProfiles : []; } catch (error) { cachedProfiles = []; }
const saved = (localDirty && localSaved ? localSaved : null) || remoteState || localSaved;
const state = {
  cart: [], orders: [], selectedCustomer: null, promo: null,
  inventory: ingredients, customers, networkOnline: true, qrisImage: null, orderNo: 1,
  salesCount: 0, revenue: 0, cashSales: 0, qrisSales: 0,
  ...(saved || {})
};
state.inventory ||= ingredients;
state.orders ||= [];
state.cart ||= [];
state.products ||= defaultProducts.map(product => ({ ...product, price: Number(state.menuPrices?.[product.id] ?? product.price) }));
state.addOns ||= defaultAddOns.map(addOn => ({ ...addOn, price: Number(state.addOnPrices?.[addOn.id] ?? addOn.price) }));
delete state.menuPrices;
delete state.addOnPrices;
state.promotions ||= [];
state.inventoryMovements ||= [];
if (state.promo && !state.promotions.some(item => item.id === state.promo)) state.promo = null;
const products = state.products;
const addOns = state.addOns;

if (!state.hppVersion) {
  if (!products.some(product => product.name.toLowerCase() === 'tiramisu')) products.push({ id: 'hpp-tiramisu', name: 'Tiramisu', category: 'Variant Diet Coffee', price: 29000, image: 'assets/menu/soft.png', badge: 'HPP', sold: 0 });
  const ingredientIds = {};
  hppIngredientCatalog.forEach(source => {
    let item = state.inventory.find(existing => existing.sku === source.sku || source.aliases.some(alias => existing.name.toLowerCase() === alias.toLowerCase()) || existing.name.toLowerCase() === source.name.toLowerCase());
    if (!item) { item = { id: crypto.randomUUID(), name: source.name, sku: source.sku, category: source.category, icon: source.icon, stock: source.stock, unit: source.unit, min: source.min, max: source.max }; state.inventory.push(item); }
    else Object.assign(item, { name: source.name, sku: source.sku, category: source.category, icon: source.icon, unit: source.unit });
    item.hppKey = source.key; ingredientIds[source.key] = item.id;
  });
  state.recipes = hppWorkbookRecipes.map(source => {
    const product = products.find(item => item.name.toLowerCase() === source.name.toLowerCase());
    return { id: crypto.randomUUID(), productId: product?.id || null, name: source.name, referenceSellingPrice: source.sellingPrice, source: 'hpp.xlsx', components: source.components.map(([ingredientKey, name, qty, unit, costPrice, packageSize]) => ({ id: crypto.randomUUID(), ingredientId: ingredientKey ? ingredientIds[ingredientKey] : null, name, qty, unit, costPrice, packageSize, trackStock: Boolean(ingredientKey) })) };
  });
  state.hppVersion = 1;
}
if (state.hppVersion < 2) {
  hppIngredientCatalog.filter(source => ['kopi', 'bubuk-creamer'].includes(source.key)).forEach(source => {
    if (state.inventory.some(item => item.hppKey === source.key || item.sku === source.sku)) return;
    state.inventory.push({ id: crypto.randomUUID(), name: source.name, sku: source.sku, category: source.category, icon: source.icon, stock: source.stock, unit: source.unit, min: source.min, max: source.max, hppKey: source.key });
  });
  state.hppVersion = 2;
}
state.recipes ||= [];
state.shifts ||= [];
state.activeShiftId ||= null;
state.payrollSettings = { monthlyBase: 500000, monthlyOffDays: 4, cupBonus: 1000, mode: 'auto', workStart: '09:00', workEnd: '16:00', ...(state.payrollSettings || {}) };
state.attendance ||= [];
state.payrollPayments ||= [];
state.payrollManual ||= [];
state.shiftLocation = { enabled: false, label: '', latitude: null, longitude: null, radius: 50, ...(state.shiftLocation || {}) };
state.recipes.forEach(recipe => recipe.components.forEach(component => { if (!component.costType && /^(pekerja|bonus|tenaga kerja)$/i.test(String(component.name).trim())) component.costType = 'labor-per-cup'; }));
state.orders.forEach((order, index) => {
  order.uid ||= `legacy-${order.created || index}-${order.id}`;
  order.shiftId ||= null;
  order.statusHistory ||= [{ status: 'new', at: order.created, user: order.cashier || 'Sistem' }];
});

let applyingRemote = false;
let syncingRemote = false;
let pendingRemote = null;
let remoteToastShown = false;
let syncReady = false;
let cloudSyncStarted = false;
let lastRemoteAt = cloudResult.updatedAt ? Date.parse(cloudResult.updatedAt) : 0;
let lastSyncedFingerprint = '';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const markLocalDirty = () => { localDirty = true; try { localStorage.setItem(LOCAL_DIRTY_KEY, '1'); } catch (error) { /* penyimpanan penuh */ } };
const clearLocalDirty = () => { localDirty = false; try { localStorage.removeItem(LOCAL_DIRTY_KEY); } catch (error) { /* abaikan */ } };
const writeLocalState = () => { try { localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state)); } catch (error) { console.warn('Gagal menyimpan state lokal:', error); } };
const save = () => {
  writeLocalState();
  if (syncReady && !applyingRemote) {
    if (stateFingerprint() !== lastSyncedFingerprint) markLocalDirty();
    cloud.save(state, syncUsers());
  }
};
const nextOrderId = () => `A-${String(state.orderNo).padStart(3, '0')}`;
const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const orderRef = order => order.uid || order.id;
const activeShift = () => state.shifts.find(shift => shift.id === state.activeShiftId && !shift.endedAt) || null;
const isShiftActive = () => Boolean(activeShift());

const USERS_KEY = 'sorgtimeAuthUsersV1';
const SESSION_KEY = 'sorgtimeAuthSessionV1';
const ROLE_LABELS = { sysadmin: 'Sysadmin', admin: 'Admin', barista: 'Barista' };
const ROLE_DESCRIPTIONS = {
  sysadmin: 'Akses penuh, pengaturan sistem, dan seluruh akun.',
  admin: 'Kasir, operasional, laporan, dan akun barista.',
  barista: 'Membuat pesanan, menerima pembayaran, dan mengelola antrean produksi.'
};
const ROLE_PERMISSIONS = {
  sysadmin: ['pos','kds','inventory','customers','transactions','attendance','reports','payslip','accounts'],
  admin: ['pos','kds','inventory','customers','transactions','attendance','reports','payslip','accounts'],
  barista: ['pos','kds','attendance','payslip']
};
let authUsers = authBackendReady
  ? (bootProfiles.ok ? bootProfiles.users : cachedProfiles)
  : (remoteUsers || cachedProfiles);
if (authBackendReady) authUsers = authUsers.map(({ id, name, username, role, status, createdAt }) => ({ id, name, username, role, status, createdAt }));
let currentUser = null;

const syncUsers = () => (legacyMode ? authUsers : null);
const stateFingerprint = () => cloud.fingerprint(state, syncUsers());
const cacheProfiles = () => {
  const payload = legacyMode
    ? authUsers
    : authUsers.map(({ id, name, username, role, status, createdAt }) => ({ id, name, username, role, status, createdAt }));
  localStorage.setItem(USERS_KEY, JSON.stringify(payload));
};
const saveUsers = () => {
  cacheProfiles();
  if (syncReady) {
    if (stateFingerprint() !== lastSyncedFingerprint) markLocalDirty();
    cloud.save(state, syncUsers());
  }
};
if (authBackendReady) { cacheProfiles(); sessionStorage.removeItem('sorgtimeAuthSessionV1'); }
const randomSalt = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 120000, hash: 'SHA-256' }, key, 256);
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
}
const canAccess = view => Boolean(currentUser && ROLE_PERMISSIONS[currentUser.role]?.includes(view));

function authRoleCards() {
  return Object.entries(ROLE_LABELS).map(([role, label]) => `<div class="auth-role"><span>${label}</span><small>${ROLE_DESCRIPTIONS[role]}</small></div>`).join('');
}

function renderAuthGate(message = '') {
  document.body.classList.add('auth-locked');
  $('#auth-gate').hidden = false;
  const hasAccounts = authBackendReady ? cloudHasUsers : authUsers.length;
  const securityNote = authBackendReady
    ? 'Login diamankan oleh Supabase Auth.'
    : 'Mode lokal aktif. Jalankan migrasi 202401010009 untuk mengaktifkan login Supabase.';
  if (!hasAccounts) {
    $('#auth-content').innerHTML = `<div class="auth-form-wrap"><span class="auth-step">SETUP PERTAMA</span><h2>Buat akun pemilik</h2><p>Akun pertama otomatis menjadi sysadmin dan dapat membuat akun lain.</p>${message ? `<div class="auth-message">${escapeHTML(message)}</div>` : ''}<form class="auth-form" id="setup-form"><label>Nama lengkap<input name="name" required autocomplete="name" placeholder="Nama pemilik"></label><label>Username<input name="username" required autocomplete="username" minlength="3" placeholder="Contoh: owner"></label><label>Password<input name="password" required type="password" autocomplete="new-password" minlength="6" placeholder="Minimal 6 karakter"></label><label>Ulangi password<input name="confirm" required type="password" autocomplete="new-password" minlength="6" placeholder="Ketik sekali lagi"></label><button type="submit">Buat sysadmin →</button></form><div class="auth-security">${securityNote}</div></div>`;
    $('#setup-form').addEventListener('submit', authBackendReady ? handleFirstSetupCloud : handleFirstSetup);
    return;
  }
  $('#auth-content').innerHTML = `<div class="auth-form-wrap"><span class="auth-step">AKSES OUTLET</span><h2>Masuk ke POS</h2><p>Gunakan akun yang sudah diberikan oleh pengelola outlet.</p>${message ? `<div class="auth-message">${escapeHTML(message)}</div>` : ''}<form class="auth-form" id="login-form"><label>Username<input name="username" required autocomplete="username" autofocus placeholder="Masukkan username"></label><label>Password<input name="password" required type="password" autocomplete="current-password" placeholder="Masukkan password"></label><button type="submit">Masuk →</button></form><div class="auth-roles">${authRoleCards()}</div><div class="auth-security">${securityNote}</div></div>`;
  $('#login-form').addEventListener('submit', authBackendReady ? handleLoginCloud : handleLogin);
}

async function handleFirstSetup(event) {
  event.preventDefault();
  const form = event.currentTarget; const data = new FormData(form);
  const name = data.get('name').trim(); const username = data.get('username').trim().toLowerCase(); const password = data.get('password');
  if (password !== data.get('confirm')) return renderAuthGate('Konfirmasi password tidak sama.');
  if (!/^[a-z0-9._-]{3,24}$/.test(username)) return renderAuthGate('Username hanya boleh berisi huruf kecil, angka, titik, garis bawah, atau tanda minus.');
  const salt = randomSalt(); const passwordHash = await hashPassword(password, salt);
  authUsers = [{ id: crypto.randomUUID(), name, username, role: 'sysadmin', status: 'active', salt, passwordHash, createdAt: Date.now() }];
  saveUsers();
  if (cloud.enabled) { cloud.save(state, authUsers); lastSyncedFingerprint = stateFingerprint(); }
  renderAuthGate('Akun sysadmin berhasil dibuat. Silakan masuk.');
}

async function handleLogin(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget); const username = data.get('username').trim().toLowerCase(); const password = data.get('password');
  const user = authUsers.find(item => item.username === username);
  if (!user) return renderAuthGate('Username atau password tidak sesuai.');
  if (user.status !== 'active') return renderAuthGate('Akun ini sedang dinonaktifkan. Hubungi sysadmin.');
  const inputHash = await hashPassword(password, user.salt);
  if (inputHash !== user.passwordHash) return renderAuthGate('Username atau password tidak sesuai.');
  sessionStorage.setItem(SESSION_KEY, user.id); unlockApp(user);
}

async function handleFirstSetupCloud(event) {
  event.preventDefault();
  const form = event.currentTarget; const data = new FormData(form);
  const name = data.get('name').trim(); const username = data.get('username').trim().toLowerCase(); const password = data.get('password');
  if (password !== data.get('confirm')) return renderAuthGate('Konfirmasi password tidak sama.');
  if (!/^[a-z0-9._-]{3,24}$/.test(username)) return renderAuthGate('Username hanya boleh berisi huruf kecil, angka, titik, garis bawah, atau tanda minus.');
  const result = await cloud.signUp(username, password, name);
  if (!result.ok) return renderAuthGate(result.message);
  const boot = await cloud.bootstrapFirstAdmin(name, username);
  if (!boot.ok) {
    await cloud.signOut();
    return renderAuthGate('Profil admin gagal dibuat. Jika username sudah terpakai, gunakan username lain. Jika migrasi 202401010009 belum dijalankan, jalankan lalu muat ulang aplikasi.');
  }
  cloudHasUsers = true;
  const profiles = await cloud.loadProfiles();
  authUsers = profiles.ok ? profiles.users : [boot.profile].filter(Boolean);
  cacheProfiles();
  const me = authUsers.find(user => user.id === result.user.id) || boot.profile;
  if (!me) { await cloud.signOut(); return renderAuthGate('Profil admin tidak ditemukan.'); }
  await completeCloudLogin(me);
}

async function handleLoginCloud(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const username = data.get('username').trim().toLowerCase(); const password = data.get('password');
  const result = await cloud.signIn(username, password);
  if (!result.ok) return renderAuthGate(result.message);
  const profiles = await cloud.loadProfiles();
  if (profiles.authError) { await cloud.signOut(); return renderAuthGate('Sesi bermasalah. Silakan masuk lagi.'); }
  authUsers = profiles.ok ? profiles.users : cachedProfiles;
  const me = authUsers.find(user => user.id === result.user.id && user.status === 'active');
  if (!me) { await cloud.signOut(); return renderAuthGate('Akun ini belum terdaftar atau sedang dinonaktifkan. Hubungi sysadmin.'); }
  cloudHasUsers = true;
  cacheProfiles();
  await completeCloudLogin(me);
}

async function completeCloudLogin(profile) {
  currentUser = profile;
  const result = await cloud.load();
  if (result.authError) { await cloud.signOut(); currentUser = null; return renderAuthGate('Sesi berakhir. Silakan masuk lagi.'); }
  if (result.ok && result.state) {
    if (localDirty) {
      // Perubahan lokal belum terunggah. Pertahankan state lokal dan kirim
      // ulang, jangan menimpa dengan snapshot remote yang lebih lama.
      cloud.save(state, syncUsers());
    } else {
      hydrateRemoteState(result);
      cloud.markSynced(state, syncUsers());
      lastSyncedFingerprint = stateFingerprint();
      clearLocalDirty();
    }
    lastRemoteAt = result.updatedAt ? Date.parse(result.updatedAt) : 0;
  }
  unlockApp(profile);
  if (result.ok && !result.state) cloud.save(state, syncUsers());
}

function applyPermissions() {
  $$('.nav-item[data-view]').forEach(item => { item.hidden = !canAccess(item.dataset.view); });
  $('#profile-name').textContent = currentUser.name;
  $('#profile-role').textContent = `${ROLE_LABELS[currentUser.role]} · Shift ${isShiftActive() ? 'aktif' : 'tutup'}`;
  $('.profile-card .avatar').textContent = currentUser.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
  $('#shift-button').hidden = !canAccess('pos');
  $('#account-add').hidden = !['sysadmin','admin'].includes(currentUser.role);
  $('#manage-prices').hidden = !['sysadmin','admin'].includes(currentUser.role);
  $('#attendance-manage').hidden = !canManageSales();
  $('#attendance-manage-view').hidden = !canManageSales();
  $('#attendance-location-settings').hidden = !isSysadmin();
  const attendanceNavLabel = $('#attendance-nav-label');
  if (attendanceNavLabel) attendanceNavLabel.textContent = isSysadmin() ? 'Kelola Absen' : 'Absensi';
  $('#payroll-payment').hidden = !isSysadmin();
  $('#payroll-settings').hidden = !isSysadmin();
  $('#shift-location-settings').hidden = !isSysadmin();
}

function unlockApp(user) {
  currentUser = user;
  syncReady = true;
  document.body.classList.remove('auth-locked');
  $('#auth-gate').hidden = true;
  applyPermissions(); renderAll(); switchView(user.role === 'barista' ? 'kds' : 'pos');
  startCloudSync();
}

async function logout() {
  syncReady = false;
  pendingRemote = null;
  if (authBackendReady) await cloud.signOut();
  sessionStorage.removeItem(SESSION_KEY); currentUser = null; closeModal(); renderAuthGate('Anda telah keluar dari aplikasi.');
}

async function initializeAuth() {
  if (authBackendReady) {
    const session = await cloud.getSession();
    if (!session) return renderAuthGate();
    const profiles = await cloud.loadProfiles();
    if (profiles.authError) { await cloud.signOut(); return renderAuthGate('Sesi berakhir. Silakan masuk lagi.'); }
    authUsers = profiles.ok ? profiles.users : cachedProfiles;
    const me = authUsers.find(user => user.id === session.user.id && user.status === 'active');
    if (!me) { await cloud.signOut(); return renderAuthGate('Akun ini belum terdaftar atau dinonaktifkan.'); }
    cloudHasUsers = true;
    cacheProfiles();
    await completeCloudLogin(me);
    return;
  }
  const sessionUserId = sessionStorage.getItem(SESSION_KEY);
  const user = authUsers.find(item => item.id === sessionUserId && item.status === 'active');
  if (user) unlockApp(user); else renderAuthGate();
}

function toast(message, icon = '✓') {
  const item = document.createElement('div');
  item.className = 'toast'; item.innerHTML = `<i>${icon}</i><span>${message}</span>`;
  $('#toast-stack').append(item);
  setTimeout(() => item.remove(), 3200);
}

function openModal(html, wide = false) {
  $('#modal').className = `modal${wide ? ' wide' : ''}`;
  $('#modal').innerHTML = html;
  $('#modal-backdrop').hidden = false;
  setTimeout(() => $('.modal-close')?.focus(), 20);
}
function closeModal() { $('#modal-backdrop').hidden = true; $('#modal').innerHTML = ''; if (pendingRemote && !state.cart.length) maybeApplyRemote(pendingRemote); }

let confirmResolve = null;
function closeConfirm(result) {
  const backdrop = $('#confirm-backdrop');
  if (backdrop) backdrop.hidden = true;
  const resolve = confirmResolve; confirmResolve = null;
  if (resolve) resolve(result);
}
function confirmDialog(message, options = {}) {
  const backdrop = $('#confirm-backdrop');
  if (!backdrop) return Promise.resolve(typeof window.confirm === 'function' ? window.confirm(message) : false);
  if (confirmResolve) { const previous = confirmResolve; confirmResolve = null; previous(false); }
  const { title = 'Konfirmasi', confirmLabel = 'Ya, lanjutkan', cancelLabel = 'Batal', tone = 'danger', icon = '!' } = options;
  $('#confirm-title').textContent = title;
  $('#confirm-message').textContent = message;
  $('#confirm-icon').textContent = icon;
  $('#confirm-cancel').textContent = cancelLabel;
  const ok = $('#confirm-ok');
  ok.textContent = confirmLabel;
  $('#confirm-dialog').classList.toggle('danger', tone === 'danger');
  backdrop.hidden = false;
  setTimeout(() => ok.focus(), 20);
  return new Promise(resolve => { confirmResolve = resolve; });
}

function productVisual(product, compact = false) {
  return `<div class="product-art ${product.type === 'retail' ? 'retail-art' : ''}"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy"></div>`;
}

const canManageSales = () => ['sysadmin', 'admin'].includes(currentUser?.role);
const isSysadmin = () => currentUser?.role === 'sysadmin';
const productPrice = product => Number(product.price);
const addOnPrice = addOn => Number(addOn.price);
const selectedPromotion = () => state.promotions.find(item => item.id === state.promo && item.active);
function itemById(id) { return state.inventory.find(item => String(item.id) === String(id)); }
function isPremixItem(item) { return item?.kind === 'premix'; }
function isPremixableItem(item) {
  const category = String(item?.category || '').toLowerCase();
  return !['kemasan', 'sirup', 'packaging', 'syrup'].includes(category);
}
function inventoryUnitCost(item) {
  if (!item) return 0;
  if (isPremixItem(item)) return premixUnitCost(item);
  const price = Number(item.costPrice) || 0;
  const size = Number(item.packageSize) || 0;
  return size > 0 ? price / size : 0;
}
function premixUnitCost(premix) {
  const yieldQty = Number(premix?.yieldQty) || 0;
  if (yieldQty <= 0) return 0;
  const total = (premix.components || []).reduce((sum, component) => {
    const pure = itemById(component.ingredientId);
    if (!pure || isPremixItem(pure)) return sum;
    return sum + convertQuantity(component.qty, component.unit, pure.unit) * inventoryUnitCost(pure);
  }, 0);
  return total / yieldQty;
}
function recipeComponentCost(component) {
  const item = itemById(component.ingredientId);
  if (item) {
    const qtyInStockUnit = convertQuantity(component.qty, component.unit, item.unit);
    const unitCost = inventoryUnitCost(item);
    if (unitCost > 0) return qtyInStockUnit * unitCost;
  }
  return Number(component.costPrice) / Math.max(Number(component.packageSize), .0001) * Number(component.qty);
}
const recipeHpp = recipe => recipe ? recipe.components.reduce((sum, component) => sum + recipeComponentCost(component), 0) : 0;
const recipeWorkerCost = recipe => recipe ? recipe.components.filter(component => component.costType === 'labor-per-cup' || /^(pekerja|bonus|tenaga kerja)$/i.test(String(component.name).trim())).reduce((sum, component) => sum + (Number(component.costPrice) / Math.max(Number(component.packageSize), .0001) * Number(component.qty)), 0) : 0;
const recipeForProduct = productId => state.recipes.find(recipe => String(recipe.productId) === String(productId));
let migratedWorkerCostSnapshots = false;
state.orders.forEach(order => order.items?.forEach(item => {
  if (item.lineWorkerCost != null) return;
  const unitWorkerCost = recipeWorkerCost(recipeForProduct(item.productId));
  item.unitWorkerCost = unitWorkerCost;
  item.lineWorkerCost = unitWorkerCost * Number(item.qty || 0);
  migratedWorkerCostSnapshots = true;
}));
if (migratedWorkerCostSnapshots) save();
function usageInStockUnit(qty, recipeUnit, stockUnit) {
  const from = String(recipeUnit).toLowerCase(); const to = String(stockUnit).toLowerCase();
  if (from === to) return qty;
  if (from === 'ml' && to === 'l') return qty / 1000;
  if ((from === 'gram' || from === 'g') && to === 'kg') return qty / 1000;
  if ((from === 'cup' || from === 'pcs' || from === 'piece') && to === 'pcs') return qty;
  return qty;
}

const UNIT_ALIASES = { l: 'l', liter: 'l', litre: 'l', lt: 'l', ml: 'ml', mililiter: 'ml', milliliter: 'ml', kg: 'kg', kilogram: 'kg', kilo: 'kg', g: 'gram', gr: 'gram', gram: 'gram', grams: 'gram', pcs: 'pcs', pc: 'pcs', piece: 'pcs', pieces: 'pcs', buah: 'pcs' };
function normalizeUnit(unit) { const key = String(unit || '').trim().toLowerCase(); return UNIT_ALIASES[key] || key; }
function canonicalUnit(unit) {
  const normalized = normalizeUnit(unit);
  return ({ l: 'L', ml: 'ml', kg: 'kg', gram: 'gram', pcs: 'pcs' })[normalized] || String(unit || '').trim();
}
function convertQuantity(value, fromUnit, toUnit) {
  const amount = Number(value) || 0; const from = normalizeUnit(fromUnit); const to = normalizeUnit(toUnit);
  if (from === to) return amount;
  if (from === 'ml' && to === 'l') return amount / 1000;
  if (from === 'l' && to === 'ml') return amount * 1000;
  if (from === 'gram' && to === 'kg') return amount / 1000;
  if (from === 'kg' && to === 'gram') return amount * 1000;
  return amount;
}
// Model inventori dua lapis: bahan murni sebagai sumber, lalu premix yang
// diracik dari bahan murni dan dipakai oleh resep/HPP.
if (state.hppVersion < 3) {
  const migrated = migratePremixModel();
  if (migrated) save();
}
function formatQuantity(value, unit) {
  let amount = Number(value); if (!Number.isFinite(amount)) amount = 0;
  const normalized = normalizeUnit(unit); let label = canonicalUnit(unit) || String(unit || '').trim();
  if (normalized === 'ml' && Math.abs(amount) >= 1000) { amount /= 1000; label = 'L'; }
  else if (normalized === 'l' && amount !== 0 && Math.abs(amount) < 1) { amount *= 1000; label = 'ml'; }
  else if (normalized === 'gram' && Math.abs(amount) >= 1000) { amount /= 1000; label = 'kg'; }
  else if (normalized === 'kg' && amount !== 0 && Math.abs(amount) < 1) { amount *= 1000; label = 'gram'; }
  const digits = Math.abs(amount) >= 100 ? 0 : Math.abs(amount) >= 10 ? 1 : 2;
  const formatted = new Intl.NumberFormat('id-ID', { maximumFractionDigits: digits }).format(Number(amount.toFixed(3)));
  return `${formatted} ${label}`.trim();
}
function quantityInputUnits(unit) {
  const normalized = normalizeUnit(unit);
  if (normalized === 'ml' || normalized === 'l') return [{ value: 'ml', label: 'ml' }, { value: 'L', label: 'L' }];
  if (normalized === 'gram' || normalized === 'kg') return [{ value: 'gram', label: 'gram' }, { value: 'kg', label: 'kg' }];
  const label = canonicalUnit(unit) || 'unit';
  return [{ value: label, label }];
}

function uniquePremixSku(name) {
  const base = `PMX-${String(name || 'PREMIX').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 14) || 'PREMIX'}`;
  let sku = base; let counter = 2;
  while (state.inventory.some(item => String(item.sku || '').toUpperCase() === sku)) sku = `${base}-${counter++}`;
  return sku;
}

function seedPureItemCostsFromRecipes() {
  const components = state.recipes.flatMap(recipe => recipe.components || []);
  state.inventory.filter(item => !isPremixItem(item)).forEach(item => {
    if (Number(item.costPrice) > 0 && Number(item.packageSize) > 0) return;
    const source = components.find(component => String(component.ingredientId) === String(item.id) && Number(component.costPrice) > 0 && Number(component.packageSize) > 0);
    if (source) {
      const size = convertQuantity(Number(source.packageSize), source.unit, item.unit);
      if (size > 0) { item.costPrice = Number(source.costPrice); item.packageSize = Number(size.toFixed(6)); return; }
    }
    const purchase = [...state.inventoryMovements]
      .filter(movement => String(movement.ingredientId) === String(item.id) && movement.mode === 'add' && Number(movement.purchaseCost) > 0 && Number(movement.amount) > 0)
      .sort((a, b) => b.createdAt - a.createdAt)[0];
    if (purchase) { item.costPrice = Number(purchase.purchaseCost); item.packageSize = Number(purchase.amount); }
  });
}

function createMigratedPremix(recipe, mix, scale) {
  const name = `Premix ${recipe.name}`.slice(0, 60);
  let premix = state.inventory.find(item => isPremixItem(item) && item.name.toLowerCase() === name.toLowerCase());
  if (!premix) {
    premix = { id: crypto.randomUUID(), name, sku: uniquePremixSku(recipe.name), category: 'Premix', icon: '◈', unit: 'L', stock: 0, min: 1, max: 10, kind: 'premix', yieldQty: 1, components: [] };
    state.inventory.push(premix);
  }
  premix.kind = 'premix';
  premix.unit = 'L';
  premix.yieldQty = 1;
  premix.components = mix.map(({ component, item }) => ({ id: crypto.randomUUID(), ingredientId: item.id, qty: Number((Number(component.qty) * scale).toFixed(4)), unit: component.unit }));
  return premix;
}

function migratePremixModel() {
  if (!Array.isArray(state.inventory)) return false;
  state.inventory.forEach(item => { if (!isPremixItem(item)) item.kind = 'pure'; });
  seedPureItemCostsFromRecipes();
  state.recipes.forEach(recipe => {
    if (!Array.isArray(recipe.components) || !recipe.components.length) return;
    if (recipe.components.some(component => isPremixItem(itemById(component.ingredientId)))) return;
    const mix = []; const keep = [];
    recipe.components.forEach(component => {
      const item = itemById(component.ingredientId);
      if (item && !isPremixItem(item) && isPremixableItem(item) && !component.costType) mix.push({ component, item });
      else keep.push(component);
    });
    if (mix.length < 2) return;
    const totalMl = mix.reduce((sum, entry) => {
      const unit = normalizeUnit(entry.component.unit);
      const qty = Number(entry.component.qty) || 0;
      if (unit === 'ml') return sum + qty;
      if (unit === 'l') return sum + qty * 1000;
      return sum;
    }, 0);
    if (totalMl <= 0) return;
    const premix = createMigratedPremix(recipe, mix, 1000 / totalMl);
    if (!premix) return;
    const qtyL = Number((totalMl / 1000).toFixed(4));
    const cost = Number(premixUnitCost(premix).toFixed(4));
    recipe.components = [...keep, { id: crypto.randomUUID(), ingredientId: premix.id, name: premix.name, qty: qtyL, unit: 'L', costPrice: cost, packageSize: 1, trackStock: true, costType: null }];
  });
  state.hppVersion = 3;
  return true;
}

let activeCategory = 'Semua';
function renderCategories() {
  const categories = ['Semua', ...new Set(products.map(p => p.category))];
  if (!categories.includes(activeCategory)) activeCategory = 'Semua';
  $('#category-tabs').innerHTML = categories.map(c => `<button class="category-tab ${c === activeCategory ? 'active' : ''}" data-category="${c}">${c}</button>`).join('');
}

function renderProducts() {
  const query = $('#product-search')?.value.toLowerCase() || '';
  const filtered = products.filter(p => (activeCategory === 'Semua' || p.category === activeCategory) && p.name.toLowerCase().includes(query));
  $('#catalog-count').textContent = `${filtered.filter(p => !p.soldOut).length} produk tersedia`;
  const shiftLocked = !isShiftActive();
  $('#product-grid').innerHTML = filtered.map(p => `
    <button class="product-card ${p.soldOut ? 'sold-out' : ''} ${shiftLocked ? 'shift-locked' : ''}" data-product="${p.id}" ${p.soldOut || shiftLocked ? 'disabled' : ''}>
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}${productVisual(p)}
      <h3>${escapeHTML(p.name)}</h3><p>${rupiah(productPrice(p))}</p>
    </button>`).join('') || `<div class="empty-cart" style="grid-column:1/-1"><div><div class="empty-cart-visual">⌕</div><h3>Menu tidak ditemukan</h3><p>Coba gunakan kata kunci atau kategori lain.</p></div></div>`;
}

function cartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const promo = selectedPromotion();
  const eligible = promo && subtotal >= promo.minPurchase;
  const rawDiscount = !eligible ? 0 : promo.type === 'percent' ? subtotal * promo.value / 100 : promo.value;
  const discount = Math.round(Math.min(subtotal, rawDiscount));
  return { subtotal, discount, total: subtotal - discount, promo: eligible ? promo : null };
}

function renderCart() {
  $('#current-order-number').textContent = `#${nextOrderId()}`;
  const list = $('#cart-items');
  if (!state.cart.length) {
    list.innerHTML = `<div class="empty-cart"><div><div class="empty-cart-visual">☕</div><h3>Belum ada pesanan</h3><p>Pilih menu di sebelah kiri untuk mulai membuat pesanan.</p></div></div>`;
  } else {
    list.innerHTML = state.cart.map((item, index) => {
      const p = products.find(x => x.id === item.productId);
      return `<div class="cart-item"><div class="cart-thumb">${p ? `<img src="${escapeHTML(p.image)}" alt="">` : '☕'}</div><div><h4>${escapeHTML(item.name)}</h4><p>${escapeHTML(item.mods.join(' · '))}</p><div class="qty-control"><button data-qty="${index}" data-delta="-1">−</button><span>${item.qty}</span><button data-qty="${index}" data-delta="1">＋</button></div></div><div class="cart-item-price">${rupiah(item.price * item.qty)}</div></div>`;
    }).join('');
  }
  const t = cartTotals();
  $('#subtotal').textContent = rupiah(t.subtotal); $('#total').textContent = rupiah(t.total); $('#pay-total').textContent = rupiah(t.total);
  $('#discount-row').hidden = !t.discount; $('#discount').textContent = `−${rupiah(t.discount)}`;
  $('#pay-button').disabled = !state.cart.length || !isShiftActive();
  $('#pay-button span').textContent = isShiftActive() ? 'Bayar sekarang' : 'Mulai shift dahulu';
  $('#customer-trigger').disabled = !isShiftActive();
  $('#promo-button').disabled = !isShiftActive();
  const promo = selectedPromotion();
  $('#promo-label').textContent = promo ? `${promo.code}${t.promo ? ' ✓' : ' · min. belum tercapai'}` : 'Pilih ›';
  if (state.selectedCustomer) {
    $('#selected-customer-name').textContent = state.selectedCustomer.name;
    $('#selected-customer-meta').textContent = `${state.selectedCustomer.points.toLocaleString('id-ID')} poin · ${state.selectedCustomer.tier}`;
  } else {
    $('#selected-customer-name').textContent = 'Tambahkan pelanggan';
    $('#selected-customer-meta').textContent = 'Dapatkan poin dari transaksi ini';
  }
  save();
}

function showModifier(product) {
  if (!isShiftActive()) { toast('Mulai shift sebelum membuat pesanan', '!'); showShiftManager(); return; }
  const isRetail = product.type === 'retail';
  const basePrice = productPrice(product);
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Atur pesanan</h2><p>Pilih preferensi pelanggan sebelum ditambahkan</p></div><button class="modal-close">×</button></div>
    <div class="modal-body"><div class="modifier-product">${productVisual(product, true)}<div><h3>${product.name}</h3><p>${rupiah(basePrice)}</p></div></div>
    ${isRetail ? `<div class="option-group"><div class="option-title"><span>Produk</span><em>SIAP DIAMBIL</em></div><div class="option-grid" data-option-group="retail"><button class="option-button selected">Reguler</button></div></div>` : `
      <div class="option-group"><div class="option-title"><span>Es</span><em>WAJIB</em></div><div class="option-grid" data-option-group="temp"><button class="option-button selected">Es reguler</button><button class="option-button">Less ice</button><button class="option-button">Tanpa es</button></div></div>
      <div class="option-group"><div class="option-title"><span>Gula sorgum</span><em>WAJIB</em></div><div class="option-grid" data-option-group="sugar"><button class="option-button">Tanpa sorgum</button><button class="option-button">Less sorgum</button><button class="option-button selected">Normal sorgum</button></div></div>
      <div class="option-group"><div class="option-title"><span>Tambahan</span><span class="option-title-actions"><em>OPSIONAL</em>${canManageSales() ? '<button type="button" id="edit-addon-prices">✎ Kelola item</button>' : ''}</span></div><div class="option-grid" data-option-group="extra">${addOns.map(addOn => `<button class="option-button" data-addon="${addOn.id}" data-extra="${addOnPrice(addOn)}">${escapeHTML(addOn.name)}<small>+${rupiah(addOnPrice(addOn))}</small></button>`).join('')}</div></div>`}
    </div><div class="modal-footer"><button class="button-ghost modal-close">Batal</button><button class="button-primary" id="add-configured">Tambah · ${rupiah(basePrice)}</button></div>`);

  $$('.option-button', $('#modal')).forEach(button => button.addEventListener('click', () => {
    const group = button.closest('[data-option-group]');
    if (group.dataset.optionGroup === 'extra') button.classList.toggle('selected');
    else { $$('.option-button', group).forEach(b => b.classList.remove('selected')); button.classList.add('selected'); }
    const extra = $$('.option-button.selected[data-extra]', $('#modal')).reduce((sum, b) => sum + (+b.dataset.extra || 0), 0);
    $('#add-configured').textContent = `Tambah · ${rupiah(basePrice + extra)}`;
  }));
  $('#edit-addon-prices')?.addEventListener('click', () => showAddOnPriceManager(product));
  $('#add-configured').addEventListener('click', () => {
    const selections = $$('.option-button.selected', $('#modal')).map(b => b.childNodes[0].textContent.trim());
    const extra = $$('.option-button.selected[data-extra]', $('#modal')).reduce((sum, b) => sum + (+b.dataset.extra || 0), 0);
    const similar = state.cart.find(i => i.productId === product.id && i.mods.join('|') === selections.join('|'));
    if (similar) similar.qty += 1; else state.cart.push({ productId: product.id, name: product.name, price: basePrice + extra, qty: 1, mods: selections });
    closeModal(); renderCart(); toast(`${product.name} ditambahkan`);
  });
}

function showAddOnPriceManager(product) {
  if (!canManageSales()) return toast('Hanya admin yang dapat mengelola item tambahan', '!');
  const rows = addOns.map(addOn => `<article class="catalog-manage-row"><div><strong>${escapeHTML(addOn.name)}</strong><small>${rupiah(addOn.price)}</small></div><div class="catalog-row-actions"><button data-addon-edit="${addOn.id}">Edit</button><button class="danger-action" data-addon-delete="${addOn.id}">Hapus</button></div></article>`).join('');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Kelola item tambahan</h2><p>Tambah, ubah nama dan harga, atau hapus pilihan tambahan</p></div><button class="modal-close">×</button></div><div class="modal-body"><div class="catalog-manager-list">${rows || '<div class="empty-inline"><strong>Belum ada item tambahan</strong><span>Tambahkan pilihan pertama untuk menu minuman.</span></div>'}</div></div><div class="modal-footer"><button type="button" class="button-ghost" id="back-to-modifier">Kembali</button><button type="button" class="button-primary" id="add-addon">＋ Tambah item</button></div>`, true);
  $('#back-to-modifier').addEventListener('click', () => showModifier(product));
  $('#add-addon').addEventListener('click', () => showAddOnForm(product));
  $$('[data-addon-edit]', $('#modal')).forEach(button => button.addEventListener('click', () => showAddOnForm(product, button.dataset.addonEdit)));
  $$('[data-addon-delete]', $('#modal')).forEach(button => button.addEventListener('click', async () => {
    const index = addOns.findIndex(item => String(item.id) === button.dataset.addonDelete);
    if (index < 0) return;
    if (!await confirmDialog(`Hapus tambahan ${addOns[index].name}?`, { title: 'Hapus item tambahan', confirmLabel: 'Hapus' })) return;
    addOns.splice(index, 1); save(); showAddOnPriceManager(product); toast('Item tambahan dihapus');
  }));
}

function showAddOnForm(product, id = null) {
  const addOn = addOns.find(item => String(item.id) === String(id));
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${addOn ? 'Edit' : 'Tambah'} item tambahan</h2><p>Atur nama pilihan dan harga tambahannya</p></div><button class="modal-close">×</button></div><form id="addon-form"><div class="modal-body"><div class="form-grid"><div class="field full"><label>Nama item</label><input name="name" required maxlength="40" placeholder="Contoh: Extra cream" value="${escapeHTML(addOn?.name || '')}"></div><div class="field full"><label>Harga tambahan</label><input name="price" type="number" inputmode="numeric" min="0" step="500" required value="${addOn?.price ?? 0}"></div></div><div class="notice">Harga Rp0 diperbolehkan untuk tambahan gratis.</div></div><div class="modal-footer"><button type="button" class="button-ghost" id="back-addon-list">Kembali</button><button type="submit" class="button-primary">Simpan item</button></div></form>`);
  $('#back-addon-list').addEventListener('click', () => showAddOnPriceManager(product));
  $('#addon-form').addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const entry = { id: addOn?.id || crypto.randomUUID(), name: data.get('name').trim(), price: Math.max(0, Number(data.get('price')) || 0) };
    if (addOn) Object.assign(addOn, entry); else addOns.push(entry);
    save(); showAddOnPriceManager(product); toast('Item tambahan berhasil disimpan', '✎');
  });
}

function showPriceManager() {
  if (!canManageSales()) return toast('Hanya admin yang dapat mengelola menu', '!');
  const rows = products.map(product => `<article class="catalog-manage-row product-manage-row"><span class="catalog-manage-thumb"><img src="${escapeHTML(product.image)}" alt=""></span><div><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.category)} · ${rupiah(product.price)}${product.soldOut ? ' · HABIS' : ''}</small></div><div class="catalog-row-actions"><button data-menu-edit="${product.id}">Edit</button><button class="danger-action" data-menu-delete="${product.id}">Hapus</button></div></article>`).join('');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Kelola menu</h2><p>Tambah menu baru beserta foto, harga, kategori, dan ketersediaannya</p></div><button class="modal-close">×</button></div><div class="modal-body"><div class="catalog-manager-list">${rows || '<div class="empty-inline"><strong>Menu masih kosong</strong><span>Tambahkan produk pertama ke katalog kasir.</span></div>'}</div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Kembali</button><button type="button" class="button-primary" id="add-menu">＋ Tambah menu</button></div>`, true);
  $('#add-menu').addEventListener('click', () => showMenuForm());
  $$('[data-menu-edit]', $('#modal')).forEach(button => button.addEventListener('click', () => showMenuForm(button.dataset.menuEdit)));
  $$('[data-menu-delete]', $('#modal')).forEach(button => button.addEventListener('click', async () => {
    const index = products.findIndex(item => String(item.id) === button.dataset.menuDelete);
    if (index < 0) return;
    if (state.cart.some(item => String(item.productId) === String(products[index].id))) return toast('Hapus item dari keranjang sebelum menghapus menu', '!');
    if (!await confirmDialog(`Hapus menu ${products[index].name}?`, { title: 'Hapus menu', confirmLabel: 'Hapus' })) return;
    products.splice(index, 1); save(); renderCategories(); renderProducts(); showPriceManager(); toast('Menu berhasil dihapus');
  }));
}

function readCatalogImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (!file.type.startsWith('image/')) return reject(new Error('File harus berupa gambar'));
    if (file.size > 5000000) return reject(new Error('Ukuran foto maksimal 5 MB'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Foto tidak dapat dibaca'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Format foto tidak didukung'));
      image.onload = () => {
        const scale = Math.min(1, 720 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', .78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function showMenuForm(id = null) {
  const product = products.find(item => String(item.id) === String(id));
  const preview = product?.image ? `<img src="${escapeHTML(product.image)}" alt="Pratinjau foto">` : '<span>Belum ada foto</span>';
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${product ? 'Edit' : 'Tambah'} menu</h2><p>Lengkapi informasi yang akan tampil pada katalog kasir</p></div><button class="modal-close">×</button></div><form id="menu-form"><div class="modal-body"><label class="menu-photo-field"><span class="menu-photo-preview" id="menu-photo-preview">${preview}</span><span><strong>${product ? 'Ganti foto menu' : 'Unggah foto menu'}</strong><small>JPG, PNG, atau WebP · maksimal 5 MB</small></span><input name="image" id="menu-image" type="file" accept="image/png,image/jpeg,image/webp"></label><div class="form-grid"><div class="field"><label>Nama menu</label><input name="name" required maxlength="60" value="${escapeHTML(product?.name || '')}" placeholder="Contoh: Cold Brew Pandan"></div><div class="field"><label>Kategori</label><input name="category" required maxlength="40" value="${escapeHTML(product?.category || '')}" placeholder="Contoh: Variant Diet Coffee"></div><div class="field"><label>Harga</label><input name="price" required type="number" inputmode="numeric" min="0" step="500" value="${product?.price ?? ''}"></div><div class="field"><label>Jenis produk</label><select name="type"><option value="drink" ${product?.type !== 'retail' ? 'selected' : ''}>Minuman</option><option value="retail" ${product?.type === 'retail' ? 'selected' : ''}>Produk retail</option></select></div><div class="field"><label>Label (opsional)</label><input name="badge" maxlength="15" value="${escapeHTML(product?.badge || '')}" placeholder="BARU / TERLARIS"></div><label class="toggle-field"><input name="soldOut" type="checkbox" ${product?.soldOut ? 'checked' : ''}><span>Tandai sedang habis</span></label></div></div><div class="modal-footer"><button type="button" class="button-ghost" id="back-menu-list">Kembali</button><button type="submit" class="button-primary">Simpan menu</button></div></form>`, true);
  let pendingImage = null;
  $('#back-menu-list').addEventListener('click', showPriceManager);
  $('#menu-image').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    try { pendingImage = await readCatalogImage(file); $('#menu-photo-preview').innerHTML = `<img src="${pendingImage}" alt="Pratinjau foto">`; }
    catch (error) { event.target.value = ''; pendingImage = null; toast(error.message, '!'); }
  });
  $('#menu-form').addEventListener('submit', async event => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    if (!product && !pendingImage) return toast('Unggah foto menu terlebih dahulu', '!');
    const entry = { id: product?.id || crypto.randomUUID(), name: data.get('name').trim(), category: data.get('category').trim(), price: Math.max(0, Number(data.get('price')) || 0), image: pendingImage || product.image, type: data.get('type') === 'retail' ? 'retail' : undefined, badge: data.get('badge').trim().toUpperCase() || undefined, soldOut: data.has('soldOut'), sold: product?.sold || 0 };
    if (product) Object.assign(product, entry); else products.push(entry);
    save(); renderCategories(); renderProducts(); showPriceManager(); toast('Menu berhasil disimpan', '✎');
  });
}

function promotionValueLabel(promo) {
  return promo.type === 'percent' ? `${promo.value}%` : rupiah(promo.value);
}

function showPromotionManager() {
  const items = state.promotions.map(promo => `<article class="promo-card ${promo.active ? '' : 'inactive'}"><div><span class="promo-kind">${promo.kind === 'voucher' ? 'VOUCHER' : 'PROMO'}</span><h3>${escapeHTML(promo.name)}</h3><p><strong>${escapeHTML(promo.code)}</strong> · Potongan ${promotionValueLabel(promo)}${promo.minPurchase ? ` · Min. ${rupiah(promo.minPurchase)}` : ''}</p></div><div class="promo-actions"><button data-promo-apply="${promo.id}" ${promo.active ? '' : 'disabled'}>${state.promo === promo.id ? 'Terpasang ✓' : 'Pakai'}</button>${canManageSales() ? `<button data-promo-edit="${promo.id}">Edit</button><button class="danger-action" data-promo-delete="${promo.id}">Hapus</button>` : ''}</div></article>`).join('');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Promo & voucher</h2><p>Pilih potongan untuk transaksi ini atau kelola program penjualan</p></div><button class="modal-close">×</button></div><div class="modal-body"><div class="promotion-list">${items || `<div class="empty-inline"><strong>Belum ada promo atau voucher</strong><span>Buat program pertama untuk memberikan potongan pada transaksi.</span></div>`}</div></div><div class="modal-footer"><button class="button-ghost" id="remove-promo" ${state.promo ? '' : 'disabled'}>Lepas potongan</button>${canManageSales() ? '<button class="button-primary" id="add-promo">＋ Buat promo / voucher</button>' : ''}</div>`, true);
  $$('[data-promo-apply]', $('#modal')).forEach(button => button.addEventListener('click', () => {
    state.promo = button.dataset.promoApply; save(); closeModal(); renderCart(); toast('Potongan diterapkan', '◇');
  }));
  $$('[data-promo-edit]', $('#modal')).forEach(button => button.addEventListener('click', () => showPromotionForm(button.dataset.promoEdit)));
  $$('[data-promo-delete]', $('#modal')).forEach(button => button.addEventListener('click', async () => {
    const promo = state.promotions.find(item => item.id === button.dataset.promoDelete);
    if (!promo) return;
    if (!await confirmDialog(`Hapus ${promo.name}?`, { title: 'Hapus promo', confirmLabel: 'Hapus' })) return;
    state.promotions = state.promotions.filter(item => item.id !== promo.id);
    if (state.promo === promo.id) state.promo = null;
    save(); renderCart(); showPromotionManager(); toast('Promo atau voucher dihapus');
  }));
  $('#remove-promo').addEventListener('click', () => { state.promo = null; save(); closeModal(); renderCart(); toast('Potongan dilepas'); });
  $('#add-promo')?.addEventListener('click', () => showPromotionForm());
}

function showPromotionForm(id = null) {
  if (!canManageSales()) return;
  const promo = state.promotions.find(item => item.id === id);
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${promo ? 'Edit' : 'Buat'} promo / voucher</h2><p>Atur kode, nilai potongan, dan minimum pembelian</p></div><button class="modal-close">×</button></div><form id="promotion-form"><div class="modal-body"><div class="form-grid"><div class="field"><label>Jenis</label><select name="kind"><option value="promo" ${promo?.kind !== 'voucher' ? 'selected' : ''}>Promo</option><option value="voucher" ${promo?.kind === 'voucher' ? 'selected' : ''}>Voucher</option></select></div><div class="field"><label>Kode</label><input name="code" required maxlength="20" placeholder="HEMAT15" value="${escapeHTML(promo?.code || '')}"></div><div class="field full"><label>Nama program</label><input name="name" required maxlength="50" placeholder="Diskon pembukaan outlet" value="${escapeHTML(promo?.name || '')}"></div><div class="field"><label>Jenis potongan</label><select name="type"><option value="percent" ${promo?.type !== 'fixed' ? 'selected' : ''}>Persentase (%)</option><option value="fixed" ${promo?.type === 'fixed' ? 'selected' : ''}>Nominal (Rp)</option></select></div><div class="field"><label>Nilai potongan</label><input name="value" type="number" inputmode="numeric" min="1" required value="${promo?.value || ''}"></div><div class="field"><label>Minimum pembelian</label><input name="minPurchase" type="number" inputmode="numeric" min="0" step="1000" value="${promo?.minPurchase || 0}"></div><label class="toggle-field"><input name="active" type="checkbox" ${promo?.active === false ? '' : 'checked'}><span>Aktif dan dapat digunakan kasir</span></label></div><div class="notice">Diskon tidak pernah melebihi subtotal. Promo hanya berlaku jika minimum pembelian tercapai.</div></div><div class="modal-footer"><button type="button" class="button-ghost" id="back-promos">Kembali</button><button type="submit" class="button-primary">Simpan</button></div></form>`);
  $('#back-promos').addEventListener('click', showPromotionManager);
  $('#promotion-form').addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const type = data.get('type'); const value = Number(data.get('value'));
    if (type === 'percent' && value > 100) return toast('Persentase maksimal 100%', '!');
    const entry = { id: promo?.id || crypto.randomUUID(), kind: data.get('kind'), code: data.get('code').trim().toUpperCase(), name: data.get('name').trim(), type, value, minPurchase: Math.max(0, Number(data.get('minPurchase')) || 0), active: data.has('active'), createdAt: promo?.createdAt || Date.now() };
    if (state.promotions.some(item => item.id !== entry.id && item.code === entry.code)) return toast('Kode promo sudah digunakan', '!');
    if (promo) Object.assign(promo, entry); else state.promotions.unshift(entry);
    if (!entry.active && state.promo === entry.id) state.promo = null;
    save(); renderCart(); showPromotionManager(); toast(`${entry.kind === 'voucher' ? 'Voucher' : 'Promo'} berhasil disimpan`, '◇');
  });
}

function showCustomerPicker() {
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Pilih pelanggan</h2><p>Cari member melalui nama atau nomor telepon</p></div><button class="modal-close">×</button></div><div class="modal-body"><input class="customer-search" id="customer-modal-search" autofocus placeholder="Ketik nama atau nomor telepon..."><div class="customer-results" id="customer-results"></div></div><div class="modal-footer"><button class="button-ghost modal-close">Lanjut tanpa member</button><button class="button-primary" id="new-customer-modal">＋ Member baru</button></div>`);
  const draw = () => {
    const q = $('#customer-modal-search').value.toLowerCase();
    const found = state.customers.filter(c => c.name.toLowerCase().includes(q) || (c.phone || '').includes(q));
    $('#customer-results').innerHTML = found.length ? found.map(c => `<button class="customer-option" data-customer="${c.id}"><span class="person-avatar" style="--bg:${c.bg};--fg:${c.fg}">${c.initials}</span><span><strong>${c.name}</strong><small>${c.phone || 'Tanpa nomor WhatsApp'} · ${c.visits} kunjungan</small></span><b>${c.points.toLocaleString('id-ID')} poin</b></button>`).join('') : `<div class="empty-inline"><strong>Belum ada member</strong><span>Tambahkan pelanggan pertama untuk mulai mengumpulkan poin.</span></div>`;
  };
  draw(); $('#customer-modal-search').addEventListener('input', draw);
  $('#customer-results').addEventListener('click', e => { const b = e.target.closest('[data-customer]'); if (!b) return; state.selectedCustomer = state.customers.find(c => c.id === +b.dataset.customer); closeModal(); renderCart(); toast(`${state.selectedCustomer.name} dipilih`, '♙'); });
  $('#new-customer-modal').addEventListener('click', showCustomerForm);
}

function showCustomerForm(customer = null) {
  const editing = Boolean(customer);
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${editing ? 'Edit pelanggan' : 'Member baru'}</h2><p>${editing ? 'Perbarui data member tanpa mengubah poin dan riwayat kunjungan' : 'Data minimum untuk mulai mengumpulkan poin'}</p></div><button class="modal-close">×</button></div><form id="customer-form"><div class="modal-body"><div class="form-grid"><div class="field"><label>Nama pelanggan</label><input name="name" required placeholder="Contoh: Nabila" value="${escapeHTML(customer?.name || '')}"></div><div class="field"><label>Nomor WhatsApp (opsional)</label><input name="phone" inputmode="tel" placeholder="Boleh dikosongkan" value="${escapeHTML(customer?.phone || '')}"></div><div class="field full"><label>Catatan (opsional)</label><textarea name="note" placeholder="Preferensi atau catatan pelanggan">${escapeHTML(customer?.note || '')}</textarea></div></div><div class="notice">${editing ? 'Poin, kunjungan, dan total belanja tetap dipertahankan. Nama baru akan dipakai pada transaksi berikutnya.' : 'Pelanggan akan memperoleh 1 poin untuk setiap Rp100 nilai transaksi bersih.'}</div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">${editing ? 'Simpan perubahan' : 'Simpan member'}</button></div></form>`);
  $('#customer-form').addEventListener('submit', e => {
    e.preventDefault(); const fd = new FormData(e.target); const name = fd.get('name').trim(); const phone = (fd.get('phone') || '').trim(); const note = (fd.get('note') || '').trim();
    if (editing) {
      Object.assign(customer, { name, phone, note, initials: name.split(/\s+/).map(x => x[0]).join('').slice(0,2).toUpperCase() });
      save(); closeModal(); renderCustomers($('#customer-search-page')?.value || ''); renderCart(); toast('Data pelanggan berhasil diperbarui', '✎');
      return;
    }
    const entry = { id: Date.now(), name, phone, note, createdAt: Date.now(), visits: 0, spent: 0, points: 0, tier: 'Member', initials: name.split(/\s+/).map(x => x[0]).join('').slice(0,2).toUpperCase(), bg: '#eadfd6', fg: '#604a3e' };
    state.customers.unshift(entry); state.selectedCustomer = entry; save(); closeModal(); renderCart(); renderCustomers(); toast('Member baru berhasil dibuat', '♙');
  });
}

function showPayment() {
  if (!isShiftActive()) { toast('Transaksi terkunci karena shift belum dibuka', '!'); showShiftManager(); return; }
  if (!state.cart.length) return toast('Keranjang masih kosong', '!');
  const t = cartTotals(); let method = 'cash'; let qrisVerified = false;
  const qrisReference = `QR-${Date.now().toString().slice(-10)}`;
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Pilih pembayaran</h2><p>Pastikan nominal dan pesanan sudah benar</p></div><button class="modal-close">×</button></div><div class="modal-body"><div class="payment-total-box"><span>TOTAL PEMBAYARAN</span><strong>${rupiah(t.total)}</strong></div><div class="payment-options"><button class="payment-option selected" data-method="cash"><i>▤</i><strong>Tunai</strong><small>Hitung kembalian otomatis</small></button><button class="payment-option" data-method="qris"><i>▦</i><strong>QRIS statis</strong><small>Konfirmasi manual oleh kasir</small></button></div><div id="payment-detail"></div></div><div class="modal-footer"><button class="button-ghost modal-close">Kembali</button><button class="button-primary" id="confirm-payment">Selesaikan pembayaran</button></div>`, true);
  const detail = () => {
    const qrisVisual = state.qrisImage ? `<div class="fake-qr uploaded"><img src="${state.qrisImage}" alt="QRIS Merchant Sorgtime"></div>` : `<div class="fake-qr empty" aria-label="QRIS belum dipasang"><strong>QRIS</strong><small>Belum dipasang</small></div>`;
    $('#payment-detail').innerHTML = method === 'cash' ? `<div class="cash-input"><label>Uang diterima</label><div class="money-input"><span>Rp</span><input id="cash-received" inputmode="numeric" value="${Math.ceil(t.total/10000)*10000}"></div><div class="quick-cash">${[t.total, 50000, 100000].filter((x,i,a)=>a.indexOf(x)===i && x>=t.total).map(v=>`<button data-cash="${v}">${rupiah(v)}</button>`).join('')}</div><div class="change-preview" id="change-preview"></div></div>` : `<div class="qris-box">${qrisVisual}<div><strong>QRIS Merchant Sorgtime</strong><b>${rupiah(t.total)}</b><small>Referensi ${qrisReference}<br>${state.qrisImage ? 'Minta pelanggan memindai QRIS merchant.' : 'Unggah QRIS statis merchant terlebih dahulu.'}</small><label class="upload-qris">${state.qrisImage ? 'Ganti QRIS' : 'Unggah QRIS'}<input id="qris-upload" type="file" accept="image/png,image/jpeg,image/webp"></label></div></div><div class="qris-status ${qrisVerified ? 'verified' : ''}" id="qris-status"><i>${qrisVerified ? '✓' : '◷'}</i><span><strong>${qrisVerified ? 'Pembayaran terverifikasi' : state.qrisImage ? 'Menunggu pembayaran' : 'QRIS belum dihubungkan'}</strong><small>${qrisVerified ? 'Siap menyelesaikan transaksi' : state.qrisImage ? 'Periksa aplikasi merchant sebelum konfirmasi' : 'Pasang QR merchant untuk menerima pembayaran'}</small></span></div>${qrisVerified ? '' : `<button class="verify-qris" id="verify-qris" ${state.qrisImage ? '' : 'disabled'}>Saya sudah cek pembayaran masuk</button>`}`;
    $$('[data-cash]', $('#payment-detail')).forEach(b => b.addEventListener('click', () => $('#cash-received').value = b.dataset.cash));
    const cashInput = $('#cash-received');
    const updateChange = () => { if (!cashInput) return; const change = Math.max(0, (+cashInput.value || 0) - t.total); $('#change-preview').textContent = `Kembalian: ${rupiah(change)}`; };
    cashInput?.addEventListener('input', updateChange); updateChange();
    $('#verify-qris')?.addEventListener('click', () => { qrisVerified = true; detail(); toast('Pembayaran QRIS terverifikasi', '✓'); });
    $('#qris-upload')?.addEventListener('change', event => {
      const file = event.target.files?.[0]; if (!file) return;
      if (file.size > 1500000) return toast('Ukuran gambar QRIS maksimal 1,5 MB', '!');
      const reader = new FileReader(); reader.onload = () => { state.qrisImage = reader.result; qrisVerified = false; save(); detail(); toast('QRIS merchant berhasil dipasang', '▦'); }; reader.readAsDataURL(file);
    });
    $('#confirm-payment').disabled = method === 'qris' && !qrisVerified;
  };
  detail();
  $$('.payment-option').forEach(b => b.addEventListener('click', () => { method = b.dataset.method; qrisVerified = false; $$('.payment-option').forEach(x => x.classList.toggle('selected', x === b)); detail(); }));
  $('#confirm-payment').addEventListener('click', () => {
    if (method === 'cash' && (+$('#cash-received').value || 0) < t.total) return toast('Uang diterima belum mencukupi', '!');
    if (method === 'qris' && !qrisVerified) return toast('Konfirmasi pembayaran QRIS terlebih dahulu', '!');
    const paymentDetail = method === 'cash' ? { received: +$('#cash-received').value || 0, change: Math.max(0, (+$('#cash-received').value || 0) - t.total) } : { reference: qrisReference, verified: true };
    completeOrder(method, t, paymentDetail);
  });
}

function completeOrder(method, totals, paymentDetail = {}) {
  const shift = activeShift();
  if (!shift) { closeModal(); renderAll(); toast('Pembayaran dibatalkan karena shift sudah ditutup', '!'); return; }
  const id = nextOrderId(); const createdAt = Date.now();
  const orderItems = state.cart.map(item => { const recipe = recipeForProduct(item.productId); const unitHpp = recipeHpp(recipe); const unitWorkerCost = recipeWorkerCost(recipe); return { productId: item.productId, qty: item.qty, name: item.name, unitPrice: item.price, lineTotal: item.price * item.qty, unitHpp, lineHpp: unitHpp * item.qty, unitWorkerCost, lineWorkerCost: unitWorkerCost * item.qty, mods: item.mods.join(' · ') }; });
  const order = { uid: crypto.randomUUID(), id, shiftId: shift.id, customer: state.selectedCustomer?.name || 'Guest', created: createdAt, status: 'new', statusHistory: [{ status: 'new', at: createdAt, user: currentUser?.name || 'Admin' }], payment: method === 'cash' ? 'Tunai' : 'QRIS', subtotal: totals.subtotal, discount: totals.discount, promoCode: totals.promo?.code || null, total: totals.total, hppTotal: orderItems.reduce((sum, item) => sum + item.lineHpp, 0), paymentDetail, cashierId: currentUser?.id || null, cashier: currentUser?.name || 'Admin', items: orderItems };
  state.orders.unshift(order); state.orderNo += 1; state.salesCount += 1; state.revenue += totals.total;
  if (method === 'cash') state.cashSales += totals.total; else state.qrisSales += totals.total;
  if (state.selectedCustomer) { state.selectedCustomer.visits += 1; state.selectedCustomer.spent += totals.total; state.selectedCustomer.points += Math.floor((totals.subtotal - totals.discount) / 100); }
  state.cart.forEach(item => {
    const recipe = recipeForProduct(item.productId); if (!recipe) return;
    recipe.components.filter(component => component.trackStock && component.ingredientId).forEach(component => {
      const ingredient = state.inventory.find(entry => String(entry.id) === String(component.ingredientId)); if (!ingredient) return;
      const used = usageInStockUnit(Number(component.qty) * item.qty, component.unit, ingredient.unit); const before = ingredient.stock;
      ingredient.stock = Number((ingredient.stock - used).toFixed(3));
      state.inventoryMovements.unshift({ id: crypto.randomUUID(), ingredientId: ingredient.id, mode: 'subtract', amount: used, before, after: ingredient.stock, reference: `Penjualan ${id} · ${item.name}`, createdAt: Date.now(), userId: currentUser?.id || null, orderId: order.uid });
    });
  });
  order.items.forEach(item => { const product = products.find(p => p.id === item.productId); if (product) product.sold += item.qty; });
  state.cart = []; state.selectedCustomer = null; state.promo = null; save(); closeModal(); renderAll();
  openModal(`<div class="success-body"><div class="success-icon">✓</div><h2>Pembayaran berhasil</h2><p>Pesanan sudah dikirim ke layar barista</p><div class="queue-big">#${id}</div><p>${order.payment} · ${rupiah(order.total)}</p></div><div class="modal-footer"><button class="button-ghost" id="print-receipt">▤ Cetak struk</button><button class="button-primary" id="next-order">Pesanan berikutnya</button></div>`);
  $('#print-receipt').addEventListener('click', () => printReceipt(order));
  $('#next-order').addEventListener('click', closeModal);
}

function printReceipt(order) {
  if (!order) return toast('Data transaksi tidak ditemukan', '!');
  const receipt = window.open('', 'sorgtime-receipt', 'width=420,height=720');
  if (!receipt) return toast('Izinkan pop-up browser untuk mencetak nota', '!');
  const date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(order.created));
  const itemRows = order.items.map(item => `<div class="item"><div><strong>${item.qty}× ${escapeHTML(item.name)}</strong><small>${escapeHTML(item.mods || '')}</small></div><span>${rupiah(item.lineTotal)}</span></div>`).join('');
  const cashRows = order.payment === 'Tunai' ? `<div class="row"><span>Diterima</span><span>${rupiah(order.paymentDetail?.received || order.total)}</span></div><div class="row"><strong>Kembalian</strong><strong>${rupiah(order.paymentDetail?.change || 0)}</strong></div>` : `<div class="row"><span>Referensi QRIS</span><span>${escapeHTML(order.paymentDetail?.reference || '-')}</span></div>`;
  const logoUrl = new URL('assets/sorgtime-logo.png', window.location.href).href;
  receipt.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Nota ${escapeHTML(order.id)}</title><style>@page{size:80mm auto;margin:5mm}*{box-sizing:border-box}body{width:70mm;margin:0 auto;color:#111;font:12px ui-monospace,SFMono-Regular,Menlo,monospace}.brand{text-align:center;border-bottom:1px dashed #111;padding:5px 0 12px}.brand img{display:block;width:42px;height:54px;margin:0 auto 7px;object-fit:cover}.brand h1{margin:0;font:700 23px Arial,sans-serif;letter-spacing:3px}.brand p,.meta p{margin:3px 0}.meta{padding:9px 0;border-bottom:1px dashed #111}.item{display:flex;justify-content:space-between;gap:10px;padding:7px 0}.item small{display:block;margin-top:2px;color:#555}.items{border-bottom:1px dashed #111}.row{display:flex;justify-content:space-between;gap:10px;margin:5px 0}.totals{padding:8px 0;border-bottom:1px dashed #111}.total{font-size:15px;margin-top:8px}.footer{text-align:center;padding-top:13px}.queue{display:inline-block;margin:8px 0;padding:6px 12px;border:2px solid #111;font-size:20px;font-weight:700}@media print{body{width:auto}.no-print{display:none}}</style></head><body><div class="brand"><img src="${logoUrl}" alt="Logo Sorgtime"><h1>SORGTIME</h1><p>Stay Healthy With Us!</p></div><div class="meta"><p><strong>Sorgtime Probolinggo</strong></p><p>${escapeHTML(date)}</p><p>Order #${escapeHTML(order.id)} · Kasir ${escapeHTML(order.cashier)}</p><p>${escapeHTML(orderShiftLabel(order))}</p><p>Pelanggan: ${escapeHTML(order.customer)}</p></div><div class="items">${itemRows}</div><div class="totals"><div class="row"><span>Subtotal</span><span>${rupiah(order.subtotal)}</span></div>${order.discount ? `<div class="row"><span>Diskon${order.promoCode ? ` (${escapeHTML(order.promoCode)})` : ''}</span><span>−${rupiah(order.discount)}</span></div>` : ''}<div class="row total"><strong>TOTAL</strong><strong>${rupiah(order.total)}</strong></div><div class="row"><span>Pembayaran</span><span>${order.payment}</span></div>${cashRows}</div><div class="footer"><p>Nomor antrean</p><div class="queue">${escapeHTML(order.id)}</div><p>Terima kasih. Sampai bertemu lagi!</p><button class="no-print" onclick="window.print()">Cetak nota</button></div><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));<\/script></body></html>`);
  receipt.document.close(); receipt.focus();
}

function elapsed(ts) { const minutes = Math.max(0, Math.floor((Date.now() - ts) / 60000)); return `${String(minutes).padStart(2,'0')}:${String(Math.floor((Date.now()-ts)/1000)%60).padStart(2,'0')}`; }
function renderKDS() {
  const active = state.orders.filter(o => ['new','making','ready'].includes(o.status));
  $('#kds-count').textContent = active.length;
  const making = active.filter(o=>o.status==='making'); const avgLabel = active.length ? 'Berjalan' : '—';
  $('#kds-stats').innerHTML = [
    ['Pesanan aktif', active.length, '#b54a2b'], ['Baru', active.filter(o=>o.status==='new').length, '#d79843'], ['Sedang dibuat', making.length, '#397461'], ['Waktu produksi', avgLabel, '#7565a0']
  ].map(x=>`<div class="mini-stat" style="--dot:${x[2]}"><div><small>${x[0]}</small><strong>${x[1]}</strong></div><i></i></div>`).join('');
  const cols = [ ['new','Pesanan baru','Mulai buat'], ['making','Sedang dibuat','Tandai siap'], ['ready','Siap diambil','Selesaikan'] ];
  $('#kanban').innerHTML = cols.map(([status,label,action]) => {
    const items = active.filter(o=>o.status===status);
    return `<div class="kanban-column"><div class="kanban-head"><h3>${label}</h3><span>${items.length}</span></div>${items.length ? items.map(o=>`<article class="ticket ${(Date.now()-o.created)>7*60000?'urgent':''}"><div class="ticket-top"><div class="queue-number">#${o.id}</div><span class="timer">${elapsed(o.created)}</span></div><div class="ticket-name">${o.customer} · ${o.payment}</div><div class="ticket-items">${o.items.map(i=>`<div class="ticket-item"><strong>${i.qty}×</strong><div>${i.name}<small>${i.mods}</small></div></div>`).join('')}</div><button class="ticket-action ${status!=='new'?'filled':''}" data-order="${orderRef(o)}" data-status="${status}">${action}</button></article>`).join('') : `<div class="column-empty">Tidak ada pesanan</div>`}</div>`;
  }).join('');
}

function updateOrder(id, current) {
  const order = state.orders.find(o => orderRef(o) === id); if (!order) return;
  order.status = current === 'new' ? 'making' : current === 'making' ? 'ready' : 'done'; order.statusHistory ||= [{ status: 'new', at: order.created, user: order.cashier }]; order.statusHistory.push({ status: order.status, at: Date.now(), user: currentUser?.name || 'Barista' }); save(); renderKDS(); renderTransactions();
  toast(order.status === 'making' ? `Pesanan #${order.id} mulai dibuat` : order.status === 'ready' ? `Pesanan #${order.id} siap diambil` : `Pesanan #${order.id} selesai`, '▣');
}

function stockStatus(item) { const ratio = item.min > 0 ? item.stock / item.min : Infinity; return ratio < .75 ? ['Kritis','danger'] : ratio < 1.15 ? ['Menipis','warning'] : ['Aman','']; }
function ingredientCostLabel(item) {
  const price = Number(item.costPrice) || 0; const size = Number(item.packageSize) || 0;
  if (price > 0 && size > 0) return `<strong>${rupiah(price)}</strong><small>/ ${escapeHTML(formatQuantity(size, item.unit))}</small>`;
  const rows = state.recipes.flatMap(recipe => recipe.components).filter(component => String(component.ingredientId) === String(item.id));
  if (!rows.length) return '<span class="muted-cell">Belum ada harga acuan</span>';
  const prices = [...new Set(rows.map(component => Math.round(Number(component.costPrice))))].sort((a, b) => a - b);
  const sizes = [...new Set(rows.map(component => formatQuantity(component.packageSize, component.unit)))];
  const priceLabel = prices.length === 1 ? rupiah(prices[0]) : `${rupiah(prices[0])}–${rupiah(prices.at(-1))}`;
  return `<strong>${priceLabel}</strong><small>${sizes.length === 1 ? `/ ${escapeHTML(sizes[0])}` : `${prices.length} harga pada resep`}</small>`;
}
function premixCostLabel(item) {
  const unitCost = inventoryUnitCost(item);
  if (!(unitCost > 0)) return '<span class="muted-cell">Harga bahan murni belum lengkap</span>';
  return `<strong>${rupiah(unitCost)}</strong><small>/ ${escapeHTML(canonicalUnit(item.unit))}</small>`;
}
function premixCompositionLabel(item) {
  const parts = (item.components || []).map(component => {
    const pure = itemById(component.ingredientId);
    return pure ? `${escapeHTML(pure.name)} ${escapeHTML(formatQuantity(component.qty, component.unit))}` : '<span class="muted-cell">Bahan dihapus</span>';
  }).filter(Boolean);
  if (!parts.length) return '<span class="muted-cell">Komposisi belum diisi</span>';
  return `<div class="premix-composition">${parts.join(' · ')}</div><small>Hasil ${escapeHTML(formatQuantity(item.yieldQty || 1, item.unit))} per batch</small>`;
}
function renderInventory(filter = '') {
  const pureItems = state.inventory.filter(item => !isPremixItem(item));
  const premixItems = state.inventory.filter(isPremixItem);
  const critical = state.inventory.filter(item => Number(item.stock) < Number(item.min)).length;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayMovements = state.inventoryMovements.filter(item => item.createdAt >= today.getTime());
  const stockIn = todayMovements.filter(item => item.mode === 'add' || item.mode === 'production' || (item.mode === 'set' && item.after > item.before)).length;
  const stockOut = todayMovements.filter(item => item.mode === 'subtract' || (item.mode === 'set' && item.after < item.before)).length;
  $('#inventory-metrics').innerHTML = [
    ['◇', pureItems.length, 'Bahan baku murni', '#efe7de', '#775640'], ['◈', premixItems.length, 'Bahan baku premix', '#fbf3dd', '#9a6b10'], ['!', critical, 'Perlu restock', '#f8e5e3', '#b83d3d'], ['↘', stockOut, 'Stok keluar hari ini', '#e7f1ed', '#397461']
  ].map(([icon,value,label,tone,accent])=>`<div class="metric-card"><div class="metric-top"><span class="metric-icon" style="--tone:${tone};--accent:${accent}">${icon}</span></div><h3>${value}</h3><p>${label}</p></div>`).join('');
  const query = String(filter || '').toLowerCase();
  const matches = item => `${item.name} ${item.sku} ${item.category} ${(item.components || []).map(component => itemById(component.ingredientId)?.name || '').join(' ')}`.toLowerCase().includes(query);
  const pureFiltered = pureItems.filter(matches);
  const premixFiltered = premixItems.filter(matches);
  const pureRows = pureFiltered.map(item => {
    const [label, cls] = stockStatus(item); const percent = item.max > 0 ? Math.max(0, Math.min(100, item.stock / item.max * 100)) : 0;
    return `<tr><td><div class="ingredient-cell"><span class="table-icon">${escapeHTML(item.icon)}</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.sku)}</small></span></div></td><td>${escapeHTML(item.category)}</td><td><strong>${formatQuantity(item.stock, item.unit)}</strong><div class="stock-bar"><i style="width:${percent}%;--bar:${cls==='danger'?'#b83d3d':cls==='warning'?'#d6992d':'#397461'}"></i></div></td><td>${ingredientCostLabel(item)}</td><td>${formatQuantity(item.min, item.unit)}</td><td><span class="status-badge ${cls}">● ${label}</span></td><td><div class="inventory-actions"><button data-stock-adjust="${item.id}">± Stok</button><button data-inventory-edit="${item.id}">✎ Edit</button></div></td></tr>`;
  }).join('');
  const premixRows = premixFiltered.map(item => {
    const [label, cls] = stockStatus(item); const percent = item.max > 0 ? Math.max(0, Math.min(100, item.stock / item.max * 100)) : 0;
    return `<tr><td><div class="ingredient-cell"><span class="table-icon premix-icon">${escapeHTML(item.icon || '◈')}</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.sku)}</small></span></div></td><td>${premixCompositionLabel(item)}</td><td><strong>${formatQuantity(item.stock, item.unit)}</strong><div class="stock-bar"><i style="width:${percent}%;--bar:${cls==='danger'?'#b83d3d':cls==='warning'?'#d6992d':'#397461'}"></i></div></td><td>${premixCostLabel(item)}</td><td>${formatQuantity(item.min, item.unit)}</td><td><span class="status-badge ${cls}">● ${label}</span></td><td><div class="inventory-actions"><button data-premix-produce="${item.id}">▣ Buat</button><button data-stock-adjust="${item.id}">± Stok</button><button data-premix-edit="${item.id}">✎ Edit</button></div></td></tr>`;
  }).join('');
  $('#inventory-pure-table').innerHTML = pureRows || `<tr><td colspan="7"><div class="empty-table"><strong>Bahan murni tidak ditemukan</strong><span>Ubah pencarian atau tambahkan bahan murni baru.</span></div></td></tr>`;
  $('#inventory-premix-table').innerHTML = premixRows || `<tr><td colspan="7"><div class="empty-table"><strong>Belum ada bahan premix</strong><span>Tambahkan premix, isi komposisi bahan murni, lalu lakukan produksi.</span></div></td></tr>`;
  const count = $('#premix-count'); if (count) count.textContent = `${premixItems.length} premix`;
}

function renderCustomers(filter = '') {
  const totalPoints = state.customers.reduce((s,c)=>s+c.points,0);
  const repeatCustomers = state.customers.filter(c=>c.visits>1).length;
  const repeatRate = state.customers.length ? Math.round(repeatCustomers/state.customers.length*100) : 0;
  const totalCustomerSpend = state.customers.reduce((s,c)=>s+c.spent,0);
  const averageSpend = state.customers.length ? Math.round(totalCustomerSpend/state.customers.length) : 0;
  $('#customer-metrics').innerHTML = [
    ['♙', state.customers.length, 'Total member', '#efe7de', '#775640', 'Mulai dari 0'], ['✦', totalPoints.toLocaleString('id-ID'), 'Poin aktif', '#fbf3dd', '#9a6b10', 'Tercatat otomatis'], ['↺', `${repeatRate}%`, 'Repeat customer', '#e7f1ed', '#397461', `${repeatCustomers} pelanggan`], ['◇', rupiah(averageSpend), 'Belanja rata-rata', '#eee9f7', '#6c5b95', 'Per member']
  ].map(([icon,value,label,tone,accent,delta])=>`<div class="metric-card"><div class="metric-top"><span class="metric-icon" style="--tone:${tone};--accent:${accent}">${icon}</span><span class="metric-delta">${delta}</span></div><h3>${value}</h3><p>${label}</p></div>`).join('');
  const filtered = state.customers.filter(c=>`${c.name} ${c.phone}`.toLowerCase().includes(filter.toLowerCase()));
  $('#customer-table').innerHTML = filtered.length ? filtered.map(c=>`<tr><td><div class="person-cell"><span class="person-avatar" style="--bg:${c.bg};--fg:${c.fg}">${c.initials}</span><span><strong>${escapeHTML(c.name)}</strong><small>Member sejak ${new Intl.DateTimeFormat('id-ID',{month:'short',year:'numeric'}).format(new Date(c.createdAt||Date.now()))}</small></span></div></td><td>${escapeHTML(c.phone || '—')}</td><td>${c.visits}×</td><td>${rupiah(c.spent)}</td><td><strong>${c.points.toLocaleString('id-ID')}</strong></td><td><span class="status-badge ${c.tier==='Gold'?'warning':''}">${c.tier}</span></td><td><div class="history-actions"><button data-customer-edit="${c.id}" title="Edit data pelanggan">✎ Edit</button></div></td></tr>`).join('') : `<tr><td colspan="7"><div class="empty-table"><strong>Belum ada pelanggan</strong><span>Member yang ditambahkan akan muncul di sini.</span></div></td></tr>`;
}

const TRANSACTION_STATUS = { new: ['Baru', 'warning'], making: ['Dibuat', ''], ready: ['Siap', ''], done: ['Selesai', ''] };
const orderItemCount = order => order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
const orderHpp = order => Number(order.hppTotal ?? order.items.reduce((sum, item) => sum + Number(item.lineHpp || 0), 0));
const orderWorkerHpp = order => order.items.reduce((sum, item) => { if (item.lineWorkerCost != null) return sum + Number(item.lineWorkerCost || 0); const recipe = recipeForProduct(item.productId); return sum + recipeWorkerCost(recipe) * Number(item.qty || 0); }, 0);
const itemHasHpp = item => Object.prototype.hasOwnProperty.call(item, 'unitHpp') ? Number(item.unitHpp || 0) > 0 : recipeHpp(recipeForProduct(item.productId)) > 0;
const isDrinkItem = item => products.find(product => String(product.id) === String(item.productId))?.type !== 'retail';
function transactionDateTime(timestamp) { return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(timestamp)); }
function orderShiftLabel(order) {
  const shift = state.shifts.find(item => item.id === order.shiftId); if (!shift) return 'Shift lama (belum terlacak)';
  const number = state.shifts.findIndex(item => item.id === shift.id) + 1; const time = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date(shift.startedAt));
  return `Shift #${number} · ${time}`;
}

function getFilteredTransactions() {
  const query = ($('#transaction-search')?.value || '').trim().toLowerCase();
  const from = $('#transaction-date-from')?.value ? new Date(`${$('#transaction-date-from').value}T00:00:00`).getTime() : null;
  const to = $('#transaction-date-to')?.value ? new Date(`${$('#transaction-date-to').value}T23:59:59.999`).getTime() : null;
  const cashier = $('#transaction-cashier')?.value || ''; const payment = $('#transaction-payment')?.value || ''; const status = $('#transaction-status')?.value || '';
  return state.orders.filter(order => {
    const searchable = `${order.id} ${order.customer} ${order.cashier} ${order.payment} ${order.items.map(item => item.name).join(' ')}`.toLowerCase();
    return (!query || searchable.includes(query)) && (!from || order.created >= from) && (!to || order.created <= to) && (!cashier || order.cashier === cashier) && (!payment || order.payment === payment) && (!status || order.status === status);
  }).sort((a, b) => b.created - a.created);
}

function renderTransactions() {
  const cashierSelect = $('#transaction-cashier'); if (!cashierSelect) return;
  const selectedCashier = cashierSelect.value; const cashiers = [...new Set(state.orders.map(order => order.cashier).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  cashierSelect.innerHTML = `<option value="">Semua kasir</option>${cashiers.map(name => `<option value="${escapeHTML(name)}" ${name === selectedCashier ? 'selected' : ''}>${escapeHTML(name)}</option>`).join('')}`;
  const orders = getFilteredTransactions(); const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0); const itemCount = orders.reduce((sum, order) => sum + orderItemCount(order), 0); const hpp = orders.reduce((sum, order) => sum + orderHpp(order), 0); const average = orders.length ? Math.round(revenue / orders.length) : 0;
  $('#transaction-metrics').innerHTML = [
    ['▤', orders.length, 'Transaksi ditemukan', '#efe7de', '#775640'], ['◇', itemCount, 'Item terjual', '#fbf3dd', '#9a6b10'], ['↗', rupiah(revenue), 'Nilai transaksi', '#e7f1ed', '#397461'], ['◎', rupiah(average), 'Rata-rata transaksi', '#eee9f7', '#6c5b95']
  ].map(([icon,value,label,tone,accent])=>`<div class="metric-card"><div class="metric-top"><span class="metric-icon" style="--tone:${tone};--accent:${accent}">${icon}</span></div><h3>${value}</h3><p>${label}</p></div>`).join('');
  $('#transaction-result-label').textContent = `${orders.length} transaksi · ${itemCount} item · HPP ${rupiah(hpp)}`; $('#transaction-filter-total').textContent = rupiah(revenue);
  $('#transaction-table').innerHTML = orders.length ? orders.map(order => {
    const [statusLabel, statusClass] = TRANSACTION_STATUS[order.status] || [order.status || '—', ''];
    const time = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date(order.created));
    const date = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(order.created));
    return `<tr><td><strong>${time}</strong><small>${date}</small></td><td><strong>#${escapeHTML(order.id)}</strong><small>${escapeHTML(orderShiftLabel(order))}</small></td><td>${escapeHTML(order.cashier || '—')}</td><td>${escapeHTML(order.customer || 'Guest')}</td><td><strong>${orderItemCount(order)} item</strong></td><td><span class="payment-chip">${escapeHTML(order.payment)}</span></td><td><strong>${rupiah(order.total)}</strong></td><td><span class="status-badge ${statusClass}">● ${escapeHTML(statusLabel)}</span></td><td><div class="history-actions"><button data-history-detail="${orderRef(order)}">Detail</button><button data-history-print="${orderRef(order)}" title="Cetak ulang nota">▤</button>${isSysadmin() ? `<button class="danger-action" data-transaction-delete="${orderRef(order)}" title="Hapus transaksi">Hapus</button>` : ''}</div></td></tr>`;
  }).join('') : `<tr><td colspan="9"><div class="empty-table"><strong>Tidak ada transaksi yang cocok</strong><span>Ubah kata kunci atau filter tanggal, kasir, pembayaran, dan status.</span></div></td></tr>`;
}

function showTransactionDetail(order) {
  if (!order) return;
  const [statusLabel, statusClass] = TRANSACTION_STATUS[order.status] || [order.status || '—', '']; const hpp = orderHpp(order); const profit = Number(order.total || 0) - hpp;
  const itemRows = order.items.map(item => `<tr><td><strong>${item.qty}× ${escapeHTML(item.name)}</strong><small>${escapeHTML(item.mods || 'Tanpa modifikasi')}</small></td><td>${rupiah(item.unitPrice ?? item.lineTotal / item.qty)}</td><td>${rupiah(item.lineTotal)}</td></tr>`).join('');
  const history = order.statusHistory?.length ? order.statusHistory : [{ status: 'new', at: order.created, user: order.cashier }];
  const timeline = history.map(entry => { const [label] = TRANSACTION_STATUS[entry.status] || [entry.status]; return `<div class="history-step"><i></i><span><strong>${escapeHTML(label)}</strong><small>${transactionDateTime(entry.at)} · ${escapeHTML(entry.user || 'Sistem')}</small></span></div>`; }).join('');
  const paymentDetail = order.payment === 'Tunai' ? `<div><span>Diterima</span><strong>${rupiah(order.paymentDetail?.received || order.total)}</strong></div><div><span>Kembalian</span><strong>${rupiah(order.paymentDetail?.change || 0)}</strong></div>` : `<div><span>Referensi QRIS</span><strong>${escapeHTML(order.paymentDetail?.reference || '—')}</strong></div>`;
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Transaksi #${escapeHTML(order.id)}</h2><p>${transactionDateTime(order.created)} · ${escapeHTML(order.cashier || '—')} · ${escapeHTML(orderShiftLabel(order))}</p></div><button class="modal-close">×</button></div><div class="modal-body"><div class="transaction-detail-head"><div><span>Status</span><strong><span class="status-badge ${statusClass}">● ${escapeHTML(statusLabel)}</span></strong></div><div><span>Pelanggan</span><strong>${escapeHTML(order.customer || 'Guest')}</strong></div><div><span>Pembayaran</span><strong>${escapeHTML(order.payment)}</strong></div><div><span>Jumlah item</span><strong>${orderItemCount(order)}</strong></div></div><div class="table-wrap transaction-items"><table><thead><tr><th>Item</th><th>Harga</th><th>Jumlah</th></tr></thead><tbody>${itemRows}</tbody></table></div><div class="transaction-detail-grid"><div class="transaction-finance"><div><span>Subtotal</span><strong>${rupiah(order.subtotal)}</strong></div>${order.discount ? `<div><span>Diskon${order.promoCode ? ` · ${escapeHTML(order.promoCode)}` : ''}</span><strong>−${rupiah(order.discount)}</strong></div>` : ''}<div class="grand"><span>Total</span><strong>${rupiah(order.total)}</strong></div><div><span>HPP tercatat (incl. bonus)</span><strong>${rupiah(hpp)}</strong></div><div><span>Bonus pekerja dalam HPP</span><strong>${rupiah(orderWorkerHpp(order))}</strong></div><div><span>Laba kotor</span><strong>${rupiah(profit)}</strong></div>${paymentDetail}</div><div class="transaction-timeline"><h3>Jejak pesanan</h3>${timeline}</div></div></div><div class="modal-footer"><button class="button-ghost modal-close">Kembali</button><button class="button-primary" id="history-print-detail">▤ Cetak ulang nota</button></div>`, true);
  $('#history-print-detail').addEventListener('click', () => printReceipt(order));
}

function exportTransactions() {
  const orders = getFilteredTransactions(); if (!orders.length) return toast('Tidak ada transaksi untuk diekspor', '!');
  const rows = [['Order','Shift','Tanggal','Waktu','Kasir','Pelanggan','Jumlah item','Pembayaran','Status','Subtotal','Diskon','Total','HPP','Laba kotor'], ...orders.map(order => { const date = new Date(order.created); return [order.id, orderShiftLabel(order), new Intl.DateTimeFormat('id-ID',{dateStyle:'short',timeZone:'Asia/Jakarta'}).format(date), new Intl.DateTimeFormat('id-ID',{timeStyle:'short',timeZone:'Asia/Jakarta'}).format(date), order.cashier, order.customer, orderItemCount(order), order.payment, TRANSACTION_STATUS[order.status]?.[0] || order.status, order.subtotal, order.discount, order.total, orderHpp(order), Number(order.total)-orderHpp(order)]; })];
  const csv = rows.map(row => row.map(value => { let safe = String(value ?? ''); if (/^[=+\-@]/.test(safe)) safe = `'${safe}`; return `"${safe.replaceAll('"','""')}"`; }).join(',')).join('\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); link.download = `riwayat-transaksi-sorgtime-${new Date().toISOString().slice(0,10)}.csv`; link.click(); URL.revokeObjectURL(link.href); toast(`${orders.length} transaksi berhasil diekspor`, '⇩');
}

async function verifyCurrentPassword(password) {
  if (!currentUser) return { ok: false, message: 'Sesi pengguna tidak ditemukan' };
  if (authBackendReady) {
    const result = await cloud.signIn(currentUser.username, password);
    return result.ok ? { ok: true } : { ok: false, message: 'Password akun tidak sesuai' };
  }
  if (!currentUser.salt || !currentUser.passwordHash) return { ok: false, message: 'Password akun tidak dapat diverifikasi' };
  const inputHash = await hashPassword(password, currentUser.salt);
  return inputHash === currentUser.passwordHash ? { ok: true } : { ok: false, message: 'Password akun tidak sesuai' };
}

function showDeleteTransaction(order) {
  if (!order) return toast('Data transaksi tidak ditemukan', '!');
  if (!isSysadmin()) return toast('Hanya sysadmin yang dapat menghapus transaksi', '!');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Hapus transaksi #${escapeHTML(order.id)}</h2><p>${transactionDateTime(order.created)} · ${escapeHTML(order.cashier || '—')} · ${rupiah(order.total)}</p></div><button class="modal-close">×</button></div><form id="delete-transaction-form"><div class="modal-body"><div class="notice danger-notice"><strong>Data transaksi akan dihapus permanen.</strong><span>Stok bahan dan data pelanggan tidak dikembalikan otomatis. Konfirmasi dengan password akun sysadmin yang sedang aktif.</span></div><div class="field"><label>Password akun @${escapeHTML(currentUser.username)}</label><input name="password" type="password" required autofocus autocomplete="current-password" placeholder="Masukkan password Anda"></div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Hapus transaksi</button></div></form>`);
  $('#delete-transaction-form').addEventListener('submit', async event => {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get('password') || '');
    if (!password) return toast('Masukkan password akun Anda', '!');
    const submit = event.currentTarget.querySelector('button[type="submit"]');
    const originalLabel = submit.textContent;
    submit.disabled = true; submit.textContent = 'Memeriksa password...';
    const verified = await verifyCurrentPassword(password);
    if (!verified.ok) { submit.disabled = false; submit.textContent = originalLabel; return toast(verified.message, '!'); }
    state.orders = state.orders.filter(item => orderRef(item) !== orderRef(order));
    save(); closeModal(); renderAll(); toast(`Transaksi #${order.id} berhasil dihapus`, '⌫');
  });
}

function canManageUser(user) {
  if (!currentUser || user.id === currentUser.id) return false;
  if (user.role === 'sysadmin') return false;
  if (currentUser.role === 'sysadmin') return true;
  return currentUser.role === 'admin' && user.role === 'barista';
}

function renderAccounts(filter = '') {
  if (!currentUser || !canAccess('accounts')) return;
  $('#role-overview').innerHTML = Object.entries(ROLE_LABELS).map(([role,label]) => `<article class="role-card"><div><span>${label}</span><strong>${authUsers.filter(user=>user.role===role).length}</strong></div><p>${ROLE_DESCRIPTIONS[role]}</p></article>`).join('');
  const query = filter.toLowerCase();
  const visibleUsers = authUsers.filter(user => currentUser.role === 'sysadmin' || user.role === 'barista' || user.id === currentUser.id).filter(user => `${user.name} ${user.username}`.toLowerCase().includes(query));
  $('#account-table').innerHTML = visibleUsers.map(user => {
    const manageable = canManageUser(user); const initials = user.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
    return `<tr><td><div class="person-cell"><span class="person-avatar">${initials}</span><span><strong>${escapeHTML(user.name)}${user.id===currentUser.id?' · Anda':''}</strong><small>${ROLE_DESCRIPTIONS[user.role]}</small></span></div></td><td><strong>@${escapeHTML(user.username)}</strong></td><td><span class="role-pill ${user.role}">${ROLE_LABELS[user.role]}</span></td><td><span class="status-badge ${user.status==='active'?'':'danger'}">● ${user.status==='active'?'Aktif':'Nonaktif'}</span></td><td>${new Intl.DateTimeFormat('id-ID',{dateStyle:'medium'}).format(new Date(user.createdAt))}</td><td>${manageable ? `<div class="account-actions"><button data-account-edit="${user.id}" title="Edit akun atau reset password">Edit</button><button data-account-toggle="${user.id}" title="Ubah status">${user.status==='active'?'Nonaktifkan':'Aktifkan'}</button><button data-account-delete="${user.id}" title="Hapus akun">Hapus</button></div>` : '<span class="protected-label">Dilindungi</span>'}</td></tr>`;
  }).join('');
}

function showAccountForm() {
  if (!currentUser || !['sysadmin','admin'].includes(currentUser.role)) return;
  const roles = currentUser.role === 'sysadmin' ? ['sysadmin','admin','barista'] : ['barista'];
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Buat akun</h2><p>Tentukan identitas dan hak akses pengguna</p></div><button class="modal-close">×</button></div><form id="account-form"><div class="modal-body"><div class="form-grid"><div class="field"><label>Nama lengkap</label><input name="name" required placeholder="Nama pengguna"></div><div class="field"><label>Username</label><input name="username" required minlength="3" placeholder="huruf kecil tanpa spasi"></div><div class="field"><label>Peran</label><select name="role">${roles.map(role=>`<option value="${role}">${ROLE_LABELS[role]}</option>`).join('')}</select></div><div class="field"><label>Password awal</label><input name="password" type="password" required minlength="6" placeholder="Minimal 6 karakter"></div></div><div class="permission-preview">${roles.map(role=>`<div><strong>${ROLE_LABELS[role]}</strong><span>${ROLE_DESCRIPTIONS[role]}</span></div>`).join('')}</div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Buat akun</button></div></form>`);
  $('#account-form').addEventListener('submit', async event => {
    event.preventDefault(); const data=new FormData(event.currentTarget); const username=data.get('username').trim().toLowerCase(); const role=data.get('role');
    if (!roles.includes(role)) return toast('Anda tidak berhak membuat peran tersebut','!');
    if (!/^[a-z0-9._-]{3,24}$/.test(username)) return toast('Format username tidak valid','!');
    if (authUsers.some(user=>user.username===username)) return toast('Username sudah digunakan','!');
    if (authBackendReady) {
      const created = await cloud.createAuthUser(username, data.get('password'));
      if (!created.ok) return toast(created.message, '!');
      const saved = await cloud.saveProfile({ id: created.userId, name: data.get('name').trim(), username, role, status: 'active' });
      if (!saved.ok) return toast(saved.message, '!');
      const profiles = await cloud.loadProfiles();
      if (profiles.ok) { authUsers = profiles.users; cacheProfiles(); }
      closeModal(); renderAccounts(); toast(`Akun ${ROLE_LABELS[role]} berhasil dibuat`,'♙');
      return;
    }
    const salt=randomSalt(); const passwordHash=await hashPassword(data.get('password'),salt);
    authUsers.push({id:crypto.randomUUID(),name:data.get('name').trim(),username,role,status:'active',salt,passwordHash,createdAt:Date.now(),createdBy:currentUser.id});
    saveUsers(); closeModal(); renderAccounts(); toast(`Akun ${ROLE_LABELS[role]} berhasil dibuat`,'♙');
  });
}

function showAccountEdit(user) {
  if (!canManageUser(user)) return toast('Akun ini tidak dapat diubah dari menu akun', '!');
  const roleChoices = currentUser.role === 'sysadmin' ? ['admin', 'barista'] : ['barista'];
  const roleOptions = roleChoices.map(role => `<option value="${role}" ${user.role === role ? 'selected' : ''}>${ROLE_LABELS[role]}</option>`).join('');
  const usernameNote = authBackendReady
    ? 'Username tidak dapat diubah karena dipakai sebagai email login.'
    : 'Username hanya boleh berisi huruf kecil, angka, titik, garis bawah, atau tanda minus.';
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Edit akun</h2><p>${escapeHTML(user.name)} · @${escapeHTML(user.username)}</p></div><button class="modal-close">×</button></div><form id="account-edit-form"><div class="modal-body"><div class="form-grid"><div class="field"><label>Nama lengkap</label><input name="name" required maxlength="60" value="${escapeHTML(user.name)}"></div><div class="field"><label>Username</label><input name="username" minlength="3" maxlength="24" value="${escapeHTML(user.username)}" ${authBackendReady ? 'readonly' : ''}></div><div class="field"><label>Peran</label><select name="role">${roleOptions}</select></div><div class="field"><label>Status</label><select name="status"><option value="active" ${user.status === 'active' ? 'selected' : ''}>Aktif</option><option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Nonaktif</option></select></div><div class="field full"><label>Password baru (opsional)</label><input name="password" type="password" minlength="6" autocomplete="new-password" placeholder="Kosongkan jika tidak diubah"></div></div><div class="notice">${authBackendReady ? 'Password baru langsung menggantikan password pengguna. Sampaikan password baru secara langsung kepada pengguna.' : 'Password baru disimpan di perangkat ini.'} ${usernameNote}</div><div class="notice">Akun <strong>sysadmin</strong> tidak dapat diubah dari menu ini.</div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Simpan perubahan</button></div></form>`);
  $('#account-edit-form').addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim(); const username = data.get('username').trim().toLowerCase();
    const role = data.get('role'); const status = data.get('status'); const password = String(data.get('password') || '');
    if (!name) return toast('Nama lengkap wajib diisi', '!');
    if (!roleChoices.includes(role)) return toast('Peran tidak diizinkan', '!');
    if (password && password.length < 6) return toast('Password minimal 6 karakter', '!');
    if (authBackendReady) {
      const result = await cloud.adminManageAccount(user.id, { name, role, status, password: password || null });
      if (!result.ok) return toast(result.message, '!');
      const profiles = await cloud.loadProfiles();
      if (profiles.ok) { authUsers = profiles.users; cacheProfiles(); }
      closeModal(); renderAccounts(); toast('Akun berhasil diperbarui', '♙');
      return;
    }
    if (!/^[a-z0-9._-]{3,24}$/.test(username)) return toast('Format username tidak valid', '!');
    if (authUsers.some(item => item.id !== user.id && item.username === username)) return toast('Username sudah digunakan', '!');
    user.name = name; user.username = username; user.role = role; user.status = status;
    if (password) { user.salt = randomSalt(); user.passwordHash = await hashPassword(password, user.salt); }
    saveUsers(); closeModal(); renderAccounts(); toast('Akun berhasil diperbarui', '♙');
  });
}

function jakartaDateKey(timestamp = Date.now()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Jakarta' }).formatToParts(new Date(timestamp)).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
const dateFromKey = key => new Date(`${key}T00:00:00+07:00`);
const shiftDateKey = (key, days) => { const date = dateFromKey(key); date.setUTCDate(date.getUTCDate() + days); return jakartaDateKey(date); };
function reportDateKeys(from, to) { const keys = []; let key = from; while (key <= to && keys.length < 366) { keys.push(key); key = shiftDateKey(key, 1); } return keys; }
function ensureReportFilters() {
  const from = $('#report-date-from'); const to = $('#report-date-to'); if (!from || !to) return;
  const today = jakartaDateKey(); if (!from.value) from.value = today; if (!to.value) to.value = today;
}
function orderCupCount(order) {
  return order.items.reduce((sum, item) => { const product = products.find(entry => String(entry.id) === String(item.productId)); return sum + (product?.type === 'retail' ? 0 : Number(item.qty || 0)); }, 0);
}
function dailyBasePay(dateKey) {
  const [year, month] = dateKey.split('-').map(Number); const daysInMonth = new Date(year, month, 0).getDate(); const workDays = Math.max(1, daysInMonth - Number(state.payrollSettings.monthlyOffDays || 0));
  return Number(state.payrollSettings.monthlyBase || 0) / workDays;
}
function payrollManualFor(userId, from, to) {
  if (!userId) return null;
  return (state.payrollManual || []).find(entry => entry.userId === userId && entry.periodFrom === from && entry.periodTo === to) || null;
}
function reportPayroll(dateKeys, cashierFilter = '', sourceOrders = null) {
  const allowed = new Set(dateKeys); const records = new Map(); const periodFrom = dateKeys[0] || jakartaDateKey(); const periodTo = dateKeys[dateKeys.length - 1] || periodFrom;
  const getRecord = (id, name) => { const user = authUsers.find(entry => entry.id === id); const key = id || `name:${name}`; if (!records.has(key)) records.set(key, { id, name: name || user?.name || 'Tanpa nama', role: user?.role || 'admin', days: new Set(), cupsByDay: new Map() }); return records.get(key); };
  authUsers.filter(user => user.status !== 'inactive' && (!cashierFilter || user.name === cashierFilter)).forEach(user => getRecord(user.id, user.name));
  (sourceOrders || state.orders).filter(order => allowed.has(jakartaDateKey(order.created)) && (!cashierFilter || order.cashier === cashierFilter)).forEach(order => { const day = jakartaDateKey(order.created); const userId = order.cashierId || authUsers.find(user => user.name === order.cashier)?.id || null; const record = getRecord(userId, order.cashier); record.days.add(day); record.cupsByDay.set(day, (record.cupsByDay.get(day) || 0) + orderCupCount(order)); });
  state.shifts.filter(shift => allowed.has(jakartaDateKey(shift.startedAt)) && (!cashierFilter || shift.startedBy === cashierFilter)).forEach(shift => getRecord(shift.startedById, shift.startedBy).days.add(jakartaDateKey(shift.startedAt)));
  state.attendance.filter(entry => allowed.has(entry.date)).forEach(entry => { const user = authUsers.find(item => item.id === entry.userId); if (!user || (cashierFilter && user.name !== cashierFilter)) return; const record = getRecord(user.id, user.name); if (entry.status === 'present') record.days.add(entry.date); else record.days.delete(entry.date); });
  return [...records.values()].map(record => {
    const cups = [...record.cupsByDay.values()].reduce((sum, value) => sum + value, 0);
    const autoBasePay = [...record.days].reduce((sum, day) => sum + dailyBasePay(day), 0);
    const autoBonus = cups * Number(state.payrollSettings.cupBonus || 0);
    const manual = state.payrollSettings.mode === 'manual' ? payrollManualFor(record.id, periodFrom, periodTo) : null;
    const basePay = manual ? Math.max(0, Number(manual.basePay || 0)) : autoBasePay;
    const bonus = manual ? Math.max(0, Number(manual.bonus || 0)) : autoBonus;
    return { ...record, workDays: record.days.size, cups, autoBasePay, autoBonus, autoTotal: autoBasePay + autoBonus, basePay, bonus, total: basePay + bonus, manual: Boolean(manual), manualNote: manual?.note || '' };
  }).sort((a, b) => b.total - a.total);
}
function reportData() {
  ensureReportFilters(); let from = $('#report-date-from').value; let to = $('#report-date-to').value; if (from > to) [from, to] = [to, from];
  const cashier = $('#report-cashier').value; const payment = $('#report-payment').value; const dateKeys = reportDateKeys(from, to); const allowed = new Set(dateKeys);
  const dateOrders = state.orders.filter(order => allowed.has(jakartaDateKey(order.created)) && (!cashier || order.cashier === cashier));
  const orders = dateOrders.filter(order => !payment || order.payment === payment);
  const purchases = state.inventoryMovements.filter(movement => movement.mode === 'add' && allowed.has(jakartaDateKey(movement.createdAt)));
  const coveredPayments = state.payrollPayments.filter(entry => entry.periodFrom >= from && entry.periodTo <= to && (!cashier || authUsers.find(user => user.id === entry.userId)?.name === cashier));
  const payroll = reportPayroll(dateKeys, cashier, dateOrders).map(row => { const paid = coveredPayments.filter(entry => entry.userId === row.id).reduce((sum, entry) => sum + Number(entry.amount || 0), 0); const remaining = Math.max(0, row.total - paid); return { ...row, paid, remaining, overpaid: Math.max(0, paid - row.total), paymentStatus: remaining <= 1 ? 'paid' : paid > 0 ? 'partial' : 'unpaid' }; });
  const actualPayments = state.payrollPayments.filter(entry => allowed.has(entry.paidDate) && (!cashier || authUsers.find(user => user.id === entry.userId)?.name === cashier));
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0); const cashRevenue = dateOrders.reduce((sum, order) => sum + Number(order.total || 0), 0); const hpp = orders.reduce((sum, order) => sum + orderHpp(order), 0); const cups = orders.reduce((sum, order) => sum + orderCupCount(order), 0);
  const basePayTotal = payroll.reduce((sum, row) => sum + row.basePay, 0); const bonusTotal = payroll.reduce((sum, row) => sum + row.bonus, 0); const payrollTotal = basePayTotal + bonusTotal; const payrollPaidTotal = actualPayments.reduce((sum, entry) => sum + Number(entry.amount || 0), 0); const payrollRemainingTotal = payroll.reduce((sum, row) => sum + row.remaining, 0); const bonusForProfit = cups * Number(state.payrollSettings.cupBonus || 0); const hppBonusIncluded = orders.reduce((sum, order) => sum + orderWorkerHpp(order), 0); const bonusHppAdjustment = bonusForProfit - hppBonusIncluded; const purchaseTotal = purchases.reduce((sum, row) => sum + Number(row.purchaseCost || 0), 0); const missingHppCups = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + (!isDrinkItem(item) || itemHasHpp(item) ? 0 : Number(item.qty || 0)), 0), 0);
  const days = dateKeys.map(day => { const dayOrders = orders.filter(order => jakartaDateKey(order.created) === day); const dayAllOrders = dateOrders.filter(order => jakartaDateKey(order.created) === day); const dayBasePay = payroll.reduce((sum, row) => sum + (row.days.has(day) ? dailyBasePay(day) : 0), 0); const dayBonus = payroll.reduce((sum, row) => sum + (row.cupsByDay.get(day) || 0) * Number(state.payrollSettings.cupBonus || 0), 0); const dayProfitBonus = dayOrders.reduce((sum, order) => sum + orderCupCount(order), 0) * Number(state.payrollSettings.cupBonus || 0); const dayBonusIncluded = dayOrders.reduce((sum, order) => sum + orderWorkerHpp(order), 0); const dayBonusAdjustment = dayProfitBonus - dayBonusIncluded; const dayPurchases = purchases.filter(row => jakartaDateKey(row.createdAt) === day).reduce((sum, row) => sum + Number(row.purchaseCost || 0), 0); const dayPayrollPaid = actualPayments.filter(entry => entry.paidDate === day).reduce((sum, entry) => sum + Number(entry.amount || 0), 0); const dayRevenue = dayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0); const dayCashRevenue = dayAllOrders.reduce((sum, order) => sum + Number(order.total || 0), 0); const dayHpp = dayOrders.reduce((sum, order) => sum + orderHpp(order), 0); return { day, orders: dayOrders, transactions: dayOrders.length, cups: dayOrders.reduce((sum, order) => sum + orderCupCount(order), 0), revenue: dayRevenue, cashRevenue: dayCashRevenue, hpp: dayHpp, basePay: dayBasePay, bonus: dayBonus, bonusIncluded: dayBonusIncluded, bonusAdjustment: dayBonusAdjustment, payroll: dayBasePay + dayBonus, payrollPaid: dayPayrollPaid, purchases: dayPurchases, operating: dayRevenue - dayHpp - dayBasePay - dayBonusAdjustment, cashNet: dayCashRevenue - dayPayrollPaid - dayPurchases }; });
  return { from, to, cashier, payment, dateKeys, orders, purchases, payroll, actualPayments, days, revenue, cashRevenue, hpp, cups, basePayTotal, bonusTotal, payrollTotal, payrollPaidTotal, payrollRemainingTotal, hppBonusIncluded, bonusHppAdjustment, purchaseTotal, missingHppCups, grossProfit: revenue - hpp, operating: revenue - hpp - basePayTotal - bonusHppAdjustment, cashNet: cashRevenue - payrollPaidTotal - purchaseTotal, projectedCash: cashRevenue - payrollTotal - purchaseTotal };
}
function changeLabel(current, previous) { if (!previous) return current ? 'Baru' : '—'; const value = (current - previous) / Math.abs(previous) * 100; return `${value >= 0 ? '↑' : '↓'} ${Math.abs(value).toFixed(1)}%`; }
function renderReports() {
  ensureReportFilters(); $('#report-time').textContent = nowTime(); const data = reportData();
  const cashierSelect = $('#report-cashier'); const selectedCashier = cashierSelect.value; const cashiers = [...new Set([...authUsers.filter(user => user.status !== 'inactive').map(user => user.name), ...state.orders.map(order => order.cashier)].filter(Boolean))].sort((a, b) => a.localeCompare(b)); cashierSelect.innerHTML = `<option value="">Semua karyawan</option>${cashiers.map(name => `<option value="${escapeHTML(name)}" ${name === selectedCashier ? 'selected' : ''}>${escapeHTML(name)}</option>`).join('')}`;
  const periodLabel = data.from === data.to ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeZone: 'Asia/Jakarta' }).format(dateFromKey(data.from)) : `${new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(dateFromKey(data.from))} – ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(dateFromKey(data.to))}`; $('#report-period-label').innerHTML = `${periodLabel} · diperbarui <span id="report-time">${nowTime()}</span>`;
  const previousDays = data.dateKeys.map(day => shiftDateKey(day, -data.dateKeys.length)); const previousAllowed = new Set(previousDays); const previousOrders = state.orders.filter(order => previousAllowed.has(jakartaDateKey(order.created)) && (!data.cashier || order.cashier === data.cashier) && (!data.payment || order.payment === data.payment)); const previousRevenue = previousOrders.reduce((sum, order) => sum + Number(order.total || 0), 0); const previousCups = previousOrders.reduce((sum, order) => sum + orderCupCount(order), 0);
  $('#report-metrics').innerHTML = [
    ['↗', rupiah(data.revenue), 'Omzet terfilter', '#e7f1ed', '#397461', changeLabel(data.revenue, previousRevenue)], ['▣', data.orders.length, 'Transaksi', '#efe7de', '#775640', changeLabel(data.orders.length, previousOrders.length)], ['◉', data.cups, 'Cup terjual', '#fbf3dd', '#9a6b10', changeLabel(data.cups, previousCups)], ['◎', rupiah(data.operating), 'Hasil operasional', '#eee9f7', '#6c5b95', 'Setelah seluruh beban']
  ].map(([icon,value,label,tone,accent,delta])=>`<div class="metric-card"><div class="metric-top"><span class="metric-icon" style="--tone:${tone};--accent:${accent}">${icon}</span><span class="metric-delta">${delta}</span></div><h3>${value}</h3><p>${label}</p></div>`).join('');
  const bonusDifference = data.bonusHppAdjustment; const methodWarnings = []; if (data.missingHppCups) methodWarnings.push(`${data.missingHppCups} cup belum memiliki resep HPP lengkap`); if (Math.abs(bonusDifference) > 1) methodWarnings.push(`selisih bonus penjualan terfilter dan bonus dalam HPP ${rupiah(Math.abs(bonusDifference))}`); if (data.payment) methodWarnings.push('filter pembayaran hanya membatasi penjualan; gaji, belanja, dan arus kas tetap memakai seluruh aktivitas periode'); $('#report-method-note').className = `report-method-note ${methodWarnings.length ? 'warning' : ''}`; $('#report-method-note').innerHTML = `<span><strong>Metode perhitungan</strong><span>Laba operasional memakai penjualan dan HPP terfilter. Arus kas aktual memakai seluruh penerimaan, belanja stok, dan pembayaran gaji yang benar-benar dicatat pada periode.</span>${methodWarnings.length ? `<em>${methodWarnings.join(' · ')}.</em>` : '<em>Bonus pekerja sudah direkonsiliasi dan tidak dihitung dua kali.</em>'}</span>${data.missingHppCups && canManageSales() ? '<button data-open-hpp>Lengkapi resep</button>' : ''}`;
  const singleDay = data.dateKeys.length === 1; const chartRows = singleDay ? Array.from({ length: 16 }, (_, index) => { const hour = index + 7; return { label: String(hour).padStart(2, '0'), value: data.orders.filter(order => Number(new Intl.DateTimeFormat('en', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Jakarta' }).format(new Date(order.created))) === hour).reduce((sum, order) => sum + Number(order.total || 0), 0) }; }) : data.days.map(row => ({ label: row.day.slice(5).replace('-', '/'), value: row.revenue }));
  $('#sales-chart-title').textContent = singleDay ? 'Penjualan per jam' : 'Penjualan harian'; $('#sales-chart-subtitle').textContent = singleDay ? 'Tren transaksi sepanjang hari' : `Perbandingan ${data.dateKeys.length} hari terpilih`; $('#bar-chart').classList.toggle('daily-range', !singleDay); const maxChart = Math.max(...chartRows.map(row => row.value), 1); $('#bar-chart').innerHTML = chartRows.map(row => `<div class="bar-group"><div class="bar" style="height:${row.value ? Math.max(8, row.value / maxChart * 100) : 0}%" data-value="${rupiah(row.value)}"></div><span>${row.label}</span></div>`).join('');
  const soldCounts = new Map(); data.orders.flatMap(order => order.items).forEach(item => soldCounts.set(String(item.productId), (soldCounts.get(String(item.productId)) || 0) + Number(item.qty || 0))); const ranking = products.map(product => ({ ...product, sold: soldCounts.get(String(product.id)) || 0 })).filter(product => product.sold).sort((a,b)=>b.sold-a.sold).slice(0,5); $('#ranking-list').innerHTML = ranking.length ? ranking.map((product,index)=>`<div class="rank-row"><span class="rank-number">${index+1}</span><span class="rank-thumb"><img src="${product.image}" alt=""></span><div><h4>${escapeHTML(product.name)}</h4><p>${escapeHTML(product.category)}</p></div><strong>${product.sold}</strong></div>`).join('') : `<div class="empty-inline"><strong>Belum ada penjualan</strong><span>Tidak ada menu terjual pada filter ini.</span></div>`;
  const financeRows = [['LAPORAN LABA',null,'section'],['Omzet penjualan',data.revenue,'income'],['HPP produk (termasuk bonus)',-data.hpp,'cost'],['Porsi bonus di dalam HPP',data.hppBonusIncluded,'included'],['Laba kotor',data.grossProfit,'subtotal'],['Gaji pokok',-data.basePayTotal,'cost']]; if (Math.abs(data.bonusHppAdjustment) > 1) financeRows.push(['Penyesuaian bonus vs HPP',-data.bonusHppAdjustment,data.bonusHppAdjustment > 0 ? 'cost' : 'credit']); financeRows.push(['Laba operasional',data.operating,'grand'],['ARUS KAS AKTUAL',null,'section'],['Penerimaan penjualan (semua metode)',data.cashRevenue,'income'],['Belanja stok dibayar',-data.purchaseTotal,'cost'],['Gaji & bonus sudah dibayar',-data.payrollPaidTotal,'cost'],['Perubahan kas bersih',data.cashNet,'cash-grand'],['ESTIMASI SETELAH KEWAJIBAN',null,'section'],['Hak gaji & bonus periode',-data.payrollTotal,'cost'],['Sisa kas setelah seluruh hak dibayar',data.projectedCash,'cash-grand']); $('#report-finance').innerHTML = financeRows.map(([label,value,kind])=>kind === 'section' ? `<div class="finance-section"><strong>${label}</strong></div>` : `<div class="${kind}"><span>${label}</span><strong>${value < 0 ? '−' : ''}${rupiah(Math.abs(value))}</strong></div>`).join('');
  $('#payroll-total').textContent = `${rupiah(data.payrollRemainingTotal)} sisa`; $('#payroll-table').innerHTML = data.payroll.length ? data.payroll.map(row => { const label = row.paymentStatus === 'paid' ? 'Lunas' : row.paymentStatus === 'partial' ? 'Sebagian' : 'Belum dibayar'; return `<tr><td><strong>${escapeHTML(row.name)}</strong><small>${escapeHTML(ROLE_LABELS[row.role] || row.role)}${row.manual ? ' · Manual' : ''}</small></td><td>${row.workDays}</td><td>${row.cups}</td><td>${rupiah(row.basePay)}</td><td>${rupiah(row.bonus)}</td><td><strong>${rupiah(row.total)}</strong></td><td>${rupiah(row.paid)}</td><td><strong>${rupiah(row.remaining)}</strong>${row.overpaid ? `<small>Lebih ${rupiah(row.overpaid)}</small>` : ''}</td><td><span class="payroll-status ${row.paymentStatus}">${label}</span></td></tr>`; }).join('') : '<tr><td colspan="9"><div class="empty-table"><strong>Belum ada data kehadiran</strong><span>Catat kehadiran karyawan atau buka shift untuk memulai perhitungan.</span></div></td></tr>';
  $('#daily-report-table').innerHTML = data.days.map((row, index) => { const previous = index ? data.days[index - 1].revenue : state.orders.filter(order => jakartaDateKey(order.created) === shiftDateKey(row.day, -1) && (!data.cashier || order.cashier === data.cashier) && (!data.payment || order.payment === data.payment)).reduce((sum, order) => sum + Number(order.total || 0), 0); const comparison = changeLabel(row.revenue, previous); return `<tr><td><strong>${new Intl.DateTimeFormat('id-ID',{weekday:'short',day:'2-digit',month:'short',timeZone:'Asia/Jakarta'}).format(dateFromKey(row.day))}</strong></td><td>${row.transactions}</td><td>${row.cups}</td><td><strong>${rupiah(row.revenue)}</strong></td><td><span class="comparison-chip ${comparison.startsWith('↓') ? 'down' : comparison.startsWith('↑') ? 'up' : ''}">${comparison}</span></td><td>${rupiah(row.hpp)}</td><td>${rupiah(row.basePay)}</td><td>${rupiah(row.bonus)}</td><td>${rupiah(row.purchases)}</td><td>${rupiah(row.payrollPaid)}</td><td><strong class="${row.operating < 0 ? 'negative-value' : ''}">${rupiah(row.operating)}</strong></td><td><strong class="${row.cashNet < 0 ? 'negative-value' : ''}">${rupiah(row.cashNet)}</strong></td></tr>`; }).join('');
  $('#purchase-total').textContent = rupiah(data.purchaseTotal); $('#purchase-report-table').innerHTML = data.purchases.length ? data.purchases.sort((a,b)=>b.createdAt-a.createdAt).map(movement => { const ingredient = state.inventory.find(item => String(item.id) === String(movement.ingredientId)); const user = authUsers.find(item => item.id === movement.userId); return `<tr><td>${transactionDateTime(movement.createdAt)}</td><td><strong>${escapeHTML(ingredient?.name || 'Item dihapus')}</strong></td><td>${formatQuantity(movement.amount, ingredient?.unit || '')}</td><td>${escapeHTML(movement.reference || '—')}</td><td>${escapeHTML(user?.name || 'Sistem')}</td><td><strong>${movement.purchaseCost == null ? '<span class="missing-cost">Belum dicatat</span>' : rupiah(movement.purchaseCost)}</strong></td><td><button class="purchase-edit" data-purchase-edit="${movement.id}">Edit</button></td></tr>`; }).join('') : '<tr><td colspan="7"><div class="empty-table"><strong>Belum ada beban belanja</strong><span>Gunakan Catat belanja atau Tambah stok untuk memasukkan pembelian.</span></div></td></tr>';
  const cash = data.orders.filter(order => order.payment === 'Tunai').reduce((sum,order)=>sum+Number(order.total||0),0); const qris = data.orders.filter(order => order.payment === 'QRIS').reduce((sum,order)=>sum+Number(order.total||0),0); const totalPayment = cash + qris; const cashPct = totalPayment ? Math.round(cash / totalPayment * 100) : 0; const qrisPct = totalPayment ? 100 - cashPct : 0; $('#payment-breakdown').innerHTML = `<div class="payment-total"><div class="donut" style="background:${totalPayment ? `conic-gradient(var(--brand) 0 ${qrisPct}%, #d8a779 ${qrisPct}% 100%)` : '#ded6cb'}"></div><div class="payment-legend"><div class="payment-item"><i style="--color:var(--brand)"></i><span>QRIS</span><strong>${qrisPct}% · ${rupiah(qris)}</strong></div><div class="payment-item"><i style="--color:#d8a779"></i><span>Tunai</span><strong>${cashPct}% · ${rupiah(cash)}</strong></div></div></div>`;
  const latestClosedShift = [...state.shifts].filter(shift => shift.endedAt).sort((a, b) => b.endedAt - a.endedAt)[0]; const missingCosts = data.purchases.filter(row => row.purchaseCost == null).length; const payrollModeLabel = state.payrollSettings.mode === 'manual' ? 'Manual' : 'Otomatis'; $('#health-list').innerHTML = [['◷','Status shift',isShiftActive()?'Aktif':'Tutup'],['✓','Selisih shift terakhir',latestClosedShift ? rupiah(latestClosedShift.cashDifference || 0) : '—'],['♙','Sisa kewajiban gaji',rupiah(data.payrollRemainingTotal)],['◎','Metode gaji',payrollModeLabel],['◷','Jam kerja',`${state.payrollSettings.workStart || '09:00'}–${state.payrollSettings.workEnd || '16:00'} WIB`],['!','Cup tanpa HPP',`${data.missingHppCups} cup`],['!','Belanja tanpa nominal',`${missingCosts} catatan`],['↺','Status sinkronisasi',state.networkOnline?'Tersinkron':'Antre offline']].map(row=>`<div class="health-row"><span class="health-label"><i>${row[0]}</i><span>${row[1]}</span></span><strong>${row[2]}</strong></div>`).join('');
}

function payslipMonth() {
  const input = $('#payslip-month');
  const fallback = jakartaDateKey().slice(0, 7);
  if (!input) return fallback;
  if (!input.value) input.value = fallback;
  return input.value || fallback;
}

function payslipPeriod(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  return { from: `${month}-01`, to: `${month}-${String(daysInMonth).padStart(2, '0')}` };
}

function payslipData(month = payslipMonth()) {
  const { from, to } = payslipPeriod(month);
  const keys = reportDateKeys(from, to);
  const mine = reportPayroll(keys).find(row => row.id === currentUser?.id) || {
    id: currentUser?.id || '', name: currentUser?.name || 'Karyawan', role: currentUser?.role || 'barista',
    days: new Set(), cupsByDay: new Map(), workDays: 0, cups: 0, basePay: 0, bonus: 0, total: 0
  };
  const payments = state.payrollPayments
    .filter(entry => entry.userId === mine.id && entry.periodFrom <= to && entry.periodTo >= from)
    .sort((a, b) => String(b.paidDate || '').localeCompare(String(a.paidDate || '')) || Number(b.createdAt || 0) - Number(a.createdAt || 0));
  const paid = payments.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const cupBonus = Number(state.payrollSettings.cupBonus || 0);
  const manualBasePerDay = mine.manual && mine.workDays ? mine.basePay / mine.workDays : null;
  const days = keys.map(day => {
    const cups = mine.cupsByDay.get(day) || 0;
    return { day, cups, present: mine.days.has(day), basePay: mine.days.has(day) ? (manualBasePerDay ?? dailyBasePay(day)) : 0, bonus: cups * cupBonus };
  });
  return { from, to, mine, payments, paid, total: mine.total, remaining: Math.max(0, mine.total - paid), overpaid: Math.max(0, paid - mine.total), cupBonus, days, workStart: state.payrollSettings.workStart || '09:00', workEnd: state.payrollSettings.workEnd || '16:00' };
}

function payslipMonthLabel(from) {
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(dateFromKey(from));
}

function renderPayslip() {
  const content = $('#payslip-content');
  if (!content) return;
  if (!currentUser) { content.innerHTML = ''; return; }
  const data = payslipData();
  const monthLabel = payslipMonthLabel(data.from);
  const monthlyBase = Number(state.payrollSettings.monthlyBase || 0);
  const monthlyOffDays = Number(state.payrollSettings.monthlyOffDays || 0);
  const monthDays = new Date(Number(data.from.slice(0, 4)), Number(data.from.slice(5, 7)), 0).getDate();
  const workDaysInMonth = Math.max(1, monthDays - monthlyOffDays);
  const status = data.total <= 1 ? 'Belum ada hak gaji' : data.remaining <= 1 ? 'Lunas' : data.paid > 0 ? 'Dibayar sebagian' : 'Belum dibayar';
  const dailyRows = data.days.filter(day => day.present || day.cups);
  const metrics = [
    ['◷', String(data.mine.workDays), 'Hari kerja', '#e7f1ed', '#397461'],
    ['▣', String(data.mine.cups), 'Cup minuman', '#efe7de', '#775640'],
    ['◎', rupiah(data.total), 'Total hak bulan ini', '#fbf3dd', '#9a6b10'],
    ['✓', rupiah(data.remaining), 'Sisa belum dibayar', '#eee9f7', '#6c5b95']
  ];
  content.innerHTML = `
    <div class="metric-grid">${metrics.map(([icon, value, label, tone, accent]) => `<div class="metric-card"><div class="metric-top"><span class="metric-icon" style="--tone:${tone};--accent:${accent}">${icon}</span><span class="metric-delta">${escapeHTML(monthLabel)}</span></div><h3>${value}</h3><p>${label}</p></div>`).join('')}</div>
    <div class="payslip-shell">
      <div class="payslip-card">
        <div class="payslip-head">
          <div class="payslip-brand">SORGTIME<small>POINT OF SALE</small></div>
          <div class="payslip-period"><strong>Slip gaji ${escapeHTML(monthLabel)}</strong><span>Periode ${data.from} s.d. ${data.to}</span></div>
          <div class="payslip-id"><strong>${escapeHTML(data.mine.name)}</strong><span>${escapeHTML(ROLE_LABELS[data.mine.role] || data.mine.role)} · @${escapeHTML(currentUser.username)}</span></div>
        </div>
        <div class="payslip-lines">
          <div class="payslip-line section"><span>Rincian penghasilan</span><span></span></div>
          <div class="payslip-line"><span>Gaji pokok (${data.mine.workDays} hari kerja)</span><strong>${rupiah(data.mine.basePay)}</strong></div>
          <div class="payslip-line"><span>Bonus cup (${data.mine.cups} cup × ${rupiah(data.cupBonus)})</span><strong>${rupiah(data.mine.bonus)}</strong></div>
          <div class="payslip-line total"><span>Total hak</span><strong>${rupiah(data.total)}</strong></div>
          <div class="payslip-line section" style="margin-top:12px"><span>Pembayaran · ${escapeHTML(status)}</span><span></span></div>
          <div class="payslip-line paid"><span>Sudah dibayar</span><strong>${rupiah(data.paid)}</strong></div>
          <div class="payslip-line remaining ${data.overpaid ? 'overpaid' : ''}"><span>${data.overpaid ? 'Kelebihan bayar' : 'Sisa hak'}</span><strong>${rupiah(data.overpaid || data.remaining)}</strong></div>
        </div>
        <div class="payslip-note">Gaji pokok ${rupiah(monthlyBase)} per bulan dibagi ${workDaysInMonth} hari kerja (${monthlyOffDays} hari libur). Bonus dihitung ${rupiah(data.cupBonus)} per cup minuman. Kehadiran diambil otomatis dari shift atau transaksi. Jam kerja ${data.workStart}–${data.workEnd} WIB. ${data.mine.manual ? 'Nominal slip mengikuti pengaturan manual sysadmin.' : 'Perhitungan menggunakan metode otomatis.'}${data.mine.manualNote ? ` Catatan: ${escapeHTML(data.mine.manualNote)}.` : ''}</div>
      </div>
      <div class="payslip-side">
        <div class="content-card">
          <div class="card-header"><div><h3>Riwayat pembayaran</h3><p>Pembayaran untuk periode ini</p></div><strong class="history-total">${rupiah(data.paid)}</strong></div>
          <div class="table-wrap"><table class="payslip-day-table"><thead><tr><th>Tanggal</th><th>Nominal</th><th>Metode</th><th>Catatan</th></tr></thead><tbody>${data.payments.length ? data.payments.map(entry => `<tr><td>${escapeHTML(entry.paidDate || '—')}</td><td><strong>${rupiah(entry.amount)}</strong></td><td>${escapeHTML(entry.method || '—')}</td><td>${escapeHTML(entry.note || '—')}</td></tr>`).join('') : '<tr><td colspan="4"><div class="empty-table"><strong>Belum ada pembayaran</strong><span>Pembayaran akan muncul setelah dicatat sysadmin.</span></div></td></tr>'}</tbody></table></div>
        </div>
        <div class="content-card">
          <div class="card-header"><div><h3>Rincian harian</h3><p>Kehadiran dan bonus per tanggal</p></div></div>
          <div class="table-wrap"><table class="payslip-day-table"><thead><tr><th>Tanggal</th><th>Status</th><th>Cup</th><th>Gaji pokok</th><th>Bonus</th></tr></thead><tbody>${dailyRows.length ? dailyRows.map(day => `<tr><td>${new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'Asia/Jakarta' }).format(dateFromKey(day.day))}</td><td><span class="payroll-status ${day.present ? 'paid' : 'unpaid'}">${day.present ? 'Hadir' : 'Tanpa shift'}</span></td><td>${day.cups}</td><td>${rupiah(day.basePay)}</td><td>${rupiah(day.bonus)}</td></tr>`).join('') : '<tr><td colspan="5"><div class="empty-table"><strong>Belum ada aktivitas</strong><span>Buka shift atau buat transaksi untuk mencatat kehadiran bulan ini.</span></div></td></tr>'}</tbody></table></div>
        </div>
      </div>
    </div>`;
}

function payslipPrintHTML(data, monthLabel) {
  const rows = [
    ['Gaji pokok', `${data.mine.workDays} hari kerja`, data.mine.basePay],
    ['Bonus cup', `${data.mine.cups} cup × ${rupiah(data.cupBonus)}`, data.mine.bonus]
  ];
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Slip gaji ${escapeHTML(data.mine.name)} ${escapeHTML(monthLabel)}</title><style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 36px; color: #211e1e; font-family: Georgia, "Times New Roman", serif; }
    .slip { max-width: 680px; margin: 0 auto; border: 1px solid #211e1e; padding: 28px; }
    .head { display: flex; justify-content: space-between; gap: 20px; border-bottom: 1px dashed #211e1e; padding-bottom: 18px; }
    .brand { font-size: 22px; letter-spacing: .08em; }
    .brand small { display: block; font-size: 9px; letter-spacing: .22em; color: #6e655b; margin-top: 4px; }
    .period { text-align: right; }
    .period strong { display: block; font-size: 15px; }
    .period span, .meta span { display: block; color: #6e655b; font-size: 11px; margin-top: 3px; }
    .meta { margin-top: 18px; }
    .meta strong { font-size: 15px; }
    table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 12px; }
    th, td { text-align: left; padding: 8px 4px; border-bottom: 1px dotted #b9b0a6; }
    th { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: #6e655b; }
    td.num, th.num { text-align: right; }
    .total td { border-top: 1px solid #211e1e; border-bottom: 1px solid #211e1e; font-weight: bold; }
    .remaining td { font-weight: bold; font-size: 14px; }
    .note { margin-top: 20px; padding-top: 14px; border-top: 1px dashed #211e1e; color: #6e655b; font-size: 10px; line-height: 1.6; }
    .sign { display: flex; justify-content: space-between; margin-top: 48px; font-size: 11px; }
    .sign div { width: 40%; text-align: center; }
    .sign span { display: block; margin-top: 46px; border-top: 1px solid #211e1e; padding-top: 6px; }
  </style></head><body><div class="slip">
    <div class="head"><div class="brand">SORGTIME<small>POINT OF SALE</small></div><div class="period"><strong>Slip gaji ${escapeHTML(monthLabel)}</strong><span>Periode ${data.from} s.d. ${data.to}</span></div></div>
    <div class="meta"><strong>${escapeHTML(data.mine.name)}</strong><span>${escapeHTML(ROLE_LABELS[data.mine.role] || data.mine.role)} · @${escapeHTML(currentUser.username)}</span></div>
    <table><thead><tr><th>Komponen</th><th>Keterangan</th><th class="num">Nominal</th></tr></thead><tbody>
      ${rows.map(([label, note, value]) => `<tr><td>${escapeHTML(label)}</td><td>${escapeHTML(note)}</td><td class="num">${rupiah(value)}</td></tr>`).join('')}
      <tr class="total"><td colspan="2">Total hak</td><td class="num">${rupiah(data.total)}</td></tr>
      <tr><td colspan="2">Sudah dibayar</td><td class="num">${rupiah(data.paid)}</td></tr>
      <tr class="remaining"><td colspan="2">${data.overpaid ? 'Kelebihan bayar' : 'Sisa hak'}</td><td class="num">${rupiah(data.overpaid || data.remaining)}</td></tr>
    </tbody></table>
    <div class="note">Gaji pokok dihitung dari kehadiran (shift/transaksi) dengan jam kerja ${data.workStart}–${data.workEnd} WIB. Bonus dihitung ${rupiah(data.cupBonus)} per cup minuman. ${data.mine.manual ? 'Nominal mengikuti pengaturan manual sysadmin.' : 'Slip ini dihasilkan otomatis oleh Sorgtime POS.'}${data.payments.length ? ` Mencakup ${data.payments.length} pembayaran.` : ''}${data.mine.manualNote ? ` Catatan: ${escapeHTML(data.mine.manualNote)}.` : ''}</div>
    <div class="sign"><div><span>Karyawan</span></div><div><span>Pengelola</span></div></div>
  </div></body></html>`;
}

function printPayslip() {
  if (!currentUser) return;
  const data = payslipData();
  const monthLabel = payslipMonthLabel(data.from);
  const win = window.open('', '_blank', 'width=760,height=920');
  if (!win) return toast('Izinkan pop-up untuk mencetak slip gaji', '!');
  win.document.write(payslipPrintHTML(data, monthLabel));
  win.document.close();
  win.focus();
  setTimeout(() => { try { win.print(); } catch (error) { /* biarkan pengguna mencetak manual */ } }, 400);
}

function setReportPreset(preset) {
  const today = jakartaDateKey(); let from = today; let to = today;
  if (preset === 'yesterday') from = to = shiftDateKey(today, -1);
  if (preset === '7days') from = shiftDateKey(today, -6);
  if (preset === 'month') { const [year, month] = today.split('-').map(Number); from = `${today.slice(0, 8)}01`; to = `${today.slice(0, 8)}${String(new Date(year, month, 0).getDate()).padStart(2, '0')}`; }
  $('#report-date-from').value = from; $('#report-date-to').value = to; $$('[data-report-preset]').forEach(button => button.classList.toggle('active', button.dataset.reportPreset === preset)); renderReports();
}

function showPayrollSettings() {
  if (!isSysadmin()) return toast('Hanya sysadmin yang dapat mengubah pengaturan penggajian', '!');
  const settings = { monthlyBase: 500000, monthlyOffDays: 4, cupBonus: 1000, mode: 'auto', workStart: '09:00', workEnd: '16:00', ...state.payrollSettings };
  const data = reportData();
  const manualMonth = data.to.slice(0, 7);
  const [manualYear, manualMonthNumber] = manualMonth.split('-').map(Number);
  const manualFrom = `${manualMonth}-01`;
  const manualTo = `${manualMonth}-${String(new Date(manualYear, manualMonthNumber, 0).getDate()).padStart(2, '0')}`;
  const manualKeys = reportDateKeys(manualFrom, manualTo);
  const employees = reportPayroll(manualKeys).filter(row => row.id);
  const manualRows = employees.map(row => {
    const override = payrollManualFor(row.id, manualFrom, manualTo);
    return { ...row, manualBase: override ? Number(override.basePay || 0) : Math.round(row.autoBasePay), manualBonus: override ? Number(override.bonus || 0) : Math.round(row.autoBonus), manualNote: override?.note || '' };
  });
  const manualTable = manualRows.length ? `<div class="table-wrap modal-record-table"><table><thead><tr><th>Karyawan</th><th>Nilai otomatis</th><th>Gaji pokok manual (Rp)</th><th>Bonus manual (Rp)</th><th>Catatan</th></tr></thead><tbody>${manualRows.map(row => `<tr><td><strong>${escapeHTML(row.name)}</strong><small>${escapeHTML(ROLE_LABELS[row.role] || row.role)} · ${row.workDays} hari</small></td><td>${rupiah(row.autoTotal)}<small>pokok ${rupiah(row.autoBasePay)} · bonus ${rupiah(row.autoBonus)}</small></td><td><input name="manualBase-${row.id}" type="number" min="0" step="any" value="${row.manualBase}"></td><td><input name="manualBonus-${row.id}" type="number" min="0" step="any" value="${row.manualBonus}"></td><td><input name="manualNote-${row.id}" maxlength="80" value="${escapeHTML(row.manualNote)}" placeholder="Opsional"></td></tr>`).join('')}</tbody></table></div>` : '<div class="notice">Belum ada karyawan aktif pada periode ini.</div>';
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Atur gaji & bonus</h2><p>Metode otomatis atau manual untuk periode bulanan ${manualFrom} s.d. ${manualTo}</p></div><button class="modal-close">×</button></div><form id="payroll-settings-form"><div class="modal-body">
    <div class="form-grid">
      <div class="field"><label>Gaji pokok bulanan (Rp)</label><input name="monthlyBase" type="number" min="0" step="10000" required value="${Number(settings.monthlyBase || 0)}"></div>
      <div class="field"><label>Hari libur per bulan</label><input name="monthlyOffDays" type="number" min="0" max="30" step="1" required value="${Number(settings.monthlyOffDays || 0)}"></div>
      <div class="field"><label>Bonus per cup (Rp)</label><input name="cupBonus" type="number" min="0" step="500" required value="${Number(settings.cupBonus || 0)}"></div>
      <div class="field"><label>Jam mulai kerja</label><input name="workStart" type="time" required value="${escapeHTML(settings.workStart || '09:00')}"></div>
      <div class="field"><label>Jam selesai kerja</label><input name="workEnd" type="time" required value="${escapeHTML(settings.workEnd || '16:00')}"></div>
      <div class="field full"><label>Metode perhitungan gaji</label><select name="mode" id="payroll-mode"><option value="auto" ${settings.mode === 'auto' ? 'selected' : ''}>Otomatis — dari kehadiran, shift, dan cup</option><option value="manual" ${settings.mode === 'manual' ? 'selected' : ''}>Manual — nominal ditentukan sysadmin</option></select></div>
    </div>
    <div class="payroll-formula"><strong>Rumus otomatis</strong><span>Gaji harian = gaji bulanan ÷ (jumlah hari dalam bulan − hari libur)</span><span>Bonus harian = jumlah cup minuman kasir × bonus per cup</span><span>Jam kerja standar: ${escapeHTML(settings.workStart || '09:00')}–${escapeHTML(settings.workEnd || '16:00')} WIB</span></div>
    <div id="payroll-manual-block">
      <div class="notice">Mode manual dipakai sebagai cadangan saat data otomatis bermasalah. Nilai di bawah berlaku untuk periode bulanan ${manualFrom} s.d. ${manualTo}. Karyawan tanpa nominal manual tetap memakai nilai otomatis.</div>
      <div class="toolbar-group" style="margin:12px 0"><button type="button" class="secondary-button" id="payroll-fill-auto">Isi dengan nilai otomatis</button></div>
      ${manualTable}
    </div>
    <div class="notice">Kehadiran diambil dari pembukaan shift atau transaksi kasir. Produk retail tidak dihitung sebagai cup. Jika komponen Pekerja sudah ada di HPP, laporan hanya merekonsiliasi selisihnya dan tidak membebankan bonus dua kali.</div>
  </div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Simpan pengaturan</button></div></form>`, true);
  const toggleMode = () => { $('#payroll-manual-block').hidden = $('#payroll-mode').value !== 'manual'; };
  $('#payroll-mode').addEventListener('change', toggleMode); toggleMode();
  $('#payroll-fill-auto')?.addEventListener('click', () => {
    manualRows.forEach(row => {
      const base = $(`[name="manualBase-${row.id}"]`, $('#modal')); const bonus = $(`[name="manualBonus-${row.id}"]`, $('#modal'));
      if (base) base.value = Math.round(row.autoBasePay); if (bonus) bonus.value = Math.round(row.autoBonus);
    });
  });
  $('#payroll-settings-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const monthlyBase = Math.max(0, Number(form.get('monthlyBase')) || 0);
    const monthlyOffDays = Math.max(0, Math.min(30, Number(form.get('monthlyOffDays')) || 0));
    const cupBonus = Math.max(0, Number(form.get('cupBonus')) || 0);
    const mode = form.get('mode') === 'manual' ? 'manual' : 'auto';
    const workStart = form.get('workStart') || '09:00';
    const workEnd = form.get('workEnd') || '16:00';
    state.payrollSettings = { monthlyBase, monthlyOffDays, cupBonus, mode, workStart, workEnd };
    state.payrollManual = (state.payrollManual || []).filter(entry => !(entry.periodFrom === manualFrom && entry.periodTo === manualTo));
    if (mode === 'manual') {
      manualRows.forEach(row => {
        const basePay = Math.max(0, Number(form.get(`manualBase-${row.id}`)) || 0);
        const bonus = Math.max(0, Number(form.get(`manualBonus-${row.id}`)) || 0);
        const note = String(form.get(`manualNote-${row.id}`) || '').trim();
        if (basePay || bonus || note) state.payrollManual.push({ id: crypto.randomUUID(), userId: row.id, periodFrom: manualFrom, periodTo: manualTo, basePay, bonus, note, updatedAt: Date.now(), updatedBy: currentUser.id });
      });
    }
    save(); closeModal(); renderReports(); renderPayslip();
    toast(mode === 'manual' ? 'Gaji manual periode ini disimpan' : 'Gaji otomatis diaktifkan', '◎');
  });
}

const ATTENDANCE_STATUS = {
  present: ['Hadir', 'paid'],
  leave: ['Izin', 'partial'],
  off: ['Libur', 'unpaid'],
  absent: ['Tidak hadir', 'unpaid']
};
const attendanceStatusInfo = status => ATTENDANCE_STATUS[status] || [status || '—', 'unpaid'];
const attendanceTimeLabel = timestamp => timestamp ? new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date(timestamp)) : '—';

function showAttendanceManager() {
  if (!canManageSales()) return toast('Hanya sysadmin atau admin yang dapat mengelola kehadiran', '!');
  const data = reportData(); const users = authUsers.filter(user => user.status !== 'inactive');
  if (!users.length) return toast('Buat akun karyawan terlebih dahulu', '!');
  const payrollRows = reportPayroll(data.dateKeys).filter(row => row.id);
  const entries = state.attendance.filter(entry => entry.date >= data.from && entry.date <= data.to).sort((a, b) => b.date.localeCompare(a.date));
  const workStart = state.payrollSettings.workStart || '09:00'; const workEnd = state.payrollSettings.workEnd || '16:00';
  const summaryRows = users.map(user => {
    const row = payrollRows.find(item => item.id === user.id) || { workDays: 0, cups: 0 };
    return `<tr><td><strong>${escapeHTML(user.name)}</strong><small>${escapeHTML(ROLE_LABELS[user.role] || user.role)}</small></td><td><strong>${row.workDays}</strong> hari</td><td>${row.cups} cup</td><td><input type="date" data-workday-date="${user.id}" min="${data.from}" max="${data.to}" value="${data.to}"></td><td><button type="button" class="purchase-edit" data-add-workday="${user.id}">＋ Tambah hari</button></td></tr>`;
  }).join('');
  const rows = entries.length ? entries.map(entry => { const user = authUsers.find(item => item.id === entry.userId); const [label, tone] = attendanceStatusInfo(entry.status); const time = entry.checkInAt ? ` · ${attendanceTimeLabel(entry.checkInAt)}` : ''; return `<tr><td>${entry.date}</td><td><strong>${escapeHTML(user?.name || 'Akun dihapus')}</strong></td><td><span class="payroll-status ${tone}">${label}</span>${time}</td><td>${escapeHTML(entry.note || '—')}</td><td><button type="button" class="purchase-edit" data-attendance-delete="${entry.id}">Hapus</button></td></tr>`; }).join('') : '<tr><td colspan="5"><div class="empty-table"><strong>Belum ada koreksi manual</strong><span>Kehadiran kasir tetap otomatis berasal dari shift dan transaksi.</span></div></td></tr>';
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Hari kerja karyawan</h2><p>${data.from} s.d. ${data.to} · satu hari kerja ${workStart}–${workEnd} WIB</p></div><button class="modal-close">×</button></div><form id="attendance-form"><div class="modal-body">
    <div class="notice">Tambahkan hari kerja untuk karyawan yang tidak tercatat otomatis oleh shift atau transaksi. Satu hari kerja dihitung penuh untuk jam ${workStart}–${workEnd} WIB. Koreksi manual mengalahkan data otomatis pada tanggal yang sama.</div>
    <h3 class="shift-history-title">Tambah hari kerja per karyawan</h3>
    <div class="table-wrap modal-record-table"><table><thead><tr><th>Karyawan</th><th>Hari kerja</th><th>Cup</th><th>Tanggal</th><th></th></tr></thead><tbody>${summaryRows}</tbody></table></div>
    <h3 class="shift-history-title">Koreksi kehadiran</h3>
    <div class="form-grid"><div class="field"><label>Karyawan</label><select name="userId" required>${users.map(user => `<option value="${user.id}">${escapeHTML(user.name)} · ${escapeHTML(ROLE_LABELS[user.role])}</option>`).join('')}</select></div><div class="field"><label>Tanggal</label><input name="date" type="date" min="${data.from}" max="${data.to}" value="${data.to}" required></div><div class="field"><label>Status</label><select name="status"><option value="present">Hadir</option><option value="leave">Izin</option><option value="off">Libur</option><option value="absent">Tidak hadir</option></select></div><div class="field"><label>Catatan</label><input name="note" maxlength="80" placeholder="Opsional"></div></div>
    <div class="table-wrap modal-record-table"><table><thead><tr><th>Tanggal</th><th>Karyawan</th><th>Status</th><th>Catatan</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
  </div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Kembali</button><button type="submit" class="button-primary">Simpan kehadiran</button></div></form>`, true);
  $$('[data-add-workday]', $('#modal')).forEach(button => button.addEventListener('click', () => {
    const userId = button.dataset.addWorkday;
    const input = $(`[data-workday-date="${userId}"]`, $('#modal'));
    const date = input?.value || data.to;
    if (!date || date < data.from || date > data.to) return toast('Pilih tanggal di dalam periode laporan', '!');
    const existing = state.attendance.find(entry => entry.userId === userId && entry.date === date);
    const row = payrollRows.find(item => item.id === userId);
    if (!existing && row?.days?.has(date)) return toast('Tanggal ini sudah tercatat sebagai hari kerja', '!');
    const entry = { id: existing?.id || crypto.randomUUID(), userId, date, status: 'present', note: existing?.note || `Ditambahkan ${currentUser.name}`, updatedAt: Date.now(), updatedBy: currentUser.id };
    if (existing) Object.assign(existing, entry); else state.attendance.push(entry);
    save(); closeModal(); renderReports(); renderAttendance(); showAttendanceManager(); toast('Hari kerja ditambahkan', '◷');
  }));
  $('#attendance-form').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); const userId = form.get('userId'); const date = form.get('date'); const existing = state.attendance.find(entry => entry.userId === userId && entry.date === date); const status = form.get('status'); const entry = { id: existing?.id || crypto.randomUUID(), userId, date, status, note: form.get('note').trim(), source: 'admin', updatedAt: Date.now(), updatedBy: currentUser.id }; if (status !== 'present') { entry.checkInAt = null; entry.location = null; } if (existing) Object.assign(existing, entry); else state.attendance.push(entry); save(); closeModal(); renderReports(); renderAttendance(); showAttendanceManager(); toast('Kehadiran berhasil disimpan', '◷'); });
  $$('[data-attendance-delete]', $('#modal')).forEach(button => button.addEventListener('click', async () => {
    if (!await confirmDialog('Hapus data kehadiran ini?', { title: 'Hapus kehadiran', confirmLabel: 'Hapus' })) return;
    state.attendance = state.attendance.filter(entry => entry.id !== button.dataset.attendanceDelete); save(); closeModal(); renderReports(); renderAttendance(); showAttendanceManager();
  }));
}

function attendanceEntryFor(userId, date) {
  return state.attendance.find(entry => entry.userId === userId && entry.date === date);
}
function attendanceLocationLabel(entry) {
  if (!entry?.location) return '—';
  const distance = Number(entry.location.distance);
  return `${escapeHTML(entry.location.label || 'Titik absensi')}${Number.isFinite(distance) ? ` · ${Math.round(distance)} m` : ''}`;
}
function attendanceHistoryRows(entries) {
  return entries.length ? entries.map(entry => {
    const user = authUsers.find(item => item.id === entry.userId);
    const [label, tone] = attendanceStatusInfo(entry.status);
    return `<tr><td><strong>${entry.date}</strong><small>${entry.source === 'self' ? 'Absen mandiri' : 'Koreksi admin'}</small></td><td><strong>${escapeHTML(user?.name || 'Akun dihapus')}</strong></td><td><span class="payroll-status ${tone}">${label}</span></td><td>${entry.checkInAt ? attendanceTimeLabel(entry.checkInAt) : '—'}</td><td>${attendanceLocationLabel(entry)}</td><td>${escapeHTML(entry.note || '—')}</td></tr>`;
  }).join('') : `<tr><td colspan="6"><div class="empty-table"><strong>Belum ada riwayat absensi</strong><span>Data absensi akan muncul setelah karyawan melakukan absen atau admin mencatat koreksi.</span></div></td></tr>`;
}
async function selfCheckIn() {
  if (!currentUser) return;
  if (isSysadmin()) return toast('Sysadmin mengelola absensi, bukan melakukan absen pribadi', '!');
  const today = jakartaDateKey();
  const existing = attendanceEntryFor(currentUser.id, today);
  if (existing) return toast(`Absensi hari ini sudah tercatat sebagai ${attendanceStatusInfo(existing.status)[0]}`, '!');
  const button = $('#attendance-check-in');
  const original = button?.innerHTML;
  if (button) { button.disabled = true; button.textContent = 'Memeriksa lokasi...'; }
  try {
    const check = await verifyShiftLocation();
    if (!check.ok) {
      if (button) { button.disabled = false; button.innerHTML = original; }
      return toast(`Di luar radius lokasi absensi (${Math.round(check.distance)} m). Dekati lokasi outlet lalu coba lagi`, '!');
    }
    const now = Date.now();
    state.attendance.push({
      id: crypto.randomUUID(), userId: currentUser.id, date: today, status: 'present',
      note: check.settings?.enabled ? `Absen mandiri di ${check.settings.label}` : 'Absen mandiri',
      checkInAt: now, source: 'self',
      location: check.settings?.enabled ? { label: check.settings.label, distance: Math.round(check.distance), accuracy: Math.round(check.accuracy || 0), latitude: check.latitude, longitude: check.longitude } : null,
      updatedAt: now, updatedBy: currentUser.id
    });
    save(); renderAttendance(); renderReports(); renderPayslip();
    toast('Absensi berhasil dicatat', '✓');
  } catch (error) {
    if (button) { button.disabled = false; button.innerHTML = original; }
    toast(error.message, '!');
  }
}
function renderAttendance() {
  const content = $('#attendance-content'); if (!content || !currentUser) return;
  const today = jakartaDateKey();
  const employees = authUsers.filter(user => user.status !== 'inactive');
  const todayEntries = state.attendance.filter(entry => entry.date === today);
  const location = shiftLocationSettings();
  const admin = canManageSales();
  const title = $('#attendance-title'); const subtitle = $('#attendance-subtitle');
  const manageButton = $('#attendance-manage-view'); const locationButton = $('#attendance-location-settings');
  if (manageButton) manageButton.hidden = !admin;
  if (locationButton) locationButton.hidden = !isSysadmin();
  if (title) title.textContent = isSysadmin() ? 'Kelola absensi' : 'Absensi saya';
  if (subtitle) subtitle.textContent = isSysadmin() ? 'Pantau kehadiran dan ubah status izin seluruh karyawan' : `Catat kehadiran di ${location.enabled ? location.label || 'titik lokasi outlet' : 'lokasi outlet'}`;
  const dateLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date());
  if (isSysadmin()) {
    const present = todayEntries.filter(entry => entry.status === 'present').length;
    const leave = todayEntries.filter(entry => entry.status === 'leave').length;
    const absent = employees.filter(user => { const entry = todayEntries.find(item => item.userId === user.id); return entry && ['absent', 'off'].includes(entry.status); }).length;
    const notYet = employees.filter(user => !todayEntries.some(item => item.userId === user.id)).length;
    $('#attendance-metrics').innerHTML = [
      ['◷', present, 'Hadir hari ini', '#e7f1ed', '#397461'], ['◇', leave, 'Izin', '#fbf3dd', '#9a6b10'], ['!', absent, 'Libur / tidak hadir', '#f6d9d5', '#b83d3d'], ['…', notYet, 'Belum absen', '#eee9f7', '#6c5b95']
    ].map(([icon,value,label,tone,accent]) => `<div class="metric-card"><div class="metric-top"><span class="metric-icon" style="--tone:${tone};--accent:${accent}">${icon}</span></div><h3>${value}</h3><p>${label}</p></div>`).join('');
    const todayRows = employees.length ? employees.map(user => {
      const entry = todayEntries.find(item => item.userId === user.id);
      const [label, tone] = entry ? attendanceStatusInfo(entry.status) : ['Belum absen', 'unpaid'];
      return `<tr><td><strong>${escapeHTML(user.name)}</strong><small>${escapeHTML(ROLE_LABELS[user.role] || user.role)}</small></td><td><span class="payroll-status ${tone}">${label}</span></td><td>${entry?.checkInAt ? attendanceTimeLabel(entry.checkInAt) : '—'}</td><td>${attendanceLocationLabel(entry)}</td><td>${escapeHTML(entry?.note || '—')}</td></tr>`;
    }).join('') : '<tr><td colspan="5"><div class="empty-table"><strong>Belum ada karyawan aktif</strong></div></td></tr>';
    const recent = [...state.attendance].sort((a, b) => b.date.localeCompare(a.date) || Number(b.checkInAt || b.updatedAt || 0) - Number(a.checkInAt || a.updatedAt || 0)).slice(0, 30);
    content.innerHTML = `<div class="content-card"><div class="card-header"><div><h3>Kehadiran hari ini</h3><p>${escapeHTML(dateLabel)}</p></div><button class="secondary-button" id="attendance-manage-inline">◷ Kelola absensi</button></div><div class="table-wrap"><table><thead><tr><th>Karyawan</th><th>Status</th><th>Jam absen</th><th>Lokasi</th><th>Catatan</th></tr></thead><tbody>${todayRows}</tbody></table></div></div><div class="content-card attendance-history-card"><div class="card-header"><div><h3>Riwayat absensi terbaru</h3><p>30 catatan terakhir dari seluruh karyawan</p></div></div><div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Karyawan</th><th>Status</th><th>Jam</th><th>Lokasi</th><th>Catatan</th></tr></thead><tbody>${attendanceHistoryRows(recent)}</tbody></table></div></div>`;
    $('#attendance-manage-inline')?.addEventListener('click', showAttendanceManager);
    return;
  }
  const month = today.slice(0, 7);
  const mine = state.attendance.filter(entry => entry.userId === currentUser.id);
  const mineMonth = mine.filter(entry => entry.date.startsWith(month));
  const presentDays = new Set(mineMonth.filter(entry => entry.status === 'present').map(entry => entry.date)).size;
  const leaveDays = new Set(mineMonth.filter(entry => entry.status === 'leave').map(entry => entry.date)).size;
  const offDays = new Set(mineMonth.filter(entry => entry.status === 'off').map(entry => entry.date)).size;
  const todayEntry = attendanceEntryFor(currentUser.id, today);
  const [todayLabelText, todayTone] = todayEntry ? attendanceStatusInfo(todayEntry.status) : ['Belum absen', 'unpaid'];
  const todaySummary = todayEntry && todayEntry.checkInAt ? `${todayLabelText} · ${attendanceTimeLabel(todayEntry.checkInAt)}` : todayLabelText;
  $('#attendance-metrics').innerHTML = [
    ['◷', presentDays, 'Hadir bulan ini', '#e7f1ed', '#397461'], ['◇', leaveDays, 'Izin bulan ini', '#fbf3dd', '#9a6b10'], ['⌂', offDays, 'Libur bulan ini', '#f6d9d5', '#b83d3d'], ['◎', todaySummary, 'Status hari ini', '#eee9f7', '#6c5b95']
  ].map(([icon,value,label,tone,accent]) => `<div class="metric-card"><div class="metric-top"><span class="metric-icon" style="--tone:${tone};--accent:${accent}">${icon}</span></div><h3>${value}</h3><p>${label}</p></div>`).join('');
  const canCheckIn = !todayEntry;
  const buttonLabel = todayEntry ? (todayEntry.status === 'present' ? `✓ Sudah absen${todayEntry.checkInAt ? ` · ${attendanceTimeLabel(todayEntry.checkInAt)}` : ''}` : `Status: ${todayLabelText}`) : '◷ Absen sekarang';
  const locationNotice = location.enabled
    ? `<strong>Lokasi absensi:</strong> ${escapeHTML(location.label || 'Titik lokasi outlet')} (radius ${Number(location.radius || 0)} m). Absen hanya dapat dilakukan di sekitar titik ini.`
    : 'Lokasi absensi belum diwajibkan. Sysadmin dapat menetapkan titik absensi melalui tombol <strong>Lokasi absensi</strong>.';
  const history = [...mine].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  content.innerHTML = `<div class="content-card attendance-check-card"><div class="card-header"><div><h3>Kehadiran hari ini</h3><p>${escapeHTML(dateLabel)}</p></div><span class="payroll-status ${todayTone}">${todayLabelText}</span></div><div class="attendance-check-body"><div class="attendance-now"><span>Absensi mandiri</span><strong>${escapeHTML(todaySummary)}</strong><small>${todayEntry?.note ? escapeHTML(todayEntry.note) : 'Tekan tombol absen saat tiba di outlet.'}</small></div><button class="button-primary" id="attendance-check-in" data-attendance-check-in ${canCheckIn ? '' : 'disabled'}>${escapeHTML(buttonLabel)}</button></div><div class="notice">${locationNotice}</div></div><div class="content-card attendance-history-card"><div class="card-header"><div><h3>Riwayat absensi saya</h3><p>30 catatan terakhir${admin ? ' · Anda dapat mengubah status izin melalui tombol Kelola absensi' : ''}</p></div></div><div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Karyawan</th><th>Status</th><th>Jam</th><th>Lokasi</th><th>Catatan</th></tr></thead><tbody>${attendanceHistoryRows(history)}</tbody></table></div></div>`;
}

function showPayrollPayment() {
  if (!isSysadmin()) return toast('Hanya sysadmin yang dapat membayar gaji semua karyawan', '!');
  const data = reportData();
  const periodPayments = state.payrollPayments.filter(entry => entry.periodFrom >= data.from && entry.periodTo <= data.to).sort((a, b) => b.createdAt - a.createdAt);
  const employees = reportPayroll(data.dateKeys).filter(row => row.id).map(row => {
    const paid = periodPayments.filter(entry => entry.userId === row.id).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    return { ...row, remaining: Math.max(0, Math.round(row.total - paid)) };
  });
  if (!employees.length) return toast('Buat akun karyawan terlebih dahulu', '!');
  const rows = periodPayments.map(entry => {
    const user = authUsers.find(item => item.id === entry.userId);
    return `<tr><td>${entry.paidDate}</td><td><strong>${escapeHTML(user?.name || 'Akun dihapus')}</strong></td><td>${rupiah(entry.amount)}</td><td>${escapeHTML(entry.method)}</td><td>${escapeHTML(entry.note || '—')}</td><td><button type="button" class="purchase-edit" data-payroll-delete="${entry.id}">Hapus</button></td></tr>`;
  }).join('') || '<tr><td colspan="6">Belum ada pembayaran pada periode ini.</td></tr>';
  const total = employees.reduce((sum, row) => sum + row.remaining, 0);
  const bulkRows = employees.map(row => `<tr><td><strong>${escapeHTML(row.name)}</strong><small>${escapeHTML(ROLE_LABELS[row.role] || row.role)}</small></td><td>${row.workDays}</td><td>${rupiah(row.remaining)}</td><td><input aria-label="Nominal untuk ${escapeHTML(row.name)}" data-bulk-payroll="${row.id}" name="bulk-${row.id}" type="number" min="0" step="1" inputmode="numeric" value="${row.remaining}" required></td></tr>`).join('');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Pembayaran gaji</h2><p>Periode hak ${data.from} s.d. ${data.to} · ${employees.length} karyawan</p></div><button class="modal-close">×</button></div>
    <form id="payroll-payment-form"><div class="modal-body"><div class="form-grid">
    <div class="field full"><label>Sasaran pembayaran</label><select name="userId" id="payroll-payment-user" required><option value="__all__" selected>Semua karyawan (${employees.length} orang)</option>${employees.map(row => `<option value="${row.id}">${escapeHTML(row.name)} · ${escapeHTML(ROLE_LABELS[row.role] || row.role)}</option>`).join('')}</select></div>
    <div class="field"><label id="payroll-payment-amount-label">Total pembayaran semua karyawan (Rp)</label><input name="amount" id="payroll-payment-amount" type="number" min="0" step="1" inputmode="numeric" readonly value="${total}" required></div>
    <div class="field"><label>Tanggal pembayaran</label><input name="paidDate" type="date" value="${jakartaDateKey()}" required></div>
    <div class="field"><label>Metode</label><select name="method"><option>Transfer</option><option>Tunai</option><option>QRIS</option></select></div>
    <div class="field"><label>Catatan</label><input name="note" maxlength="80" placeholder="Referensi atau keterangan"></div></div>
    <div class="notice" id="payroll-payment-notice"></div>
    <div id="payroll-bulk-list" class="table-wrap modal-record-table"><table><thead><tr><th>Karyawan</th><th>Hari hadir</th><th>Sisa hak</th><th>Nominal dibayar (Rp)</th></tr></thead><tbody>${bulkRows}</tbody></table></div>
    <h3 class="shift-history-title">Riwayat pembayaran periode ini</h3><div class="table-wrap modal-record-table"><table><thead><tr><th>Dibayar</th><th>Karyawan</th><th>Nominal</th><th>Metode</th><th>Catatan</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>
    <div class="modal-footer"><button type="button" class="button-ghost modal-close">Kembali</button><button type="submit" class="button-primary" id="payroll-payment-submit">Catat pembayaran</button></div></form>`, true);
  const bulkInputs = $$('[data-bulk-payroll]', $('#modal'));
  const updateTarget = () => {
    const isAll = $('#payroll-payment-user').value === '__all__';
    const amount = $('#payroll-payment-amount');
    $('#payroll-bulk-list').hidden = !isAll;
    bulkInputs.forEach(input => { input.disabled = !isAll; });
    amount.readOnly = isAll;
    amount.min = isAll ? '0' : '1';
    amount.value = isAll ? bulkInputs.reduce((sum, input) => sum + (Number(input.value) || 0), 0) : employees.find(row => row.id === $('#payroll-payment-user').value)?.remaining || 0;
    $('#payroll-payment-amount-label').textContent = isAll ? 'Total pembayaran semua karyawan (Rp)' : 'Nominal dibayar (Rp)';
    const manualNotice = state.payrollSettings.mode === 'manual' ? ' Metode manual aktif; nominal hak mengikuti pengaturan manual bulanan.' : '';
    $('#payroll-payment-notice').textContent = isAll ? `Semua karyawan ditampilkan, termasuk yang belum memiliki absensi atau transaksi. Isi nominal setiap orang; Rp0 dilewati. Total di atas menjumlahkan seluruh nominal yang diisi.${manualNotice}` : `Isi nominal rupiah berapa pun untuk karyawan ini. Pembayaran di luar hak yang tercatat tetap tersimpan dan ditampilkan sebagai kelebihan pembayaran.${manualNotice}`;
  };
  $('#payroll-payment-user').addEventListener('change', updateTarget);
  bulkInputs.forEach(input => input.addEventListener('input', () => { $('#payroll-payment-amount').value = bulkInputs.reduce((sum, field) => sum + (Number(field.value) || 0), 0); }));
  updateTarget();
  $('#payroll-payment-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!isSysadmin()) return toast('Hanya sysadmin yang dapat mencatat pembayaran gaji', '!');
    const form = new FormData(event.currentTarget);
    const isAll = form.get('userId') === '__all__';
    const allocations = isAll ? employees.map(row => ({ userId: row.id, amount: Number(form.get(`bulk-${row.id}`)) })) : [{ userId: form.get('userId'), amount: Number(form.get('amount')) }];
    if (allocations.some(entry => !Number.isSafeInteger(entry.amount) || entry.amount < 0) || (!isAll && allocations[0].amount <= 0)) return toast('Isi nominal rupiah bulat yang valid', '!');
    const payments = allocations.filter(entry => entry.amount > 0);
    if (!payments.length) return toast('Isi nominal pembayaran untuk minimal satu karyawan', '!');
    const shared = { paidDate: form.get('paidDate'), method: form.get('method'), note: form.get('note').trim(), periodFrom: data.from, periodTo: data.to, createdAt: Date.now(), createdBy: currentUser.id };
    payments.forEach(entry => state.payrollPayments.push({ id: crypto.randomUUID(), ...entry, ...shared }));
    save(); closeModal(); renderReports();
    toast(`Pembayaran ${payments.length} karyawan senilai ${rupiah(payments.reduce((sum, entry) => sum + entry.amount, 0))} dicatat`, '✓');
  });
  $$('[data-payroll-delete]', $('#modal')).forEach(button => button.addEventListener('click', async () => {
    if (!isSysadmin()) return;
    if (!await confirmDialog('Hapus catatan pembayaran ini?', { title: 'Hapus pembayaran', confirmLabel: 'Hapus' })) return;
    state.payrollPayments = state.payrollPayments.filter(entry => entry.id !== button.dataset.payrollDelete);
    save(); closeModal(); renderReports(); showPayrollPayment();
  }));
}

function showPurchaseEditor(movement) {
  if (!movement || !canManageSales()) return toast('Hanya admin yang dapat mengubah beban belanja', '!');
  const ingredient = state.inventory.find(item => String(item.id) === String(movement.ingredientId));
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Edit beban belanja</h2><p>${escapeHTML(ingredient?.name || 'Item inventori')} · ${transactionDateTime(movement.createdAt)}</p></div><button class="modal-close">×</button></div><form id="purchase-edit-form"><div class="modal-body"><div class="transaction-detail-head"><div><span>Jumlah masuk</span><strong>${formatQuantity(movement.amount, ingredient?.unit || '')}</strong></div><div><span>Stok sebelum</span><strong>${formatQuantity(movement.before, ingredient?.unit || '')}</strong></div><div><span>Stok sesudah</span><strong>${formatQuantity(movement.after, ingredient?.unit || '')}</strong></div><div><span>Pencatat</span><strong>${escapeHTML(authUsers.find(user => user.id === movement.userId)?.name || 'Sistem')}</strong></div></div><div class="form-grid"><div class="field full"><label>Total beban belanja (Rp)</label><input name="purchaseCost" type="number" min="0" step="1000" required value="${Number(movement.purchaseCost || 0)}"></div><div class="field full"><label>Referensi / pemasok</label><input name="reference" maxlength="80" value="${escapeHTML(movement.reference || '')}" placeholder="Nomor invoice atau nama pemasok"></div></div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Simpan beban</button></div></form>`);
  $('#purchase-edit-form').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); movement.purchaseCost = Math.max(0, Number(form.get('purchaseCost')) || 0); movement.reference = form.get('reference').trim(); save(); closeModal(); renderReports(); toast('Beban belanja diperbarui', '◇'); });
}

function shiftOrders(shift) { return shift ? state.orders.filter(order => order.shiftId === shift.id) : []; }
function shiftSummary(shift) {
  const orders = shiftOrders(shift); const cash = orders.filter(order => order.payment === 'Tunai').reduce((sum, order) => sum + Number(order.total || 0), 0);
  const qris = orders.filter(order => order.payment === 'QRIS').reduce((sum, order) => sum + Number(order.total || 0), 0);
  return { orders, cash, qris, revenue: cash + qris, expectedCash: Number(shift?.openingCash || 0) + cash };
}
function shiftDuration(shift) {
  const duration = Math.max(0, (shift?.endedAt || Date.now()) - (shift?.startedAt || Date.now()));
  const hours = String(Math.floor(duration / 3600000)).padStart(2, '0'); const minutes = String(Math.floor(duration / 60000) % 60).padStart(2, '0'); const seconds = String(Math.floor(duration / 1000) % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
function renderShiftState() {
  const shift = activeShift(); const button = $('#shift-button'); if (!button) return;
  button.classList.toggle('closed', !shift); button.querySelector('span').textContent = shift ? 'Shift aktif' : 'Shift tutup'; button.querySelector('strong').textContent = shift ? shiftDuration(shift) : 'Mulai';
  $('#shift-closed-banner').hidden = Boolean(shift);
  if (currentUser) $('#profile-role').textContent = `${ROLE_LABELS[currentUser.role]} · Shift ${shift ? 'aktif' : 'tutup'}`;
}
function shiftHistoryHTML() {
  const recent = [...state.shifts].sort((a, b) => b.startedAt - a.startedAt).slice(0, 5);
  if (!recent.length) return '<div class="empty-inline"><strong>Belum ada riwayat shift</strong><span>Shift pertama akan tercatat setelah dibuka.</span></div>';
  return `<div class="shift-history-list">${recent.map(shift => { const summary = shiftSummary(shift); return `<div><span><strong>${transactionDateTime(shift.startedAt)}</strong><small>${escapeHTML(shift.startedBy || '—')} · ${shift.endedAt ? shiftDuration(shift) : 'Sedang aktif'}</small></span><span><strong>${summary.orders.length} trx · ${rupiah(summary.revenue)}</strong><small>${shift.endedAt ? `Selisih ${rupiah(shift.cashDifference || 0)}` : 'Belum ditutup'}</small></span>${isSysadmin() && shift.endedAt ? `<span class="shift-history-actions"><button type="button" class="purchase-edit danger-button" data-shift-delete="${shift.id}" title="Hapus data riwayat shift">Hapus</button></span>` : ''}</div>`; }).join('')}</div>`;
}
function defaultShiftLocation() { return { enabled: false, label: '', latitude: null, longitude: null, radius: 50 }; }
function shiftLocationSettings() { return { ...defaultShiftLocation(), ...(state.shiftLocation || {}) }; }
function readCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Perangkat tidak mendukung pembacaan lokasi'));
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  });
}
function distanceMeters(fromLat, fromLon, toLat, toLon) {
  const rad = value => Number(value) * Math.PI / 180;
  const earth = 6371000; const dLat = rad(Number(toLat) - Number(fromLat)); const dLon = rad(Number(toLon) - Number(fromLon));
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(fromLat)) * Math.cos(rad(toLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * earth * Math.asin(Math.min(1, Math.sqrt(a)));
}
function locationErrorMessage(error) {
  if (error?.code === 1) return 'Izin lokasi ditolak. Aktifkan akses lokasi untuk membuka shift atau absen';
  if (error?.code === 3) return 'Waktu pembacaan lokasi habis. Coba lagi di area terbuka';
  return 'Lokasi saat ini tidak dapat dibaca. Pastikan GPS aktif lalu coba lagi';
}
async function verifyShiftLocation() {
  const settings = shiftLocationSettings();
  if (!settings.enabled) return { ok: true, settings };
  const latitude = Number(settings.latitude); const longitude = Number(settings.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('Lokasi shift belum diatur oleh sysadmin');
  let position;
  try { position = await readCurrentPosition(); } catch (error) { throw new Error(locationErrorMessage(error)); }
  const distance = distanceMeters(latitude, longitude, position.coords.latitude, position.coords.longitude);
  return { ok: distance <= Number(settings.radius || 0), distance, accuracy: position.coords.accuracy, latitude: position.coords.latitude, longitude: position.coords.longitude, settings };
}
function showShiftLocationSettings() {
  if (!isSysadmin()) return toast('Hanya sysadmin yang dapat mengatur lokasi shift & absensi', '!');
  const settings = shiftLocationSettings();
  const hasPoint = Number.isFinite(Number(settings.latitude)) && Number.isFinite(Number(settings.longitude));
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Atur lokasi shift & absensi</h2><p>Shift dan absensi hanya bisa dilakukan ketika perangkat berada di titik ini</p></div><button class="modal-close">×</button></div><form id="shift-location-form"><div class="modal-body">
    <div class="form-grid">
      <div class="field full"><label>Nama lokasi</label><input name="label" maxlength="80" value="${escapeHTML(settings.label || '')}" placeholder="Contoh: Sorgtime Coffee Bar" required></div>
      <div class="field"><label>Latitude</label><input name="latitude" type="number" step="any" min="-90" max="90" value="${hasPoint ? Number(settings.latitude) : ''}" required></div>
      <div class="field"><label>Longitude</label><input name="longitude" type="number" step="any" min="-180" max="180" value="${hasPoint ? Number(settings.longitude) : ''}" required></div>
      <div class="field"><label>Radius toleransi (meter)</label><input name="radius" type="number" min="5" max="10000" step="5" value="${Number(settings.radius || 50)}" required></div>
      <div class="field"><label>Status</label><label class="checkbox-line"><input name="enabled" type="checkbox" ${settings.enabled ? 'checked' : ''}> Wajibkan saat membuka shift dan absen</label></div>
    </div>
    <div class="toolbar-group" style="margin:12px 0"><button type="button" class="secondary-button" id="shift-location-detect">◎ Gunakan lokasi saat ini</button></div>
    <div class="notice" id="shift-location-status">${settings.enabled ? `Aktif · ${escapeHTML(settings.label || 'Titik lokasi')} · radius ${Number(settings.radius || 0)} m` : 'Belum diwajibkan. Isi titik lalu centang wajib untuk mengaktifkan.'}</div>
    <div class="notice">Browser hanya mengizinkan pembacaan lokasi pada koneksi aman (HTTPS atau localhost). Minta karyawan mengizinkan akses lokasi saat diminta. Titik ini dipakai untuk membuka shift dan absen mandiri.</div>
  </div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Simpan lokasi</button></div></form>`, true);
  const form = $('#shift-location-form');
  $('#shift-location-detect').addEventListener('click', async () => {
    const status = $('#shift-location-status'); status.textContent = 'Membaca lokasi perangkat...';
    try {
      const position = await readCurrentPosition();
      form.querySelector('[name="latitude"]').value = position.coords.latitude.toFixed(6);
      form.querySelector('[name="longitude"]').value = position.coords.longitude.toFixed(6);
      status.textContent = `Lokasi terbaca · akurasi ±${Math.round(position.coords.accuracy)} meter`;
    } catch (error) { status.textContent = locationErrorMessage(error); }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const enabled = data.has('enabled');
    const label = String(data.get('label') || '').trim();
    const latitude = Number(data.get('latitude'));
    const longitude = Number(data.get('longitude'));
    const radius = Math.max(5, Math.min(10000, Number(data.get('radius')) || 50));
    if (enabled && (!label || !Number.isFinite(latitude) || !Number.isFinite(longitude))) return toast('Isi nama, latitude, dan longitude lokasi', '!');
    state.shiftLocation = { enabled, label, latitude: Number.isFinite(latitude) ? latitude : null, longitude: Number.isFinite(longitude) ? longitude : null, radius, updatedAt: Date.now(), updatedBy: currentUser.id };
    save(); closeModal(); renderAttendance(); renderReports(); toast(enabled ? 'Lokasi shift & absensi berhasil diwajibkan' : 'Kewajiban lokasi shift & absensi dimatikan', '◎');
  });
}
function showShiftManager() {
  if (!canAccess('pos')) return toast('Anda tidak memiliki akses untuk mengelola shift', '!');
  const shift = activeShift();
  if (!shift) {
    const location = shiftLocationSettings();
    const locationNotice = location.enabled
      ? `<div class="notice" id="shift-location-notice"><strong>Lokasi wajib:</strong> ${escapeHTML(location.label || 'Titik lokasi outlet')} (radius ${Number(location.radius || 0)} m). <button type="button" class="purchase-edit" id="shift-location-check">Periksa lokasi</button> <span id="shift-location-result"></span></div>`
      : `<div class="notice">Shift belum diwajibkan pada titik lokasi tertentu.${isSysadmin() ? ' Atur melalui tombol <strong>Lokasi shift</strong> di halaman Laporan atau <strong>Lokasi absensi</strong> di halaman absensi.' : ''}</div>`;
    openModal(`<div class="modal-header"><div><h2 id="modal-title">Mulai shift baru</h2><p>Nomor antrean akan dimulai kembali dari A-001</p></div><button class="modal-close">×</button></div><form id="start-shift-form"><div class="modal-body"><div class="payment-total-box"><span>KAS AWAL</span><strong id="opening-cash-preview">${rupiah(0)}</strong></div><div class="field"><label>Nominal kas awal</label><input name="openingCash" id="opening-cash" type="number" min="0" step="1000" value="0" required autofocus></div><div class="notice">Transaksi hanya dapat dibuat saat shift aktif. Membuka shift akan mengosongkan keranjang lama dan mereset nomor pesanan ke A-001.</div>${locationNotice}<h3 class="shift-history-title">Riwayat shift terakhir</h3>${shiftHistoryHTML()}</div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Mulai shift</button></div></form>`, true);
    $('#opening-cash').addEventListener('input', event => { $('#opening-cash-preview').textContent = rupiah(Math.max(0, Number(event.target.value) || 0)); });
    $('#shift-location-check')?.addEventListener('click', async () => {
      const result = $('#shift-location-result'); if (!result) return;
      result.textContent = 'Memeriksa lokasi...';
      try {
        const check = await verifyShiftLocation();
        result.innerHTML = check.ok ? `<strong class="positive-value">Dalam radius (${Math.round(check.distance)} m)</strong>` : `<strong class="negative-value">Di luar radius (${Math.round(check.distance)} m)</strong>`;
      } catch (error) { result.textContent = error.message; }
    });
    $('#start-shift-form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget; const submit = form.querySelector('button[type="submit"]');
      const openingCash = Math.max(0, Number(new FormData(form).get('openingCash')) || 0); const startedAt = Date.now();
      const entry = { id: crypto.randomUUID(), startedAt, startedById: currentUser.id, startedBy: currentUser.name, openingCash, endedAt: null };
      if (shiftLocationSettings().enabled) {
        const originalLabel = submit.textContent; submit.disabled = true; submit.textContent = 'Memeriksa lokasi...';
        try {
          const check = await verifyShiftLocation();
          if (!check.ok) { submit.disabled = false; submit.textContent = originalLabel; return toast(`Di luar radius lokasi (${Math.round(check.distance)} m dari titik). Dekati lokasi outlet lalu coba lagi`, '!'); }
          entry.openedLocation = { label: check.settings.label, distance: Math.round(check.distance), accuracy: Math.round(check.accuracy || 0), latitude: check.latitude, longitude: check.longitude };
        } catch (error) { submit.disabled = false; submit.textContent = originalLabel; return toast(error.message, '!'); }
      }
      state.shifts.push(entry); state.activeShiftId = entry.id; state.orderNo = 1; state.cart = []; state.selectedCustomer = null; state.promo = null;
      save(); closeModal(); renderAll(); toast('Shift dibuka · pesanan dimulai dari A-001', '◷');
    });
    return;
  }
  const summary = shiftSummary(shift); const hasCart = state.cart.length > 0; const activeOrders = summary.orders.filter(order => ['new', 'making', 'ready'].includes(order.status)); const cannotClose = hasCart || activeOrders.length > 0;
  const closingNotice = hasCart ? 'Keranjang masih berisi pesanan. Kosongkan atau selesaikan transaksi sebelum menutup shift.' : activeOrders.length ? `${activeOrders.length} pesanan shift ini masih aktif di KDS. Tandai seluruhnya selesai sebelum menutup shift.` : 'Setelah shift ditutup, katalog dan pembayaran akan terkunci sampai shift baru dibuka.';
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Tutup shift</h2><p>Dibuka ${transactionDateTime(shift.startedAt)} oleh ${escapeHTML(shift.startedBy)}</p></div><button class="modal-close">×</button></div><form id="close-shift-form"><div class="modal-body"><div class="shift-summary-grid"><div><span>Durasi</span><strong>${shiftDuration(shift)}</strong></div><div><span>Transaksi</span><strong>${summary.orders.length}</strong></div><div><span>Penjualan tunai</span><strong>${rupiah(summary.cash)}</strong></div><div><span>Penjualan QRIS</span><strong>${rupiah(summary.qris)}</strong></div></div><div class="payment-total-box"><span>KAS SEHARUSNYA</span><strong>${rupiah(summary.expectedCash)}</strong></div><div class="summary-line"><span>Kas awal</span><strong>${rupiah(shift.openingCash)}</strong></div><div class="summary-line"><span>Penjualan tunai</span><strong>${rupiah(summary.cash)}</strong></div><div class="field shift-actual-field"><label>Kas aktual saat ditutup</label><input name="actualCash" id="actual-cash" type="number" min="0" step="1000" value="${summary.expectedCash}" required></div><div class="cash-difference" id="cash-difference"></div><div class="notice ${cannotClose ? 'danger-notice' : ''}">${closingNotice}</div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Kembali</button><button type="submit" class="button-primary" ${cannotClose ? 'disabled' : ''}>Konfirmasi tutup shift</button></div></form>`, true);
  const drawDifference = () => { const difference = (Number($('#actual-cash').value) || 0) - summary.expectedCash; $('#cash-difference').innerHTML = `<span>Selisih kas</span><strong class="${difference < 0 ? 'negative' : ''}">${difference > 0 ? '+' : ''}${rupiah(difference)}</strong>`; };
  $('#actual-cash').addEventListener('input', drawDifference); drawDifference();
  $('#close-shift-form').addEventListener('submit', event => {
    event.preventDefault(); if (state.cart.length) return toast('Keranjang harus kosong sebelum shift ditutup', '!');
    if (shiftOrders(shift).some(order => ['new', 'making', 'ready'].includes(order.status))) return toast('Selesaikan pesanan aktif di KDS terlebih dahulu', '!');
    const actualCash = Math.max(0, Number(new FormData(event.currentTarget).get('actualCash')) || 0);
    Object.assign(shift, { endedAt: Date.now(), endedById: currentUser.id, endedBy: currentUser.name, actualCash, expectedCash: summary.expectedCash, cashDifference: actualCash - summary.expectedCash, status: 'closed' });
    state.activeShiftId = null; state.selectedCustomer = null; state.promo = null; save(); closeModal(); renderAll(); toast('Shift berhasil ditutup · transaksi dikunci', '✓');
  });
}

function renderAll() { renderCategories(); renderProducts(); renderCart(); renderKDS(); renderInventory(); renderCustomers(); renderTransactions(); renderAttendance(); renderReports(); renderPayslip(); renderAccounts(); renderShiftState(); updateNetworkUI(); }

const todayLabel = new Intl.DateTimeFormat('id-ID',{weekday:'long',day:'numeric',month:'long',timeZone:'Asia/Jakarta'}).format(new Date());
const pageMeta = { pos:['Kasir',todayLabel], kds:['Barista','ANTREAN PRODUKSI'], inventory:['Inventori','BAHAN & RESEP'], customers:['Pelanggan','LOYALTY'], transactions:['Riwayat','TRANSAKSI & NOTA'], attendance:['Absensi','KEHADIRAN KARYAWAN'], reports:['Laporan','PERFORMA OUTLET'], payslip:['Slip Gaji','GAJI KARYAWAN'], accounts:['Akun','PENGGUNA & PERAN'] };
function switchView(view) {
  if (!canAccess(view)) return toast('Anda tidak memiliki akses ke halaman tersebut','!');
  $$('.view').forEach(v=>v.classList.toggle('active', v.id===`view-${view}`));
  $$('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.view===view));
  $('#page-title').textContent = pageMeta[view][0]; $('#page-eyebrow').textContent = pageMeta[view][1];
  $('.sidebar').classList.remove('open');
  if (view==='kds') renderKDS(); if (view==='transactions') renderTransactions(); if (view==='attendance') renderAttendance(); if (view==='reports') renderReports(); if (view==='payslip') renderPayslip(); if (view==='accounts') renderAccounts();
}

function updateNetworkUI() {
  $('#sync-card').classList.toggle('offline', !state.networkOnline);
  $('#sync-label').textContent = state.networkOnline ? 'Tersinkron' : 'Mode offline';
  $('#sync-time').textContent = state.networkOnline ? 'Baru saja' : `${state.orders.filter(o=>o.status!=='done').length} data mengantre`;
}

function showStockForm(item = null) {
  if (!state.inventory.length) return toast('Tambahkan item inventori terlebih dahulu', '!');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Penyesuaian stok</h2><p>Tambah, kurangi, atau tetapkan jumlah stok aktual</p></div><button class="modal-close">×</button></div><form id="stock-form"><div class="modal-body"><div class="form-grid"><div class="field full"><label>Item inventori</label><select name="ingredient" id="stock-ingredient">${state.inventory.map(i=>`<option value="${i.id}" ${item && String(item.id)===String(i.id)?'selected':''}>${isPremixItem(i) ? '[Premix]' : '[Murni]'} ${escapeHTML(i.name)} · ${formatQuantity(i.stock, i.unit)}</option>`).join('')}</select></div><div class="field"><label>Jenis penyesuaian</label><select name="mode" id="stock-mode"><option value="add">Tambah stok / belanja</option><option value="subtract">Kurangi stok</option><option value="set">Set stok aktual</option></select></div><div class="field"><label>Jumlah</label><input id="stock-amount" type="number" name="amount" min="0" step="0.01" required placeholder="0"></div><div class="field"><label>Satuan jumlah</label><select name="unit" id="stock-unit"></select></div><div class="field full" id="purchase-cost-field"><label>Total beban belanja (Rp)</label><input id="purchase-cost" type="number" name="purchaseCost" min="0" step="1000" required placeholder="Contoh: 150000"></div><div class="field full"><label>Referensi / alasan</label><input name="ref" maxlength="80" placeholder="Nomor invoice, toko pemasok, waste, koreksi..."></div></div><div class="notice">Masukkan jumlah dalam <strong>ml/gram</strong> atau <strong>L/kg</strong>. Angka 1.000 ml/gram otomatis dibaca sebagai 1 L/kg.</div><div class="stock-preview" id="stock-preview"></div><div class="notice" id="purchase-cost-note">Nominal belanja akan masuk ke laporan keuangan pada tanggal pencatatan ini.</div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Simpan pergerakan</button></div></form>`);
  const syncUnits = () => {
    const ingredient = state.inventory.find(i => String(i.id) === $('#stock-ingredient').value); if (!ingredient) return;
    const options = quantityInputUnits(ingredient.unit);
    $('#stock-unit').innerHTML = options.map(option => `<option value="${option.value}">${escapeHTML(option.label)}</option>`).join('');
    $('#stock-unit').value = options[0].value;
  };
  const updatePreview = () => {
    const ingredient = state.inventory.find(i => String(i.id) === $('#stock-ingredient').value); if (!ingredient) return;
    const premix = isPremixItem(ingredient);
    const addOption = $('#stock-mode').querySelector('option[value="add"]');
    addOption.disabled = premix;
    addOption.textContent = premix ? 'Tambah stok (gunakan Produksi premix)' : 'Tambah stok / belanja';
    if (premix && $('#stock-mode').value === 'add') $('#stock-mode').value = 'set';
    const inputUnit = $('#stock-unit').value || ingredient.unit;
    const inputAmount = Math.max(0, Number($('#stock-amount').value) || 0);
    const amount = convertQuantity(inputAmount, inputUnit, ingredient.unit);
    const mode = $('#stock-mode').value;
    const purchaseField = $('#purchase-cost-field'); const purchaseInput = $('#purchase-cost'); const isPurchase = mode === 'add' && !premix; purchaseField.hidden = !isPurchase; purchaseInput.required = isPurchase;
    const note = $('#purchase-cost-note');
    note.hidden = !isPurchase && !premix;
    note.textContent = premix ? 'Stok premix ditambah melalui Produksi premix agar bahan murni ikut berkurang. Di sini hanya untuk koreksi atau stock opname.' : 'Nominal belanja akan masuk ke laporan keuangan pada tanggal pencatatan ini.';
    const after = mode === 'add' ? ingredient.stock + amount : mode === 'subtract' ? Math.max(0, ingredient.stock - amount) : amount;
    const conversion = normalizeUnit(inputUnit) !== normalizeUnit(ingredient.unit) && inputAmount > 0 ? `<small>${formatQuantity(inputAmount, inputUnit)} = ${formatQuantity(amount, ingredient.unit)}</small>` : '';
    $('#stock-preview').innerHTML = `<span>Stok saat ini <strong>${formatQuantity(ingredient.stock, ingredient.unit)}</strong></span><b>→</b><span>Setelah disimpan <strong>${formatQuantity(after, ingredient.unit)}</strong>${conversion}</span>`;
  };
  $('#stock-ingredient').addEventListener('change', () => { syncUnits(); updatePreview(); });
  $('#stock-mode').addEventListener('change', updatePreview); $('#stock-amount').addEventListener('input', updatePreview); $('#stock-unit').addEventListener('change', updatePreview);
  syncUnits(); updatePreview();
  $('#stock-form').addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const ingredient = state.inventory.find(i => String(i.id) === data.get('ingredient')); if (!ingredient) return;
    const mode = data.get('mode'); const inputUnit = data.get('unit') || ingredient.unit; const amount = convertQuantity(Math.max(0, Number(data.get('amount')) || 0), inputUnit, ingredient.unit);
    if (isPremixItem(ingredient) && mode === 'add') return toast('Gunakan Produksi premix untuk menambah stok premix', '!');
    if (mode !== 'set' && amount <= 0) return toast('Jumlah perubahan harus lebih dari 0', '!');
    if (mode === 'subtract' && amount > ingredient.stock) return toast('Jumlah pengurangan melebihi stok tersedia', '!');
    const before = ingredient.stock; ingredient.stock = Number((mode === 'add' ? before + amount : mode === 'subtract' ? before - amount : amount).toFixed(3));
    state.inventoryMovements.unshift({ id: crypto.randomUUID(), ingredientId: ingredient.id, mode, amount, before, after: ingredient.stock, reference: data.get('ref').trim(), purchaseCost: mode === 'add' ? Math.max(0, Number(data.get('purchaseCost')) || 0) : 0, createdAt: Date.now(), userId: currentUser?.id || null });
    save(); closeModal(); renderInventory($('#inventory-search').value); renderReports(); toast(`Stok ${ingredient.name} diperbarui`, mode === 'subtract' ? '↘' : '↙');
  });
}

function showInventoryItemForm(item = null) {
  if (!canManageSales()) return toast('Hanya admin yang dapat mengelola item inventori', '!');
  if (item && isPremixItem(item)) return showPremixForm(item);
  const presetUnits = ['ml', 'gram', 'L', 'kg', 'pcs', 'cup', 'porsi', 'pack', 'botol', 'sachet'];
  const units = [...new Set([...presetUnits, item?.unit].filter(Boolean).map(canonicalUnit))];
  const selectedUnit = item ? canonicalUnit(item.unit) : '';
  const unitLabels = { ml: 'Mililiter (ml)', gram: 'Gram (gram)', L: 'Liter (L)', kg: 'Kilogram (kg)', pcs: 'Pieces (pcs)', cup: 'Cup', porsi: 'Porsi', pack: 'Pack', botol: 'Botol', sachet: 'Sachet' };
  const unitOptions = `<option value="" disabled ${selectedUnit ? '' : 'selected'}>Pilih satuan</option>${units.map(unit => `<option value="${escapeHTML(unit)}" ${unit === selectedUnit ? 'selected' : ''}>${escapeHTML(unitLabels[unit] || unit)}</option>`).join('')}`;
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${item ? 'Edit' : 'Tambah'} bahan murni</h2><p>Atur identitas, satuan, harga acuan, dan batas minimum persediaan</p></div><button class="modal-close">×</button></div><form id="inventory-item-form"><div class="modal-body"><div class="form-grid"><div class="field"><label>Nama item</label><input name="name" required maxlength="60" value="${escapeHTML(item?.name || '')}" placeholder="Contoh: Sirup pandan"></div><div class="field"><label>SKU / kode</label><input name="sku" required maxlength="30" value="${escapeHTML(item?.sku || '')}" placeholder="BB-SIR-06"></div><div class="field"><label>Kategori</label><input name="category" required maxlength="30" value="${escapeHTML(item?.category || '')}" placeholder="Sirup"></div><div class="field"><label>Ikon</label><input name="icon" maxlength="4" value="${escapeHTML(item?.icon || '◇')}" placeholder="◇"></div><div class="field"><label>Satuan</label><select name="unit" id="inventory-unit" required>${unitOptions}</select></div>${item ? '' : '<div class="field"><label>Stok awal</label><input name="stock" type="number" min="0" step="0.01" required value="0"></div>'}<div class="field"><label>Stok minimum</label><input name="min" type="number" min="0" step="0.01" required value="${item?.min ?? 0}"></div><div class="field"><label>Kapasitas maksimum</label><input name="max" type="number" min="0.01" step="0.01" required value="${item?.max ?? ''}" placeholder="10"></div><div class="field"><label>Harga beli acuan (Rp)</label><input name="costPrice" type="number" min="0" step="0.01" value="${item?.costPrice ?? ''}" placeholder="Contoh: 50000"></div><div class="field"><label id="package-size-label">Isi per kemasan (${escapeHTML(selectedUnit || 'satuan')})</label><input name="packageSize" type="number" min="0" step="0.001" value="${item?.packageSize ?? ''}" placeholder="Contoh: 1"></div></div><div class="notice">Gunakan <strong>ml</strong> atau <strong>gram</strong> sebagai satuan bahan cair/bubuk. Jumlah 1.000 ml/gram otomatis ditampilkan sebagai 1 L/kg.</div><div class="notice">Harga beli acuan dipakai untuk menghitung HPP premix dan resep. Isi per kemasan memakai satuan item, misalnya 1 L atau 1 kg.</div>${item ? `<div class="notice">Stok saat ini: <strong>${formatQuantity(item.stock, item.unit)}</strong>. Gunakan Penyesuaian stok untuk menambah, mengurangi, atau melakukan stock opname.</div>` : ''}</div><div class="modal-footer">${item ? '<button type="button" class="button-ghost danger-button" id="delete-inventory-item">Hapus item</button>' : '<button type="button" class="button-ghost modal-close">Batal</button>'}<button type="submit" class="button-primary">Simpan item</button></div></form>`, true);
  let currentUnit = selectedUnit;
  $('#inventory-unit').addEventListener('change', event => {
    const nextUnit = event.target.value;
    if (!currentUnit || !nextUnit || nextUnit === currentUnit) { currentUnit = nextUnit; return; }
    ['stock', 'min', 'max', 'packageSize'].forEach(name => {
      const input = $(`[name="${name}"]`, $('#inventory-item-form'));
      if (!input) return;
      input.value = Number(convertQuantity(Number(input.value) || 0, currentUnit, nextUnit).toFixed(3));
    });
    currentUnit = nextUnit;
    const label = $('#package-size-label');
    if (label) label.textContent = `Isi per kemasan (${nextUnit || 'satuan'})`;
  });
  $('#inventory-item-form').addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const sku = data.get('sku').trim().toUpperCase();
    if (state.inventory.some(existing => existing !== item && existing.sku.toUpperCase() === sku)) return toast('SKU sudah digunakan item lain', '!');
    const unit = canonicalUnit(data.get('unit'));
    const min = Math.max(0, Number(data.get('min')) || 0); const max = Math.max(0, Number(data.get('max')) || 0);
    if (max <= min) return toast('Kapasitas maksimum harus lebih besar dari stok minimum', '!');
    const stock = item ? Number(convertQuantity(item.stock, item.unit, unit).toFixed(3)) : Math.max(0, Number(data.get('stock')) || 0);
    if (item && normalizeUnit(item.unit) !== normalizeUnit(unit)) {
      state.inventoryMovements.filter(movement => String(movement.ingredientId) === String(item.id)).forEach(movement => {
        ['amount', 'before', 'after'].forEach(key => { if (movement[key] != null) movement[key] = Number(convertQuantity(movement[key], item.unit, unit).toFixed(3)); });
      });
    }
    const entry = { id: item?.id || crypto.randomUUID(), name: data.get('name').trim(), sku, category: data.get('category').trim(), icon: data.get('icon').trim() || '◇', unit, stock, min, max, costPrice: Math.max(0, Number(data.get('costPrice')) || 0), packageSize: Math.max(0, Number(data.get('packageSize')) || 0), kind: 'pure' };
    if (item) Object.assign(item, entry); else state.inventory.push(entry);
    save(); closeModal(); renderInventory($('#inventory-search').value); renderReports(); toast('Item inventori berhasil disimpan', '◇');
  });
  $('#delete-inventory-item')?.addEventListener('click', async () => {
    if (!await confirmDialog(`Hapus item ${item.name}? Riwayat transaksi tidak ikut terhapus.`, { title: 'Hapus item inventori', confirmLabel: 'Hapus' })) return;
    const index = state.inventory.findIndex(existing => String(existing.id) === String(item.id)); if (index >= 0) state.inventory.splice(index, 1);
    state.recipes.forEach(recipe => recipe.components.forEach(component => { if (String(component.ingredientId) === String(item.id)) { component.ingredientId = null; component.trackStock = false; } }));
    state.inventory.filter(isPremixItem).forEach(premix => { premix.components = (premix.components || []).filter(component => String(component.ingredientId) !== String(item.id)); });
    save(); closeModal(); renderInventory($('#inventory-search').value); renderReports(); toast('Item inventori dihapus');
  });
}

function premixComponentRow(component = {}) {
  const options = state.inventory.filter(item => !isPremixItem(item)).map(item => `<option value="${item.id}" ${component.ingredientId && String(component.ingredientId) === String(item.id) ? 'selected' : ''} data-unit="${escapeHTML(item.unit)}">${escapeHTML(item.name)} · ${escapeHTML(canonicalUnit(item.unit))}</option>`).join('');
  return `<div class="premix-component-row" data-premix-component="${component.id || crypto.randomUUID()}"><label><span>Bahan murni</span><select data-premix-ingredient><option value="">Pilih bahan</option>${options}</select></label><label><span>Jumlah</span><input data-premix-qty type="number" min="0.001" step="0.001" required value="${component.qty ?? ''}" placeholder="0"></label><label><span>Satuan</span><input data-premix-unit required maxlength="12" value="${escapeHTML(component.unit || '')}" placeholder="ml / gram"></label><button type="button" class="premix-remove" title="Hapus bahan">×</button></div>`;
}

function showPremixForm(premix = null) {
  if (!canManageSales()) return toast('Hanya admin yang dapat mengelola bahan premix', '!');
  const pureItems = state.inventory.filter(item => !isPremixItem(item));
  if (!pureItems.length) return toast('Tambahkan bahan murni terlebih dahulu', '!');
  const presetUnits = ['L', 'ml', 'kg', 'gram', 'pcs', 'cup'];
  const selectedUnit = premix ? canonicalUnit(premix.unit) : 'L';
  const units = [...new Set([...presetUnits, selectedUnit].filter(Boolean))];
  const unitLabels = { ml: 'Mililiter (ml)', gram: 'Gram (gram)', L: 'Liter (L)', kg: 'Kilogram (kg)', pcs: 'Pieces (pcs)', cup: 'Cup' };
  const unitOptions = units.map(unit => `<option value="${escapeHTML(unit)}" ${unit === selectedUnit ? 'selected' : ''}>${escapeHTML(unitLabels[unit] || unit)}</option>`).join('');
  const rows = (premix?.components?.length ? premix.components : [{}]).map(premixComponentRow).join('');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${premix ? 'Edit' : 'Tambah'} bahan premix</h2><p>Premix diracik dari bahan murni dan dipakai resep/HPP</p></div><button class="modal-close">×</button></div><form id="premix-form"><div class="modal-body"><div class="form-grid"><div class="field"><label>Nama premix</label><input name="name" required maxlength="60" value="${escapeHTML(premix?.name || '')}" placeholder="Contoh: Premix Kopi Susu"></div><div class="field"><label>SKU / kode</label><input name="sku" required maxlength="30" value="${escapeHTML(premix?.sku || '')}" placeholder="PMX-KOPI"></div><div class="field"><label>Kategori</label><input name="category" required maxlength="30" value="${escapeHTML(premix?.category || 'Premix')}" placeholder="Premix"></div><div class="field"><label>Ikon</label><input name="icon" maxlength="4" value="${escapeHTML(premix?.icon || '◈')}" placeholder="◈"></div><div class="field"><label>Satuan hasil</label><select name="unit" id="premix-unit" required>${unitOptions}</select></div><div class="field"><label>Hasil per batch</label><input name="yieldQty" id="premix-yield" type="number" min="0.001" step="0.001" required value="${premix?.yieldQty ?? 1}"></div><div class="field"><label>Stok minimum</label><input name="min" type="number" min="0" step="0.01" required value="${premix?.min ?? 1}"></div><div class="field"><label>Kapasitas maksimum</label><input name="max" type="number" min="0.01" step="0.01" required value="${premix?.max ?? 10}"></div></div><div class="premix-builder"><div class="premix-builder-head"><div><h3>Komposisi per batch</h3><p>Jumlah bahan murni untuk menghasilkan satu batch premix</p></div><button type="button" id="add-premix-component">＋ Bahan</button></div><div id="premix-components">${rows}</div></div><div class="premix-cost-preview" id="premix-cost-preview"></div><div class="notice">HPP premix dihitung otomatis dari harga acuan bahan murni. Perbarui harga acuan di tabel bahan murni bila harga beli berubah.</div></div><div class="modal-footer">${premix ? '<button type="button" class="button-ghost danger-button" id="delete-premix">Hapus premix</button>' : ''}<button type="submit" class="button-primary">Simpan premix</button></div></form>`, true);
  const collectComponents = () => $$('[data-premix-component]', $('#modal')).map(row => ({
    id: row.dataset.premixComponent,
    ingredientId: $('[data-premix-ingredient]', row).value || null,
    qty: Number($('[data-premix-qty]', row).value) || 0,
    unit: $('[data-premix-unit]', row).value.trim()
  })).filter(component => component.ingredientId);
  const draft = () => ({ id: premix?.id || 'draft', name: $('#premix-form [name="name"]').value, unit: $('#premix-unit').value, yieldQty: Number($('#premix-yield').value) || 0, components: collectComponents() });
  const updatePreview = () => {
    const item = draft(); const total = item.components.reduce((sum, component) => { const pure = itemById(component.ingredientId); return sum + (pure ? convertQuantity(component.qty, component.unit, pure.unit) * inventoryUnitCost(pure) : 0); }, 0);
    const unitCost = premixUnitCost(item);
    $('#premix-cost-preview').innerHTML = `<span>Biaya batch<strong>${rupiah(total)}</strong></span><span>HPP / ${escapeHTML(canonicalUnit(item.unit))}<strong>${rupiah(unitCost)}</strong></span><span>Bahan murni<strong>${item.components.length}</strong></span>`;
  };
  $('#premix-components').addEventListener('input', updatePreview);
  $('#premix-components').addEventListener('change', event => {
    if (event.target.matches('[data-premix-ingredient]')) {
      const row = event.target.closest('[data-premix-component]'); const pure = itemById(event.target.value);
      if (pure) { const normalized = normalizeUnit(pure.unit); $('[data-premix-unit]', row).value = normalized === 'l' ? 'ml' : normalized === 'kg' ? 'gram' : canonicalUnit(pure.unit); }
    }
    updatePreview();
  });
  $('#premix-components').addEventListener('click', event => { const remove = event.target.closest('.premix-remove'); if (remove) { remove.closest('[data-premix-component]').remove(); updatePreview(); } });
  $('#add-premix-component').addEventListener('click', () => { $('#premix-components').insertAdjacentHTML('beforeend', premixComponentRow()); updatePreview(); });
  let currentUnit = selectedUnit;
  $('#premix-unit').addEventListener('change', event => {
    const nextUnit = event.target.value;
    if (currentUnit && nextUnit && nextUnit !== currentUnit) $('#premix-yield').value = Number(convertQuantity(Number($('#premix-yield').value) || 0, currentUnit, nextUnit).toFixed(4));
    currentUnit = nextUnit; updatePreview();
  });
  $('#premix-yield').addEventListener('input', updatePreview);
  updatePreview();
  $('#premix-form').addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const sku = String(data.get('sku') || '').trim().toUpperCase();
    if (state.inventory.some(existing => existing !== premix && String(existing.sku || '').toUpperCase() === sku)) return toast('SKU sudah digunakan item lain', '!');
    const unit = canonicalUnit(data.get('unit')); const yieldQty = Math.max(0, Number(data.get('yieldQty')) || 0);
    const min = Math.max(0, Number(data.get('min')) || 0); const max = Math.max(0, Number(data.get('max')) || 0);
    if (yieldQty <= 0) return toast('Hasil per batch harus lebih dari 0', '!');
    if (max <= min) return toast('Kapasitas maksimum harus lebih besar dari stok minimum', '!');
    const components = collectComponents().map(component => ({ ...component, qty: Number(component.qty) || 0 }));
    if (!components.length) return toast('Tambahkan minimal satu bahan murni', '!');
    if (components.some(component => component.qty <= 0 || !component.unit)) return toast('Lengkapi jumlah dan satuan komposisi', '!');
    if (components.some(component => { const pure = itemById(component.ingredientId); return !pure || isPremixItem(pure); })) return toast('Komposisi premix hanya boleh memakai bahan murni', '!');
    const stock = premix ? Number(convertQuantity(premix.stock, premix.unit, unit).toFixed(3)) : 0;
    const entry = { id: premix?.id || crypto.randomUUID(), name: String(data.get('name') || '').trim(), sku, category: String(data.get('category') || '').trim() || 'Premix', icon: String(data.get('icon') || '').trim() || '◈', unit, stock, min, max, kind: 'premix', yieldQty, components };
    if (premix) Object.assign(premix, entry); else state.inventory.push(entry);
    save(); closeModal(); renderInventory($('#inventory-search').value); renderReports(); toast('Bahan premix berhasil disimpan', '◈');
  });
  $('#delete-premix')?.addEventListener('click', async () => {
    if (!await confirmDialog(`Hapus premix ${premix.name}? Resep yang memakainya perlu diperbarui.`, { title: 'Hapus bahan premix', confirmLabel: 'Hapus' })) return;
    const index = state.inventory.findIndex(existing => String(existing.id) === String(premix.id)); if (index >= 0) state.inventory.splice(index, 1);
    state.recipes.forEach(recipe => recipe.components.forEach(component => { if (String(component.ingredientId) === String(premix.id)) { component.ingredientId = null; component.trackStock = false; } }));
    save(); closeModal(); renderInventory($('#inventory-search').value); renderReports(); toast('Bahan premix dihapus');
  });
}

function showPremixProduction(premix = null) {
  if (!canManageSales()) return toast('Hanya admin yang dapat memproduksi premix', '!');
  const premixes = state.inventory.filter(isPremixItem);
  if (!premixes.length) return toast('Belum ada bahan premix. Tambahkan premix terlebih dahulu.', '!');
  const initial = premix && isPremixItem(premix) ? premix : premixes[0];
  const options = premixes.map(item => `<option value="${item.id}" ${item === initial ? 'selected' : ''}>${escapeHTML(item.name)} · ${escapeHTML(formatQuantity(item.stock, item.unit))}</option>`).join('');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Produksi premix</h2><p>Campur bahan murni menjadi stok premix siap pakai</p></div><button class="modal-close">×</button></div><form id="premix-production-form"><div class="modal-body"><div class="form-grid"><div class="field full"><label>Bahan premix</label><select name="premix" id="production-premix">${options}</select></div><div class="field"><label>Jumlah produksi</label><input name="amount" id="production-amount" type="number" min="0.001" step="0.001" required value="${Number(initial.yieldQty) || 1}"></div><div class="field"><label>Satuan hasil</label><select name="unit" id="production-unit"></select></div><div class="field full"><label>Referensi / catatan</label><input name="ref" maxlength="80" placeholder="Contoh: Batch pagi"></div></div><div class="production-preview" id="production-preview"></div><div class="notice">Produksi tidak dihitung sebagai belanja baru. Beban belanja tetap tercatat saat bahan murni dibeli.</div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Mulai produksi</button></div></form>`, true);
  const syncUnits = target => {
    const unitOptions = quantityInputUnits(target.unit);
    const preferred = unitOptions.find(option => normalizeUnit(option.value) === normalizeUnit(target.unit)) || unitOptions[0];
    $('#production-unit').innerHTML = unitOptions.map(option => `<option value="${option.value}">${escapeHTML(option.label)}</option>`).join('');
    $('#production-unit').value = preferred.value;
  };
  const calculate = () => {
    const current = itemById($('#production-premix').value); if (!current) return null;
    const unit = $('#production-unit').value || current.unit;
    const output = convertQuantity(Math.max(0, Number($('#production-amount').value) || 0), unit, current.unit);
    const scale = Number(current.yieldQty) > 0 ? output / Number(current.yieldQty) : 0;
    const requirements = (current.components || []).map(component => {
      const pure = itemById(component.ingredientId);
      const required = pure && !isPremixItem(pure) ? convertQuantity(component.qty, component.unit, pure.unit) * scale : 0;
      return { pure, required, enough: pure ? required <= Number(pure.stock) + 0.000001 : false };
    });
    const cost = requirements.reduce((sum, row) => sum + (row.pure ? row.required * inventoryUnitCost(row.pure) : 0), 0);
    return { premix: current, unit, output, requirements, cost };
  };
  const render = () => {
    const data = calculate(); if (!data) return;
    const { premix: current, requirements, output, cost } = data;
    const rows = requirements.map(({ pure, required, enough }) => `<div class="production-row ${enough ? '' : 'short'}"><span>${pure ? escapeHTML(pure.name) : 'Bahan dihapus'}</span><span>${pure ? formatQuantity(required, pure.unit) : '—'}</span><span>${pure ? formatQuantity(pure.stock, pure.unit) : '—'}</span></div>`).join('');
    const short = requirements.some(row => row.pure && !row.enough);
    $('#production-preview').innerHTML = `<div class="production-list"><div class="production-row head"><span>Bahan murni</span><span>Dibutuhkan</span><span>Stok</span></div>${rows || '<div class="production-empty">Komposisi premix belum diisi.</div>'}</div><div class="production-summary"><span>Hasil<strong>${formatQuantity(output, current.unit)}</strong></span><span>Biaya batch<strong>${rupiah(cost)}</strong></span><span>Stok premix setelah<strong>${formatQuantity(Number(current.stock) + output, current.unit)}</strong></span></div>${short ? '<div class="notice danger-notice">Stok bahan murni belum cukup untuk jumlah produksi ini.</div>' : ''}`;
  };
  $('#production-premix').addEventListener('change', event => { const current = itemById(event.target.value); if (current) { syncUnits(current); $('#production-amount').value = Number(current.yieldQty) || 1; } render(); });
  $('#production-amount').addEventListener('input', render);
  $('#production-unit').addEventListener('change', render);
  syncUnits(initial); render();
  $('#premix-production-form').addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const current = itemById(data.get('premix')); if (!current) return;
    const unit = data.get('unit') || current.unit; const output = convertQuantity(Math.max(0, Number(data.get('amount')) || 0), unit, current.unit);
    if (output <= 0) return toast('Jumlah produksi harus lebih dari 0', '!');
    const scale = Number(current.yieldQty) > 0 ? output / Number(current.yieldQty) : 0;
    if (!scale) return toast('Hasil per batch premix belum diatur', '!');
    const requirements = (current.components || []).map(component => { const pure = itemById(component.ingredientId); return pure && !isPremixItem(pure) ? { pure, required: convertQuantity(component.qty, component.unit, pure.unit) * scale } : null; }).filter(Boolean);
    if (!requirements.length) return toast('Komposisi premix belum diisi', '!');
    const short = requirements.filter(row => row.required > Number(row.pure.stock) + 0.000001);
    if (short.length) return toast(`Stok bahan murni tidak cukup: ${short.map(row => row.pure.name).join(', ')}`, '!');
    const productionId = crypto.randomUUID(); const createdAt = Date.now(); const reference = String(data.get('ref') || '').trim() || `Produksi ${current.name}`;
    requirements.forEach(({ pure, required }) => {
      const before = Number(pure.stock) || 0; pure.stock = Number((before - required).toFixed(3));
      state.inventoryMovements.unshift({ id: crypto.randomUUID(), ingredientId: pure.id, mode: 'subtract', amount: Number(required.toFixed(3)), before, after: pure.stock, reference: `Produksi ${current.name}`, productionId, createdAt, userId: currentUser?.id || null });
    });
    const before = Number(current.stock) || 0; current.stock = Number((before + output).toFixed(3));
    state.inventoryMovements.unshift({ id: crypto.randomUUID(), ingredientId: current.id, mode: 'production', amount: Number(output.toFixed(3)), before, after: current.stock, reference, productionId, purchaseCost: 0, createdAt, userId: currentUser?.id || null });
    save(); closeModal(); renderInventory($('#inventory-search').value); renderReports(); toast(`Produksi ${current.name} ${formatQuantity(output, current.unit)} selesai`, '▣');
  });
}

function showHppManager() {
  if (!canManageSales()) return toast('Hanya admin yang dapat mengelola resep dan HPP', '!');
  const drinkProducts = products.filter(product => product.type !== 'retail');
  const cards = drinkProducts.map(product => {
    const recipe = recipeForProduct(product.id); const hpp = recipeHpp(recipe); const price = productPrice(product); const foodCost = price ? hpp / price * 100 : 0;
    return `<article class="hpp-card ${recipe ? '' : 'missing'}"><div><span class="hpp-status">${recipe ? `${recipe.components.length} KOMPONEN` : 'BELUM ADA RESEP'}</span><h3>${escapeHTML(product.name)}</h3><p>${recipe ? `HPP ${rupiah(hpp)} · ${foodCost.toFixed(1)}% dari harga jual` : 'Penjualan produk ini belum mengurangi stok otomatis.'}</p></div><div class="hpp-card-value"><strong>${rupiah(price)}</strong><small>Harga POS</small><button data-recipe-edit="${product.id}">${recipe ? 'Edit resep' : 'Buat resep'}</button></div></article>`;
  }).join('');
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Resep & HPP</h2><p>Resep memakai bahan premix; bahan murni tanpa premix tetap bisa dipilih langsung</p></div><button class="modal-close">×</button></div><div class="modal-body"><div class="hpp-list">${cards || '<div class="empty-inline"><strong>Belum ada menu minuman</strong></div>'}</div><div class="notice">Stok berkurang sesuai komponen resep: premix untuk bahan yang diracik, bahan murni untuk yang tidak dipremix. Biaya pekerja dan es tetap masuk HPP tanpa mengurangi stok.</div></div><div class="modal-footer"><button class="button-primary modal-close">Selesai</button></div>`, true);
  $$('[data-recipe-edit]', $('#modal')).forEach(button => button.addEventListener('click', () => showRecipeEditor(button.dataset.recipeEdit)));
}

function recipeComponentRow(component = {}) {
  const option = item => `<option value="${item.id}" ${component.ingredientId && String(component.ingredientId) === String(item.id) ? 'selected' : ''} data-name="${escapeHTML(item.name)}" data-unit="${escapeHTML(item.unit)}" data-kind="${isPremixItem(item) ? 'premix' : 'pure'}">${escapeHTML(item.name)} · ${escapeHTML(canonicalUnit(item.unit))}</option>`;
  const premixOptions = state.inventory.filter(isPremixItem).map(option).join('');
  const pureOptions = state.inventory.filter(item => !isPremixItem(item)).map(option).join('');
  const groups = `${premixOptions ? `<optgroup label="Bahan premix">${premixOptions}</optgroup>` : ''}${pureOptions ? `<optgroup label="Bahan murni">${pureOptions}</optgroup>` : ''}`;
  return `<div class="recipe-component-row" data-recipe-component="${component.id || crypto.randomUUID()}" data-cost-type="${escapeHTML(component.costType || '')}"><label><span>Item stok</span><select data-component-ingredient><option value="">Biaya non-stok</option>${groups}</select></label><label><span>Nama komponen</span><input data-component-name required value="${escapeHTML(component.name || '')}" placeholder="Nama bahan / biaya"></label><label><span>Pemakaian</span><input data-component-qty type="number" min="0.001" step="0.001" required value="${component.qty ?? ''}"></label><label><span>Satuan</span><input data-component-unit required maxlength="12" value="${escapeHTML(component.unit || '')}" placeholder="ml / gram"></label><label><span>Harga acuan</span><input data-component-price type="number" min="0" step="0.01" required value="${component.costPrice ?? ''}"></label><label><span>Isi acuan</span><input data-component-size type="number" min="0.001" step="0.001" required value="${component.packageSize ?? ''}"></label><button type="button" class="recipe-remove" title="Hapus komponen">×</button></div>`;
}

function showRecipeEditor(productId) {
  const product = products.find(item => String(item.id) === String(productId)); if (!product) return;
  const recipe = recipeForProduct(product.id); const components = recipe?.components || [];
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Resep ${escapeHTML(product.name)}</h2><p>Pilih bahan premix atau murni, lalu atur pemakaian per gelas</p></div><button class="modal-close">×</button></div><form id="recipe-form"><div class="modal-body"><div class="recipe-columns"><span>ITEM STOK</span><span>NAMA</span><span>QTY</span><span>UNIT</span><span>HARGA ACUAN</span><span>ISI ACUAN</span><span></span></div><div id="recipe-components">${components.map(recipeComponentRow).join('')}</div><button type="button" class="add-recipe-row" id="add-recipe-component">＋ Tambah komponen</button><div class="hpp-live-summary"><span>HPP per gelas<strong id="recipe-hpp-live">Rp0</strong></span><span>Harga jual POS<strong>${rupiah(productPrice(product))}</strong></span><span>Margin kotor<strong id="recipe-margin-live">Rp0</strong></span></div><div class="notice">Pilih <strong>Bahan premix</strong> untuk bahan yang diracik, atau <strong>Bahan murni</strong> untuk bahan yang tidak dipremix (kemasan, sirup, es). Harga acuan terisi otomatis dari inventori; isi manual hanya untuk biaya non-stok seperti pekerja.</div></div><div class="modal-footer">${recipe ? '<button type="button" class="button-ghost danger-button" id="delete-recipe">Hapus resep</button>' : '<button type="button" class="button-ghost" id="back-hpp">Kembali</button>'}<button type="submit" class="button-primary">Simpan resep</button></div></form>`, true);
  const calculateLive = () => {
    const rowHpp = row => {
      const item = itemById($('[data-component-ingredient]', row).value);
      const qty = Number($('[data-component-qty]', row).value) || 0;
      const unit = $('[data-component-unit]', row).value;
      if (item) { const unitCost = inventoryUnitCost(item); if (unitCost > 0) return convertQuantity(qty, unit, item.unit) * unitCost; }
      return (Number($('[data-component-price]', row).value) || 0) / Math.max(Number($('[data-component-size]', row).value) || 0, .0001) * qty;
    };
    const hpp = $$('[data-recipe-component]', $('#modal')).reduce((sum, row) => sum + rowHpp(row), 0);
    $('#recipe-hpp-live').textContent = rupiah(hpp); $('#recipe-margin-live').textContent = rupiah(productPrice(product) - hpp);
  };
  $('#recipe-components').addEventListener('input', calculateLive);
  $('#recipe-components').addEventListener('change', event => {
    if (event.target.matches('[data-component-ingredient]')) {
      const row = event.target.closest('[data-recipe-component]'); const option = event.target.selectedOptions[0];
      if (event.target.value) {
        const item = itemById(event.target.value);
        $('[data-component-name]', row).value = option.dataset.name;
        const stockUnit = option.dataset.unit.toLowerCase(); $('[data-component-unit]', row).value = stockUnit === 'l' ? 'ml' : stockUnit === 'kg' ? 'gram' : stockUnit === 'pcs' ? 'cup' : stockUnit;
        if (item) {
          const previewUnit = $('[data-component-unit]', row).value;
          const size = Number(convertQuantity(Number(item.packageSize) || 0, item.unit, previewUnit).toFixed(4));
          $('[data-component-price]', row).value = Number(item.costPrice) || 0;
          $('[data-component-size]', row).value = size > 0 ? size : 1;
        }
      }
    }
    calculateLive();
  });
  $('#recipe-components').addEventListener('click', event => { const remove = event.target.closest('.recipe-remove'); if (remove) { remove.closest('[data-recipe-component]').remove(); calculateLive(); } });
  $('#add-recipe-component').addEventListener('click', () => { $('#recipe-components').insertAdjacentHTML('beforeend', recipeComponentRow()); calculateLive(); });
  $('#back-hpp')?.addEventListener('click', showHppManager);
  $('#delete-recipe')?.addEventListener('click', async () => { if (!await confirmDialog(`Hapus resep ${product.name}? Stok tidak akan berkurang saat menu ini terjual.`, { title: 'Hapus resep', confirmLabel: 'Hapus' })) return; state.recipes = state.recipes.filter(item => item !== recipe); save(); renderInventory(); showHppManager(); toast('Resep berhasil dihapus'); });
  $('#recipe-form').addEventListener('submit', event => {
    event.preventDefault(); const rows = $$('[data-recipe-component]', $('#modal'));
    if (!rows.length) return toast('Resep harus memiliki minimal satu komponen', '!');
    const updatedComponents = rows.map(row => { const ingredientId = $('[data-component-ingredient]', row).value || null; const name = $('[data-component-name]', row).value.trim(); const costType = row.dataset.costType || (/^(pekerja|bonus|tenaga kerja)$/i.test(name) ? 'labor-per-cup' : null); return { id: row.dataset.recipeComponent, ingredientId, name, qty: Number($('[data-component-qty]', row).value), unit: $('[data-component-unit]', row).value.trim(), costPrice: Number($('[data-component-price]', row).value), packageSize: Number($('[data-component-size]', row).value), trackStock: Boolean(ingredientId), costType }; });
    if (updatedComponents.some(component => !component.name || component.qty <= 0 || component.packageSize <= 0)) return toast('Lengkapi seluruh komponen resep', '!');
    const entry = { id: recipe?.id || crypto.randomUUID(), productId: product.id, name: product.name, referenceSellingPrice: recipe?.referenceSellingPrice || productPrice(product), source: recipe?.source || 'manual', components: updatedComponents };
    if (recipe) Object.assign(recipe, entry); else state.recipes.push(entry);
    save(); renderInventory(); showHppManager(); toast('Resep dan HPP berhasil diperbarui', '◇');
  });
  calculateLive();
}

function exportCSV() {
  const data = reportData();
  const rows = [
    ['Sorgtime POS','Laporan Usaha'],['Periode',`${data.from} s.d. ${data.to}`],['Karyawan',data.cashier || 'Semua karyawan'],['Pembayaran',data.payment || 'Semua metode'],[],
    ['RINGKASAN LABA','NILAI'],['Omzet',data.revenue],['Transaksi',data.orders.length],['Cup terjual',data.cups],['HPP termasuk bonus',data.hpp],['Bonus di dalam HPP',Math.round(data.hppBonusIncluded)],['Penyesuaian bonus terhadap HPP',Math.round(data.bonusHppAdjustment)],['Laba kotor',data.grossProfit],['Gaji pokok',Math.round(data.basePayTotal)],['Laba operasional',Math.round(data.operating)],[],
    ['RINGKASAN ARUS KAS AKTUAL','NILAI'],['Penerimaan penjualan semua metode',data.cashRevenue],['Belanja stok dibayar',data.purchaseTotal],['Gaji dan bonus sudah dibayar',data.payrollPaidTotal],['Perubahan kas bersih',Math.round(data.cashNet)],['Estimasi kas setelah seluruh hak gaji dibayar',Math.round(data.projectedCash)],[],
    ['PERBANDINGAN HARIAN'],['Tanggal','Transaksi','Cup','Omzet terfilter','HPP termasuk bonus','Gaji pokok','Bonus hak','Belanja stok','Gaji dibayar','Laba operasional','Arus kas aktual'],...data.days.map(row=>[row.day,row.transactions,row.cups,row.revenue,row.hpp,Math.round(row.basePay),row.bonus,row.purchases,row.payrollPaid,Math.round(row.operating),Math.round(row.cashNet)]),[],
    ['GAJI DAN BONUS'],['Karyawan','Hari kerja','Cup','Gaji pokok','Bonus cup','Total hak','Sudah dibayar','Sisa','Status','Sumber'],...data.payroll.map(row=>[row.name,row.workDays,row.cups,Math.round(row.basePay),row.bonus,Math.round(row.total),row.paid,Math.round(row.remaining),row.paymentStatus,row.manual?'Manual':'Otomatis']),[],
    ['PEMBAYARAN GAJI'],['Tanggal bayar','Karyawan','Periode mulai','Periode selesai','Metode','Nominal','Catatan'],...data.actualPayments.map(entry=>[entry.paidDate,authUsers.find(user=>user.id===entry.userId)?.name||'Akun dihapus',entry.periodFrom,entry.periodTo,entry.method,entry.amount,entry.note||'']),[],
    ['BEBAN BELANJA'],['Tanggal','Item','Jumlah','Satuan','Referensi','Nominal'],...data.purchases.map(movement=>{const item=state.inventory.find(entry=>String(entry.id)===String(movement.ingredientId));return[jakartaDateKey(movement.createdAt),item?.name||'Item dihapus',movement.amount,item?.unit||'',movement.reference||'',movement.purchaseCost??'Belum dicatat'];})
  ];
  const csv = rows.map(row=>row.map(value=>{let safe=String(value??'');if(/^[=+\-@]/.test(safe))safe=`'${safe}`;return `"${safe.replaceAll('"','""')}"`;}).join(',')).join('\n');
  const link=document.createElement('a'); link.href=URL.createObjectURL(new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'})); link.download=`laporan-sorgtime-${data.from}-${data.to}.csv`; link.click(); URL.revokeObjectURL(link.href); toast('Laporan lengkap berhasil diekspor', '⇩');
}

document.addEventListener('click', async e => {
  const nav = e.target.closest('[data-view]'); if (nav) switchView(nav.dataset.view);
  const category = e.target.closest('[data-category]'); if (category) { activeCategory=category.dataset.category; renderCategories(); renderProducts(); }
  const product = e.target.closest('[data-product]'); if (product) showModifier(products.find(p => String(p.id) === product.dataset.product));
  const qty = e.target.closest('[data-qty]'); if (qty) { const index=+qty.dataset.qty; state.cart[index].qty += +qty.dataset.delta; if (state.cart[index].qty<=0) state.cart.splice(index,1); renderCart(); }
  const order = e.target.closest('[data-order]'); if (order) updateOrder(order.dataset.order, order.dataset.status);
  const stockAdjust = e.target.closest('[data-stock-adjust]'); if (stockAdjust) showStockForm(state.inventory.find(i => String(i.id) === stockAdjust.dataset.stockAdjust));
  const inventoryEdit = e.target.closest('[data-inventory-edit]'); if (inventoryEdit) showInventoryItemForm(state.inventory.find(i => String(i.id) === inventoryEdit.dataset.inventoryEdit));
  const premixEdit = e.target.closest('[data-premix-edit]'); if (premixEdit) showPremixForm(state.inventory.find(i => String(i.id) === premixEdit.dataset.premixEdit));
  const premixProduce = e.target.closest('[data-premix-produce]'); if (premixProduce) showPremixProduction(state.inventory.find(i => String(i.id) === premixProduce.dataset.premixProduce));
  const historyDetail = e.target.closest('[data-history-detail]'); if (historyDetail) showTransactionDetail(state.orders.find(order => orderRef(order) === historyDetail.dataset.historyDetail));
  const historyPrint = e.target.closest('[data-history-print]'); if (historyPrint) printReceipt(state.orders.find(order => orderRef(order) === historyPrint.dataset.historyPrint));
  const transactionDelete = e.target.closest('[data-transaction-delete]'); if (transactionDelete) showDeleteTransaction(state.orders.find(order => orderRef(order) === transactionDelete.dataset.transactionDelete));
  const customerEdit = e.target.closest('[data-customer-edit]'); if (customerEdit) showCustomerForm(state.customers.find(customer => String(customer.id) === customerEdit.dataset.customerEdit));
  const attendanceCheckIn = e.target.closest('[data-attendance-check-in]'); if (attendanceCheckIn) await selfCheckIn();
  const shiftDelete = e.target.closest('[data-shift-delete]');
  if (shiftDelete) {
    if (!isSysadmin()) return toast('Hanya sysadmin yang dapat menghapus riwayat shift', '!');
    const shift = state.shifts.find(item => item.id === shiftDelete.dataset.shiftDelete);
    if (!shift) return;
    if (!shift.endedAt) return toast('Tutup shift sebelum menghapus riwayatnya', '!');
    if (!await confirmDialog('Hapus data riwayat shift ini? Transaksi yang tercatat tetap tersimpan.', { title: 'Hapus riwayat shift', confirmLabel: 'Hapus' })) return;
    state.shifts = state.shifts.filter(item => item.id !== shift.id);
    if (state.activeShiftId === shift.id) state.activeShiftId = null;
    save(); closeModal(); renderAll(); toast('Riwayat shift dihapus', '⌫');
  }
  const purchaseEdit = e.target.closest('[data-purchase-edit]'); if (purchaseEdit) showPurchaseEditor(state.inventoryMovements.find(movement => movement.id === purchaseEdit.dataset.purchaseEdit));
  if (e.target.closest('[data-open-hpp]')) showHppManager();
  const accountEdit = e.target.closest('[data-account-edit]'); if (accountEdit) { const user=authUsers.find(item=>item.id===accountEdit.dataset.accountEdit); if(user)showAccountEdit(user); }
  const accountToggle = e.target.closest('[data-account-toggle]');
  if (accountToggle) {
    const user = authUsers.find(item => item.id === accountToggle.dataset.accountToggle);
    if (user && canManageUser(user)) {
      const next = user.status === 'active' ? 'inactive' : 'active';
      if (authBackendReady) {
        const result = await cloud.updateProfile(user.id, { status: next });
        if (!result.ok) return toast(result.message, '!');
        const profiles = await cloud.loadProfiles();
        if (profiles.ok) { authUsers = profiles.users; cacheProfiles(); }
        renderAccounts(); toast(`Akun ${next === 'active' ? 'diaktifkan' : 'dinonaktifkan'}`, '♙');
      } else {
        user.status = next; saveUsers(); renderAccounts(); toast(`Akun ${next === 'active' ? 'diaktifkan' : 'dinonaktifkan'}`, '♙');
      }
    }
  }
  const accountDelete = e.target.closest('[data-account-delete]');
  if (accountDelete) {
    const user = authUsers.find(item => item.id === accountDelete.dataset.accountDelete);
    if (user && canManageUser(user)) {
      if (!await confirmDialog(`Hapus akun ${user.name}?`, { title: 'Hapus akun', confirmLabel: 'Hapus akun' })) return;
      if (authBackendReady) {
        const result = await cloud.deleteAuthUser(user.id);
        if (!result.ok) return toast(result.message, '!');
        const profiles = await cloud.loadProfiles();
        if (profiles.ok) { authUsers = profiles.users; cacheProfiles(); }
        renderAccounts(); toast('Akun berhasil dihapus', '♙');
      } else {
        authUsers = authUsers.filter(item => item.id !== user.id); saveUsers(); renderAccounts(); toast('Akun berhasil dihapus', '♙');
      }
    }
  }
  if (e.target.classList.contains('modal-close') || e.target.id==='modal-backdrop') closeModal();
});

$('#product-search').addEventListener('input', renderProducts);
$('#customer-trigger').addEventListener('click', () => isShiftActive() ? showCustomerPicker() : showShiftManager());
$('#customer-add').addEventListener('click', showCustomerForm);
$('#pay-button').addEventListener('click', showPayment);
$('#promo-button').addEventListener('click', showPromotionManager);
$('#manage-prices').addEventListener('click', showPriceManager);
$('#mobile-menu').addEventListener('click', ()=>$('.sidebar').classList.toggle('open'));
$('#toggle-network').addEventListener('click', ()=>{ state.networkOnline=!state.networkOnline; save(); updateNetworkUI(); renderReports(); toast(state.networkOnline?'Koneksi pulih, data sedang disinkronkan':'Mode offline aktif — transaksi tetap dapat berjalan', state.networkOnline?'✓':'!'); });
$('#sync-card').addEventListener('dblclick', ()=>$('#toggle-network').click());
$('#inventory-search').addEventListener('input', e=>renderInventory(e.target.value));
$('#customer-search-page').addEventListener('input', e=>renderCustomers(e.target.value));
['transaction-search','transaction-date-from','transaction-date-to','transaction-cashier','transaction-payment','transaction-status'].forEach(id => $(`#${id}`).addEventListener(id === 'transaction-search' ? 'input' : 'change', renderTransactions));
$('#reset-transaction-filter').addEventListener('click', () => { ['transaction-search','transaction-date-from','transaction-date-to','transaction-cashier','transaction-payment','transaction-status'].forEach(id => { $(`#${id}`).value = ''; }); renderTransactions(); });
$('#export-transactions').addEventListener('click', exportTransactions);
$('#account-search').addEventListener('input', e=>renderAccounts(e.target.value));
$('#account-add').addEventListener('click', showAccountForm);
$('#hpp-manage').addEventListener('click', showHppManager);
$('#stock-add').addEventListener('click', ()=>showStockForm());
$('#stock-opname').addEventListener('click', ()=>showInventoryItemForm());
$('#premix-add').addEventListener('click', ()=>showPremixForm());
$('#premix-produce').addEventListener('click', ()=>showPremixProduction());
$('#export-report').addEventListener('click', exportCSV);
$('#attendance-manage').addEventListener('click', showAttendanceManager);
$('#attendance-manage-view').addEventListener('click', showAttendanceManager);
$('#attendance-location-settings').addEventListener('click', showShiftLocationSettings);
$('#payroll-payment').addEventListener('click', showPayrollPayment);
$('#payroll-settings').addEventListener('click', showPayrollSettings);
$('#shift-location-settings').addEventListener('click', showShiftLocationSettings);
$('#report-add-expense').addEventListener('click', () => showStockForm());
$('#payslip-month').addEventListener('change', renderPayslip);
$('#payslip-print').addEventListener('click', printPayslip);
$$('[data-report-preset]').forEach(button => button.addEventListener('click', () => setReportPreset(button.dataset.reportPreset)));
['report-date-from','report-date-to','report-cashier','report-payment'].forEach(id => $(`#${id}`).addEventListener('change', () => { if (id.startsWith('report-date')) $$('[data-report-preset]').forEach(button => button.classList.remove('active')); renderReports(); }));
$('#reset-report-filter').addEventListener('click', () => { $('#report-cashier').value = ''; $('#report-payment').value = ''; setReportPreset('today'); });
$('#notification-button').addEventListener('click', ()=>{ const count=state.inventory.filter(i=>i.stock<i.min).length; toast(count ? `${count} bahan perlu segera direstock` : 'Semua stok bahan dalam kondisi aman', count?'!':'✓'); });
$('#kds-sound').addEventListener('click', e=>{ e.currentTarget.textContent = e.currentTarget.textContent.includes('aktif') ? '♩ Suara mati' : '♩ Suara aktif'; toast('Pengaturan suara diperbarui', '♩'); });
$('#shift-button').addEventListener('click', showShiftManager);
$('#start-shift-inline').addEventListener('click', showShiftManager);
$('#profile-button').addEventListener('click', () => {
  if (!currentUser) return;
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Profil pengguna</h2><p>Akun yang sedang aktif</p></div><button class="modal-close">×</button></div><div class="modal-body"><div class="profile-detail"><span class="person-avatar">${currentUser.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()}</span><div><strong>${escapeHTML(currentUser.name)}</strong><small>@${escapeHTML(currentUser.username)} · ${ROLE_LABELS[currentUser.role]}</small></div></div><div class="notice">${ROLE_DESCRIPTIONS[currentUser.role]}</div></div><div class="modal-footer">${authBackendReady ? '<button class="button-ghost" id="change-password-button">Ubah password</button>' : ''}<button class="button-ghost" id="profile-payslip-button">Slip gaji</button><button class="button-ghost modal-close">Kembali</button><button class="button-primary" id="logout-button">Keluar dari aplikasi</button></div>`);
  $('#logout-button').addEventListener('click', logout);
  $('#profile-payslip-button').addEventListener('click', () => { closeModal(); switchView('payslip'); });
  if (authBackendReady) $('#change-password-button').addEventListener('click', showChangePassword);
});

function showChangePassword() {
  if (!currentUser || !authBackendReady) return;
  openModal(`<div class="modal-header"><div><h2 id="modal-title">Ubah password</h2><p>@${escapeHTML(currentUser.username)}</p></div><button class="modal-close">×</button></div><form id="change-password-form"><div class="modal-body"><div class="field"><label>Password baru</label><input name="password" type="password" required minlength="6" autofocus placeholder="Minimal 6 karakter"></div><div class="field"><label>Ulangi password</label><input name="confirm" type="password" required minlength="6" placeholder="Ketik sekali lagi"></div><div class="notice">Password disimpan dan diverifikasi oleh Supabase Auth.</div></div><div class="modal-footer"><button type="button" class="button-ghost modal-close">Batal</button><button type="submit" class="button-primary">Simpan password</button></div></form>`);
  $('#change-password-form').addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password');
    if (password !== data.get('confirm')) return toast('Konfirmasi password tidak sama', '!');
    const result = await cloud.updatePassword(password);
    if (!result.ok) return toast(result.message, '!');
    closeModal(); toast('Password berhasil diperbarui', '✓');
  });
}
$('#cart-more').addEventListener('click', async ()=>{ if(!state.cart.length) return toast('Belum ada item untuk dibatalkan','!'); if(!await confirmDialog('Kosongkan seluruh keranjang?', { title: 'Kosongkan keranjang', confirmLabel: 'Kosongkan', icon: '◇' })) return; state.cart=[];renderCart();toast('Keranjang dikosongkan'); });

$('#confirm-ok').addEventListener('click', () => closeConfirm(true));
$('#confirm-cancel').addEventListener('click', () => closeConfirm(false));
$('#confirm-backdrop').addEventListener('click', event => { if (event.target === event.currentTarget) closeConfirm(false); });

document.addEventListener('keydown', e=>{ if(e.key==='F2'){e.preventDefault(); if(state.cart.length)showPayment(); else if(!isShiftActive())showShiftManager();} if(e.key==='F4'){e.preventDefault(); if(isShiftActive())showCustomerPicker(); else showShiftManager();} if(e.key==='Escape'){ if(!$('#confirm-backdrop').hidden){ e.preventDefault(); closeConfirm(false); } else { closeModal(); } } });
setInterval(()=>{ if($('#view-kds').classList.contains('active')) renderKDS(); }, 1000);
setInterval(renderShiftState, 1000);

function hasBlockingOverlay() {
  const backdrop = document.getElementById('modal-backdrop');
  return Boolean(state.cart.length) || Boolean(backdrop && !backdrop.hidden);
}

function hydrateRemoteState(result) {
  const productRef = products;
  const addOnRef = addOns;
  const incoming = result.state || {};
  Object.keys(state).forEach(key => { delete state[key]; });
  Object.assign(state, incoming);
  if (Array.isArray(incoming.products)) { productRef.length = 0; productRef.push(...incoming.products); state.products = productRef; }
  if (Array.isArray(incoming.addOns)) { addOnRef.length = 0; addOnRef.push(...incoming.addOns); state.addOns = addOnRef; }
  state.inventory ||= ingredients;
  state.orders ||= [];
  state.cart ||= [];
  state.networkOnline ??= true;
  state.promotions ||= [];
  state.inventoryMovements ||= [];
  state.customers ||= customers;
  state.recipes ||= [];
  if (state.hppVersion < 3) migratePremixModel();
  state.shifts ||= [];
  state.attendance ||= [];
  state.payrollPayments ||= [];
  state.payrollManual ||= [];
  state.shiftLocation = { enabled: false, label: '', latitude: null, longitude: null, radius: 50, ...(state.shiftLocation || {}) };
  state.payrollSettings = { monthlyBase: 500000, monthlyOffDays: 4, cupBonus: 1000, mode: 'auto', workStart: '09:00', workEnd: '16:00', ...(state.payrollSettings || {}) };
  writeLocalState();
  clearLocalDirty();
}

function applyRemoteResult(result) {
  hydrateRemoteState(result);
  if (currentUser) {
    const refreshed = authUsers.find(user => user.id === currentUser.id && user.status === 'active');
    if (!refreshed) { logout(); return; }
    currentUser = refreshed;
  }
  applyingRemote = true;
  try {
    if (currentUser) { renderAll(); applyPermissions(); }
  } finally {
    applyingRemote = false;
  }
  cloud.markSynced(state, syncUsers());
  lastSyncedFingerprint = stateFingerprint();
  pendingRemote = null;
  remoteToastShown = false;
  lastRemoteAt = result.updatedAt ? Date.parse(result.updatedAt) : Date.now();
  toast('Data diperbarui dari perangkat lain', '↻');
}

function maybeApplyRemote(result) {
  if (!cloud.enabled || !syncReady || !result || !result.ok || !result.state) return;
  if (localDirty) return;
  if (cloud.fingerprint(result.state, syncUsers()) === lastSyncedFingerprint) {
    lastRemoteAt = Math.max(lastRemoteAt, result.updatedAt ? Date.parse(result.updatedAt) : Date.now());
    return;
  }
  if (hasBlockingOverlay()) {
    pendingRemote = result;
    if (!remoteToastShown) {
      remoteToastShown = true;
      toast('Data baru dari perangkat lain. Selesaikan form atau kosongkan keranjang untuk memuat.', '↻');
    }
    return;
  }
  applyRemoteResult(result);
}

async function refreshLegacyProfiles(result) {
  if (!legacyMode || !result.ok || !Array.isArray(result.users)) return false;
  const next = result.users;
  if (cloud.fingerprint({}, next) === cloud.fingerprint({}, authUsers)) return false;
  authUsers = next;
  cacheProfiles();
  if (currentUser) {
    const me = authUsers.find(user => user.id === currentUser.id && user.status === 'active');
    if (!me) { await logout(); return true; }
    currentUser = me;
  }
  return true;
}

async function refreshProfiles() {
  if (!authBackendReady || !syncReady) return;
  const result = await cloud.loadProfiles();
  if (!result.ok) { if (result.authError) await logout(); return; }
  const next = result.users;
  const changed = cloud.fingerprint({}, next) !== cloud.fingerprint({}, authUsers);
  authUsers = next;
  cacheProfiles();
  if (currentUser) {
    const me = authUsers.find(user => user.id === currentUser.id && user.status === 'active');
    if (!me) { await logout(); return; }
    currentUser = me;
  }
  if (changed && currentUser) {
    applyingRemote = true;
    try { renderAccounts(); applyPermissions(); } finally { applyingRemote = false; }
  }
}

async function pullRemote() {
  if (!cloud.enabled || !syncReady || syncingRemote) return;
  if (localDirty) {
    if (!cloud.hasPending() && navigator.onLine !== false) cloud.save(state, syncUsers());
    return;
  }
  if (cloud.hasPending()) return;
  if (pendingRemote && !hasBlockingOverlay()) maybeApplyRemote(pendingRemote);
  syncingRemote = true;
  try {
    const result = legacyMode ? await cloud.loadLegacy() : await cloud.load();
    if (result.authError) { await logout(); return; }
    const profilesChanged = await refreshLegacyProfiles(result);
    maybeApplyRemote(result);
    if (profilesChanged && currentUser) {
      applyingRemote = true;
      try { renderAccounts(); applyPermissions(); } finally { applyingRemote = false; }
    }
    await refreshProfiles();
  } finally {
    syncingRemote = false;
  }
}

function startCloudSync() {
  if (!cloud.enabled || cloudSyncStarted) return;
  cloudSyncStarted = true;
  window.addEventListener('pos:cloud-saved', event => {
    if (event.detail && event.detail.fingerprint) lastSyncedFingerprint = event.detail.fingerprint;
    lastRemoteAt = Math.max(lastRemoteAt, Date.now());
    if (!event.detail || !event.detail.fingerprint || event.detail.fingerprint === stateFingerprint()) clearLocalDirty();
  });
  window.addEventListener('pos:cloud-error', () => { markLocalDirty(); if (state.networkOnline) toast('Gagal menyimpan ke Supabase. Data tetap tersimpan lokal.', '!'); });
  window.addEventListener('online', pullRemote);
  window.addEventListener('focus', pullRemote);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pullRemote(); });
  setInterval(pullRemote, 20000);
  cloud.subscribe(row => maybeApplyRemote({ ok: true, state: row.state, updatedAt: row.updated_at }));
}

renderAll();
await initializeAuth();

if (legacyMode && cloudResult.ok && remoteState && !localDirty) {
  cloud.markSynced(state, syncUsers());
  lastSyncedFingerprint = stateFingerprint();
  clearLocalDirty();
}
if (legacyMode && cloudResult.ok && (!remoteState || !remoteUsers || localDirty)) {
  cloud.save(state, authUsers);
}

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!refreshing) { refreshing = true; location.reload(); } });
  navigator.serviceWorker.register('./sw.js').then(registration => registration.update()).catch(() => {
    // Aplikasi tetap berfungsi dengan penyimpanan lokal ketika service worker tidak tersedia.
  });
}
