import { supabase } from './supabaseClient'

export async function fetchGroceryWishlist() {
  const { data, error } = await supabase
    .from('grocery_wishlist')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addGroceryWishlist(item, addedBy) {
  const { error } = await supabase
    .from('grocery_wishlist')
    .insert({ item, added_by: addedBy })
  if (error) throw error
}

export async function deleteGroceryWishlist(id) {
  const { error } = await supabase
    .from('grocery_wishlist')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function moveToGroceries(id, itemName, paidBy) {
  const { error: insertError } = await supabase
    .from('groceries')
    .insert({ item: itemName, price: 0, paid_by: paidBy, paid_back: false })
  if (insertError) throw insertError

  const { error: deleteError } = await supabase
    .from('grocery_wishlist')
    .delete()
    .eq('id', id)
  if (deleteError) throw deleteError
}