import { supabase } from './supabaseClient'

export async function fetchPersonalWishlist(userId) {
  const { data, error } = await supabase
    .from('personal_wishlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addPersonalWishlist(userId, owner, item) {
  const { error } = await supabase
    .from('personal_wishlist')
    .insert({ user_id: userId, owner, item, done: false })
  // user_id links to auth, owner is the display name
  if (error) throw error
}

export async function togglePersonalWishlist(id, currentValue) {
  const { error } = await supabase
    .from('personal_wishlist')
    .update({ done: !currentValue })
    .eq('id', id)
  if (error) throw error
}

export async function deletePersonalWishlist(id) {
  const { error } = await supabase
    .from('personal_wishlist')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function fetchPersonalTodo(userId) {
  const { data, error } = await supabase
    .from('personal_todo')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addPersonalTodo(userId, owner, task) {
  const { error } = await supabase
    .from('personal_todo')
    .insert({ user_id: userId, owner, task, done: false })
  if (error) throw error
}

export async function togglePersonalTodo(id, currentValue) {
  const { error } = await supabase
    .from('personal_todo')
    .update({ done: !currentValue })
    .eq('id', id)
  if (error) throw error
}

export async function deletePersonalTodo(id) {
  const { error } = await supabase
    .from('personal_todo')
    .delete()
    .eq('id', id)
  if (error) throw error
}