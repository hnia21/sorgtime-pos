// Koneksi Supabase + autentikasi per pengguna untuk Sorgtime POS.
// Isi SUPABASE_URL dan SUPABASE_ANON_KEY dari dashboard Supabase:
// Project Settings -> API -> Project URL & anon public key.

export const SUPABASE_URL = 'https://jqocyhbmpiguuetdtqbm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxb2N5aGJtcGlndXVldGR0cWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MTU3NDIsImV4cCI6MjEwOTM5MTc0Mn0.mtYouXCXxBcyXosaLi0F6FCLHlxHOPowxUdmsddOS2c';

const TABLE = 'pos_state';
const USERS_TABLE = 'users';
const ROW_ID = 1;
const EMAIL_DOMAIN = 'sorgtime.local';

const looksLikePlaceholder = value => !value || /YOUR-|YOUR_/i.test(value);

export const isConfigured = !looksLikePlaceholder(SUPABASE_URL) && !looksLikePlaceholder(SUPABASE_ANON_KEY);

let client = null;
let tempClient = null;
let pending = null;
let timer = null;
let saving = false;
let lastPayload = '';

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

function withTimeout(promise, ms = 8000) {
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Waktu koneksi Supabase habis')), ms))
  ]);
}

function getClient() {
  if (!isConfigured) return null;
  if (!client) {
    const factory = window.supabase?.createClient;
    if (typeof factory !== 'function') {
      console.warn('Supabase JS belum termuat. Pastikan vendor/supabase.js dimuat sebelum app.js.');
      return null;
    }
    client = factory(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }
  return client;
}

function getTempClient() {
  if (!isConfigured) return null;
  if (!tempClient) {
    const factory = window.supabase?.createClient;
    if (typeof factory !== 'function') return null;
    tempClient = factory(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'sorgtime-temp-auth'
      }
    });
  }
  return tempClient;
}

export function usernameToEmail(username) {
  return `${String(username || '').trim().toLowerCase()}@${EMAIL_DOMAIN}`;
}

export function normalizeProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || '',
    username: row.username || '',
    role: row.role || 'barista',
    status: row.status || 'active',
    createdAt: row.created_at ? Date.parse(row.created_at) : (row.createdAt || Date.now())
  };
}

function isAuthError(error) {
  const status = error?.status || error?.statusCode;
  if (status === 401 || status === 403) return true;
  if (error?.code === 'PGRST301') return true;
  return /jwt|unauthor|permission denied|row-level security/i.test(String(error?.message || ''));
}

const CONFIRM_EMAIL_MESSAGE = 'Supabase masih meminta konfirmasi email. Buka Authentication → Providers → Email, matikan "Confirm email", simpan, lalu coba lagi.';

function mapAuthError(error) {
  const message = String(error?.message || '');
  const code = String(error?.code || '');
  if (/invalid login credentials/i.test(message)) return 'Username atau password tidak sesuai.';
  if (/email not confirmed/i.test(message)) return CONFIRM_EMAIL_MESSAGE;
  if (code === 'over_email_send_rate_limit' || /email.*rate limit/i.test(message)) {
    return 'Batas kirim email Supabase tercapai karena "Confirm email" masih aktif. Matikan Confirm email di Authentication → Providers → Email, lalu coba lagi.';
  }
  if (/email address .*invalid|invalid email/i.test(message)) return 'Username tidak valid untuk pendaftaran. Gunakan huruf kecil, angka, titik, garis bawah, atau tanda minus.';
  if (/user already registered/i.test(message)) return 'Username sudah digunakan.';
  if (/password should be at least/i.test(message)) return 'Password minimal 6 karakter.';
  if (/rate limit|too many requests/i.test(message)) return 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.';
  return message || 'Terjadi kesalahan autentikasi.';
}

// Endpoint publik ini melaporkan apakah Supabase masih mengirim email
// konfirmasi. Jika masih aktif, signup ke domain sintetis pasti gagal dan
// hanya memicu rate limit email, jadi hentikan sebelum request dikirim.
export async function getAuthSettings() {
  if (!isConfigured) return { ok: false, settings: null };
  try {
    const response = await withTimeout(
      fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_ANON_KEY } }),
      6000
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { ok: true, settings: await response.json() };
  } catch (error) {
    return { ok: false, settings: null, error };
  }
}

