import { supabase } from './supabaseClient';

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', userId)
    .single();
    if (error) throw error;
    return data.display_name;
}