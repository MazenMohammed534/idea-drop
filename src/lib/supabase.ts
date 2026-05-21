import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

function createSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return createClient(supabaseUrl, supabaseKey)
}

export const supabase = createSupabaseClient()