async function checkAutoconfirm() {
  const result = await getAuthSettings();
  if (result.ok && result.settings && result.settings.mailer_autoconfirm === false) {
    return { ok: false, message: CONFIRM_EMAIL_MESSAGE };
  }
  return { ok: true };
}

function profileErrorMessage(error) {
  const message = String(error?.message || '');
  if (/duplicate key|unique constraint/i.test(message)) return 'Username sudah digunakan.';
  if (/row-level security|permission denied/i.test(message)) return 'Anda tidak berhak mengubah akun ini.';
  return message || 'Gagal menyimpan profil pengguna.';
}

export function fingerprint(state, users) {
  return stableStringify({ state, users: users || null });
}

export async function getSession() {
  const db = getClient();
  if (!db) return null;
  try {
    const { data, error } = await withTimeout(db.auth.getSession(), 6000);
    if (error) throw error;
    return data?.session || null;
  } catch (error) {
    console.error('Gagal membaca sesi Supabase:', error);
    return null;
  }
}

export async function onAuthStateChange(callback) {
  const db = getClient();
  if (!db) return () => {};
  const { data } = db.auth.onAuthStateChange((event, session) => callback(event, session));
  return () => { try { data?.subscription?.unsubscribe(); } catch (error) { /* abaikan */ } };
}

export async function signIn(username, password) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { data, error } = await withTimeout(
      db.auth.signInWithPassword({ email: usernameToEmail(username), password }),
      12000
    );
    if (error) throw error;
    return { ok: true, user: data.user, session: data.session };
  } catch (error) {
    return { ok: false, message: mapAuthError(error), error };
  }
}

export async function signUp(username, password, name) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  const guard = await checkAutoconfirm();
  if (!guard.ok) return guard;
  try {
    const { data, error } = await withTimeout(
      db.auth.signUp({
        email: usernameToEmail(username),
        password,
        options: { data: { username, name } }
      }),
      12000
    );
    if (error) throw error;
    if (!data.session) {
      return {
        ok: false,
        needsConfirmation: true,
        message: 'Akun dibuat tetapi sesi tidak aktif. Matikan "Confirm email" di Supabase Authentication lalu coba lagi.'
      };
    }
    return { ok: true, user: data.user, session: data.session };
  } catch (error) {
    return { ok: false, message: mapAuthError(error), error };
  }
}

export async function createAuthUser(username, password) {
  const temp = getTempClient();
  if (!temp) return { ok: false, message: 'Supabase Auth tidak tersedia.' };
  const guard = await checkAutoconfirm();
  if (!guard.ok) return guard;
  try {
    const { data, error } = await withTimeout(
      temp.auth.signUp({ email: usernameToEmail(username), password }),
      12000
    );
    if (error) throw error;
    if (!data.session || !data.user) {
      return {
        ok: false,
        message: 'Akun gagal dibuat. Pastikan "Confirm email" = OFF dan username belum dipakai.'
      };
    }
    try { await temp.auth.signOut(); } catch (error) { /* abaikan */ }
    return { ok: true, userId: data.user.id };
  } catch (error) {
    return { ok: false, message: mapAuthError(error), error };
  }
}

export async function signOut() {
  const db = getClient();
  if (!db) return;
  try { await db.auth.signOut(); } catch (error) { console.error('Gagal keluar dari Supabase:', error); }
}

export async function updatePassword(password) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { error } = await withTimeout(db.auth.updateUser({ password }), 12000);
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    return { ok: false, message: mapAuthError(error), error };
  }
}

export async function hasAnyUser() {
  const db = getClient();
  if (!db) return { ok: false, exists: false };
  try {
    const { data, error } = await withTimeout(db.rpc('has_any_user'), 6000);
    if (error) throw error;
    return { ok: true, exists: Boolean(data) };
  } catch (error) {
    return { ok: false, exists: false, error };
  }
}

