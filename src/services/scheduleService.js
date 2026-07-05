import { supabase } from "./supabaseClient";

export async function fetchSchedules() {
    const { data, error } = await supabase
        .from("schedules")
        .select("*")
    if (error) throw error;
    return data;
}
export async function upsertSchedule(userId, roommate, schedule) {
  const { error } = await supabase
    .from('schedules')
    .upsert({ 
      user_id: userId, 
      roommate, 
      schedule,
      updated_at: new Date().toISOString()
    })
  if (error) throw error
}