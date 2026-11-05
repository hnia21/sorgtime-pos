// Koneksi Supabase untuk Sorgtime POS.
// Isi SUPABASE_URL dan SUPABASE_ANON_KEY dari dashboard Supabase:
// Project Settings -> API -> Project URL & anon public key.

export const SUPABASE_URL = 'https://jqocyhbmpiguuetdtqbm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxb2N5aGJtcGlndXVldGR0cWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MTU3NDIsImV4cCI6MjEwOTM5MTc0Mn0.mtYouXCXxBcyXosaLi0F6FCLHlxHOPowxUdmsddOS2c';

const TABLE = 'pos_state';
const ROW_ID = 1;

const looksLikePlaceholder = value => !value || /YOUR-|YOUR_/i.test(value);

export const isConfigured = !looksLikePlaceholder(SUPABASE_URL) && !looksLikePlaceholder(SUPABASE_ANON_KEY);

let client = null;
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

export function fingerprint(state, users) {
  return stableStringify({ state, users });
}

function getClient() {
  if (!isConfigured) return null;
  if (!client) {
    const factory = window.supabase?.createClient;
    if (typeof factory !== 'function') {
      console.warn('Supabase JS belum termuat. Pastikan vendor/supabase.js dimuat sebelum app.js.');
      return null;
    }
    client = factory(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}

// Mengembalikan { ok, state, users, updatedAt }.
// ok=false berarti gagal terhubung; state/users null berarti baris belum ada.
export async function load() {
  const db = getClient();
  if (!db) return { ok: false, enabled: false, state: null, users: null, updatedAt: null };
  try {
    const query = db
      .from(TABLE)
      .select('state, users, updated_at')
      .eq('id', ROW_ID)
      .maybeSingle();
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Waktu koneksi Supabase habis')), 6000));
    const { data, error } = await Promise.race([Promise.resolve(query), timeout]);
    if (error) throw error;
    return {
      ok: true,
      enabled: true,
      state: data?.state || null,
      users: data?.users || null,
      updatedAt: data?.updated_at || null
    };
  } catch (error) {
    console.error('Gagal memuat data Supabase:', error);
    return { ok: false, enabled: true, state: null, users: null, updatedAt: null };
  }
}

export function save(state, users) {
  if (!isConfigured) return;
  pending = { state, users };
  clearTimeout(timer);
  timer = setTimeout(flush, 300);
}

export function hasPending() {
  return Boolean(pending) || Boolean(timer) || saving;
}

export function markSynced(state, users) {
  lastPayload = fingerprint(state, users);
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
    const { error } = await db.from(TABLE).upsert(
      {
        id: ROW_ID,
        state: payload.state,
        users: payload.users,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    );
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
// publication `supabase_realtime`; jika belum, polling di app.js tetap jalan.
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

export const cloud = { enabled: isConfigured, load, save, flush, hasPending, markSynced, subscribe, fingerprint };