export async function bootstrapFirstAdmin(name, username) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { data, error } = await withTimeout(
      db.rpc('bootstrap_first_admin', { display_name: name, uname: username }),
      10000
    );
    if (error) throw error;
    return { ok: true, profile: normalizeProfile(data) };
  } catch (error) {
    return { ok: false, message: error?.message || 'Gagal membuat profil admin pertama.', error };
  }
}

export async function loadProfile() {
  const db = getClient();
  const session = await getSession();
  if (!db || !session) return { ok: false, profile: null, authError: !session };
  try {
    const { data, error } = await withTimeout(
      db.from(USERS_TABLE).select('id,name,username,role,status,created_at').eq('id', session.user.id).maybeSingle(),
      8000
    );
    if (error) throw error;
    return { ok: true, profile: normalizeProfile(data) };
  } catch (error) {
    return { ok: false, profile: null, authError: isAuthError(error), error };
  }
}

export async function loadProfiles() {
  const db = getClient();
  if (!db) return { ok: false, users: [] };
  try {
    const { data, error } = await withTimeout(
      db.from(USERS_TABLE).select('id,name,username,role,status,created_at').order('created_at', { ascending: true }),
      8000
    );
    if (error) throw error;
    return { ok: true, users: (data || []).map(normalizeProfile).filter(Boolean) };
  } catch (error) {
    return { ok: false, users: [], authError: isAuthError(error), error };
  }
}

export async function saveProfile(profile) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { data, error } = await withTimeout(
      db.from(USERS_TABLE).insert({
        id: profile.id,
        name: profile.name,
        username: profile.username,
        role: profile.role,
        status: profile.status || 'active'
      }).select('id,name,username,role,status,created_at').single(),
      8000
    );
    if (error) throw error;
    return { ok: true, profile: normalizeProfile(data) };
  } catch (error) {
    return { ok: false, message: profileErrorMessage(error), error };
  }
}

export async function updateProfile(id, patch) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { data, error } = await withTimeout(
      db.from(USERS_TABLE).update(patch).eq('id', id).select('id,name,username,role,status,created_at').maybeSingle(),
      8000
    );
    if (error) throw error;
    return { ok: true, profile: normalizeProfile(data) };
  } catch (error) {
    return { ok: false, message: profileErrorMessage(error), error };
  }
}

// Mengubah nama/peran/status sekaligus mereset password akun non-sysadmin.
// Membutuhkan fungsi RPC admin_manage_account dari migrasi 010.
export async function adminManageAccount(id, patch = {}) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { data, error } = await withTimeout(
      db.rpc('admin_manage_account', {
        target: id,
        new_name: patch.name ?? null,
        new_role: patch.role ?? null,
        new_status: patch.status ?? null,
        new_password: patch.password ?? null
      }),
      10000
    );
    if (error) throw error;
    return { ok: true, profile: normalizeProfile(data) };
  } catch (error) {
    const message = String(error?.message || '');
    if (/could not find the function|schema cache|function .* does not exist/i.test(message)) {
      return { ok: false, message: 'Fitur edit akun belum aktif. Jalankan migrasi 202401010010_admin_manage_accounts.sql di Supabase.', error };
    }
    return { ok: false, message: profileErrorMessage(error), error };
  }
}

export async function deleteProfile(id) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { error } = await withTimeout(db.from(USERS_TABLE).delete().eq('id', id), 8000);
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    return { ok: false, message: profileErrorMessage(error), error };
  }
}

// Menghapus auth user sekaligus profilnya (cascade). Hanya sysadmin.
export async function deleteAuthUser(id) {
  const db = getClient();
  if (!db) return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { error } = await withTimeout(db.rpc('delete_app_user', { target: id }), 10000);
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    return { ok: false, message: profileErrorMessage(error), error };
  }
}

