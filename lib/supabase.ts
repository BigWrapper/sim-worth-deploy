import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://YOUR_PROJECT_ID.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_ANON_KEY_HERE"

if (!supabaseUrl || !supabaseKey) {
  console.error("MISSING SUPABASE ENV!")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
