import { createClient } from '@supabase/supabase-js'
import type { Player } from '../types/game'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export interface CloudSave {
  user_id: string
  player: Player
  updated_at: string
}

export async function loadCloudSave(userId: string) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('game_saves')
    .select('user_id, player, updated_at')
    .eq('user_id', userId)
    .maybeSingle<CloudSave>()

  if (error) throw error
  return data
}

export async function saveCloudPlayer(userId: string, player: Player) {
  if (!supabase) return

  const { error } = await supabase
    .from('game_saves')
    .upsert({
      user_id: userId,
      player,
      updated_at: new Date().toISOString(),
    })

  if (error) throw error
}
