import { supabase } from './supabaseClient'

export async function fetchRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addRecipe(idea, link, whenToCook) {
  const { error } = await supabase
    .from('recipes')
    .insert({
      idea,
      link: link || null,
      when_to_cook: whenToCook || null
    })
  if (error) throw error
}

export async function deleteRecipe(id) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
  if (error) throw error
}