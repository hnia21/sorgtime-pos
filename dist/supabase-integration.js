// Supabase Integration for Sorgtime POS
// Replace localStorage with Supabase backend
// 
// 1. Insert this at the top of dist/app.js (before localStorage usage)
// 2. Set YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY
// 3. Run: supabase start (or use hosted Supabase)

// Initialize Supabase
const supabaseUrl = 'https://YOUR-PROJECT.supabase.co';
const supabaseKey = 'YOUR-PUBLIC-ANON-KEY';
const supabase = window.supabase || createClient(supabaseUrl, supabaseKey);

// Replace localStorage.getItem('sorgtimePosStateV3')
window.getPosState = async function() {
  const { data, error } = await supabase.from('pos_state').select('*').single();
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching POS state:', error);
    return null;
  }
  return data || null;
};

// Replace localStorage.setItem('sorgtimePosStateV3', JSON.stringify(state))
window.savePosState = async function(state) {
  // Check if record exists, upsert
  const { data: existing } = await supabase.from('pos_state').select('id').single();
  if (existing) {
    await supabase.from('pos_state').update({ state: JSON.stringify(state) }).eq('id', existing.id);
  } else {
    await supabase.from('pos_state').insert({ state: JSON.stringify(state) });
  }
};

// Replace localStorage.removeItem('sorgtimePosStateV2')
window.clearPosStateV2 = async function() {
  await supabase.from('pos_state').delete().gt('id', 0);
};

// Replace localStorage.getItem(USERS_KEY) / localStorage.setItem(USERS_KEY, ...)
window.getAuthUsers = async function() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) console.error('Error fetching users:', error);
  return data || [];
};

window.saveAuthUsers = async function(users) {
  // Simple upsert - delete all and re-insert
  await supabase.from('users').delete().gt('id', 0);
  if (users && users.length > 0) {
    await supabase.from('users').insert(users);
  }
};

// Table structure initialization (run once)
async function initializeSupabaseTables() {
  // Create tables if not exist - will be done via migrations
  // This function ensures minimum data exists
  
  // Initialize default products if table empty
  const { count } = await supabase.from('products').select('*', { count: 'exact' });
  if ((count || 0) === 0) {
    const defaultProducts = [
      { id: 1, name: 'Caramel', category: 'Variant Diet Coffee', price: 10000, image: 'assets/menu/soft.png', badge: 'TERLARIS', sold: 0 },
      { id: 2, name: 'Hazelnut', category: 'Variant Diet Coffee', price: 10000, image: 'assets/menu/strong.png', badge: 'FAVORIT', sold: 0 },
      { id: 3, name: 'Cold Brew', category: 'Variant Diet Coffee', price: 10000, image: 'assets/menu/montblanc.png', sold: 0 },
      { id: 4, name: 'Montblanc', category: 'Variant Diet Coffee', price: 15000, image: 'assets/menu/montblanc.png', badge: 'SIGNATURE', sold: 0 },
      { id: 5, name: 'Original Soft', category: 'Classic Diet Coffee', price: 8000, image: 'assets/menu/soft.png', sold: 0 },
      { id: 6, name: 'Original Strong', category: 'Classic Diet Coffee', price: 8000, image: 'assets/menu/strong.png', sold: 0 },
      { id: 7, name: 'Blue Cloud Matcha', category: 'Non-Coffee', price: 15000, image: 'assets/menu/bluecloud.png', badge: 'BARU', sold: 0 },
      { id: 8, name: 'Matcha', category: 'Non-Coffee', price: 15000, image: 'assets/menu/matcha.png', sold: 0 },
      { id: 9, name: 'Swiss Chocolate', category: 'Non-Coffee', price: 15000, image: 'assets/menu/chocolate.png', sold: 0 }
    ];
    await supabase.from('products').insert(defaultProducts);
  }
  
  // Initialize addons if table empty
  const { count: addonCount } = await supabase.from('addons').select('*', { count: 'exact' });
  if ((addonCount || 0) === 0) {
    const defaultAddons = [
      { id: 'oat-milk', name: 'Oat milk', price: 6000 },
      { id: 'extra-shot', name: 'Extra shot', price: 5000 },
      { id: 'less-ice', name: 'Less ice', price: 0 }
    ];
    await supabase.from('addons').insert(defaultAddons);
  }
  
  // Initialize ingredients if table empty
  const { count: ingredientCount } = await supabase.from('ingredients').select('*', { count: 'exact' });
  if ((ingredientCount || 0) === 0) {
    const defaultIngredients = [
      { name: 'Cold brew concentrate', sku: 'BB-CBR-01', category: 'Kopi', icon: '●', stock: 6.8, unit: 'L', min_stock: 3, max_stock: 10 },
      { name: 'Susu rendah lemak', sku: 'BB-SUS-01', category: 'Dairy', icon: '▱', stock: 7.2, unit: 'L', min_stock: 5, max_stock: 15 },
      { name: 'Gula sorgum cair', sku: 'BB-SOR-01', category: 'Pemanis', icon: '◆', stock: 2.1, unit: 'L', min_stock: 2.5, max_stock: 8 },
      { name: 'Creamer', sku: 'BB-CRM-01', category: 'Dairy', icon: '◇', stock: 1.4, unit: 'L', min_stock: 2, max_stock: 8 },
      { name: 'Matcha powder', sku: 'BB-MTC-01', category: 'Bubuk', icon: '✦', stock: 0.82, unit: 'kg', min_stock: 0.5, max_stock: 2 },
      { name: 'Cup dingin 16 oz', sku: 'PK-CUP-16', category: 'Kemasan', icon: '▯', stock: 186, unit: 'pcs', min_stock: 100, max_stock: 400 },
      { name: 'Tutup cup 16 oz', sku: 'PK-LID-16', category: 'Kemasan', icon: '═', stock: 174, unit: 'pcs', min_stock: 50, max_stock: 300 }
    ];
    await supabase.from('ingredients').insert(defaultIngredients);
  }
  
  // Initialize users (sysadmin default)
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact' });
  if ((userCount || 0) === 0) {
    await supabase.from('users').insert({ role: 'sysadmin', username: 'sysadmin' });
  }
}

// Run initialization when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSupabaseTables);
} else {
  initializeSupabaseTables();
}