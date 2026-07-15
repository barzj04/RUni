import { supabase } from './supabaseClient'

export async function fetchSharedTodos() {
  const { data, error } = await supabase
    .from('shared_todo')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addSharedTodo(task, addedBy, link) {
  const { error } = await supabase
    .from('shared_todo')
    .insert({ task, added_by: addedBy, done: false, link: link || null })
  if (error) throw error
}

export async function toggleSharedTodo(id, currentValue) {
  const { error } = await supabase
    .from('shared_todo')
    .update({ done: !currentValue })
    .eq('id', id)
  if (error) throw error
}

export async function deleteSharedTodo(id) {
  const { error } = await supabase
    .from('shared_todo')
    .delete()
    .eq('id', id)
  if (error) throw error
}