// Mengembalikan { ok, state, updatedAt }.
// ok=false berarti gagal/terlarang; state=null berarti baris belum ada.
export async function load() {
  const db = getClient();
  if (!db) return { ok: false, enabled: false, state: null, updatedAt: null };
  try {
    const { data, error } = await withTimeout(
      db.from(TABLE).select('state, updated_at').eq('id', ROW_ID).maybeSingle(),
      6000
    );
    if (error) throw error;
    return {
      ok: true,
      enabled: true,
      state: data?.state || null,
      updatedAt: data?.updated_at || null
    };
  } catch (error) {
    console.error('Gagal memuat data Supabase:', error);
    return {
      ok: false,
      enabled: true,
      state: null,
      updatedAt: null,
      authError: isAuthError(error),
      error
    };
  }
}

// Mode lokal (sebelum migrasi 009) masih memakai kolom users untuk hash
// password lama. Setelah RLS aktif, gunakan load() yang tidak menyentuh users.
export async function loadLegacy() {
  const db = getClient();
  if (!db) return { ok: false, enabled: false, state: null, users: null, updatedAt: null };
  try {
    const { data, error } = await withTimeout(
      db.from(TABLE).select('state, users, updated_at').eq('id', ROW_ID).maybeSingle(),
      6000
    );
    if (error) throw error;
    return {
      ok: true,
      enabled: true,
      state: data?.state || null,
      users: data?.users || null,
      updatedAt: data?.updated_at || null
    };
  } catch (error) {
    console.error('Gagal memuat data lokal Supabase:', error);
    return { ok: false, enabled: true, state: null, users: null, updatedAt: null, error };
  }
}

// legacyUsers hanya dikirim saat mode lokal (sebelum migrasi 009).
// Setelah RLS aktif, users tidak lagi ditulis ke pos_state.
export function save(state, legacyUsers) {
  if (!isConfigured) return;
  pending = { state, users: legacyUsers || null };
  clearTimeout(timer);
  timer = setTimeout(flush, 300);
}

export function hasPending() {
  return Boolean(pending) || Boolean(timer) || saving;
}

export function markSynced(state, legacyUsers) {
  lastPayload = fingerprint(state, legacyUsers);
}

export async function flush() {
  timer = null;
  const db = getClient();
  if (!db || !pending) return;
  const payload = pending;
  pending = null;
  const serialized = fingerprint(payload.state, payload.users);
  if (serialized === lastPayload) return;
  saving = true;
  try {
    const record = {
      id: ROW_ID,
      state: payload.state,
      updated_at: new Date().toISOString()
    };
    if (payload.users) record.users = payload.users;
    const { error } = await db.from(TABLE).upsert(record, { onConflict: 'id' });
    if (error) throw error;
    lastPayload = serialized;
    window.dispatchEvent(new CustomEvent('pos:cloud-saved', { detail: { at: Date.now(), fingerprint: serialized } }));
  } catch (error) {
    console.error('Gagal menyimpan data Supabase:', error);
    window.dispatchEvent(new CustomEvent('pos:cloud-error', { detail: { error } }));
  } finally {
    saving = false;
  }
}

// Berlangganan perubahan baris pos_state. Butuh tabel terdaftar di
// publication `supabase_realtime`; jika belum, polling tetap jalan.
export function subscribe(onChange) {
  const db = getClient();
  if (!db) return () => {};
  try {
    const channel = db
      .channel('pos_state_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE, filter: `id=eq.${ROW_ID}` },
        payload => {
          const row = payload.new && Object.keys(payload.new).length ? payload.new : payload.old;
          if (row && typeof onChange === 'function') onChange(row);
        }
      )
      .subscribe();
    return () => {
      try { db.removeChannel(channel); } catch (error) { /* abaikan */ }
    };
  } catch (error) {
    console.warn('Realtime Supabase tidak tersedia:', error);
    return () => {};
  }
}

export const cloud = {
  enabled: isConfigured,
  load,
  loadLegacy,
  save,
  flush,
  hasPending,
  markSynced,
  subscribe,
  fingerprint,
  getSession,
  onAuthStateChange,
  signIn,
  signUp,
  createAuthUser,
  signOut,
  updatePassword,
  getAuthSettings,
  hasAnyUser,
  bootstrapFirstAdmin,
  loadProfile,
  loadProfiles,
  saveProfile,
  updateProfile,
  adminManageAccount,
  deleteProfile,
  deleteAuthUser,
  usernameToEmail,
  normalizeProfile
};
