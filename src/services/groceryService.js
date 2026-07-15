import { supabase } from './supabaseClient'

export async function fetchGroceries() {
  const { data, error } = await supabase
    .from('groceries')
    .select('*')
    .order('created_at', { ascending: false })
    // order by created_at, not name
  if (error) throw error
  return data
}

export async function addGrocery(item, price, paidBy, forWho) {
  const { error } = await supabase
    .from('groceries')
    .insert({ item, price, paid_by: paidBy, paid_back: false, for_who: forWho })
  if (error) throw error
}

export async function togglePaidBack(id, currentValue) {
  const { error } = await supabase
    .from('groceries')
    .update({ paid_back: !currentValue })
    .eq('id', id)
  if (error) throw error
}

export async function deleteGrocery(id) {
  const { error } = await supabase
    .from('groceries')
    .delete()
    .eq('id', id)
    // .eq → only delete the row where id matches this specific id
  if (error) throw error
}

export async function clearAllGroceries() {
  const { error } = await supabase
    .from('groceries')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw error
}