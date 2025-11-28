import { createClient as createBrowserSupabaseClient, SupabaseClient } from "@supabase/supabase-js"

let supabase: SupabaseClient | null = null

export function createClient() {
  if (supabase) return supabase

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  supabase = createBrowserSupabaseClient(url, anonKey)

  return supabase
}
