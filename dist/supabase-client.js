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

// Mengembalikan { ok, state, users }.
// ok=false berarti gagal terhubung; state/users null berarti baris belum ada.
export async function load() {
  const db = getClient();
  if (!db) return { ok: false, enabled: false, state: null, users: null };
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
    return { ok: false, enabled: true, state: null, users: null };
  }
}

export function save(state, users) {
  if (!isConfigured) return;
  pending = { state, users };
  clearTimeout(timer);
  timer = setTimeout(flush, 300);
}

export async function flush() {
  const db = getClient();
  if (!db || !pending) return;
  const payload = pending;
  pending = null;
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
    window.dispatchEvent(new CustomEvent('pos:cloud-saved', { detail: { at: Date.now() } }));
  } catch (error) {
    console.error('Gagal menyimpan data Supabase:', error);
    window.dispatchEvent(new CustomEvent('pos:cloud-error', { detail: { error } }));
  }
}

export const cloud = { enabled: isConfigured, load, save, flush };
