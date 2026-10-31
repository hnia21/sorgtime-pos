// Supabase Client Configuration
// Setup: https://supabase.com/docs/guides/getting-started

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://YOUR-PROJECT.supabase.co'
const supabaseAnonKey = 'YOUR-PUBLIC-ANON-KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for the POS application

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) console.error('Error fetching products:', error)
  return data || []
}

export async function insertProduct(product) {
  const { data, error } = await supabase.from('products').insert(product).single()
  if (error) console.error('Error inserting product:', error)
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).single()
  if (error) console.error('Error updating product:', error)
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) console.error('Error deleting product:', error)
}

export async function fetchAddons() {
  const { data, error } = await supabase.from('addons').select('*')
  if (error) console.error('Error fetching addons:', error)
  return data || []
}

export async function fetchIngredients() {
  const { data, error } = await supabase.from('ingredients').select('*')
  if (error) console.error('Error fetching ingredients:', error)
  return data || []
}

export async function insertIngredient(ingredient) {
  const { data, error } = await supabase.from('ingredients').insert(ingredient).single()
  if (error) console.error('Error inserting ingredient:', error)
  return data
}

export async function fetchCustomers() {
  const { data, error } = await supabase.from('customers').select('*')
  if (error) console.error('Error fetching customers:', error)
  return data || []
}

export async function upsertCustomer(customer) {
  const { data, error } = await supabase.from('customers').upsert(customer).single()
  if (error) console.error('Error upserting customer:', error)
  return data
}

export async function fetchTransactions({
  from = '2024-01-01',
  to = new Date().toISOString(),
  cashier = '',
  payment = '',
  status = ''
} = {}) {
  let query = supabase.from('transactions').select('*').order('created_at', { ascending: false })

  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)
  if (cashier) query = query.eq('user_id', cashier)
  if (payment) query = query.eq('payment_method', payment)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) console.error('Error fetching transactions:', error)
  return data || []
}

export async function insertTransaction(transaction) {
  const { data, error } = await supabase.from('transactions').insert(transaction).single()
  if (error) console.error('Error inserting transaction:', error)
  return data
}