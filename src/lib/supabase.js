import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Determine the current environment and set the appropriate redirect URL
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const siteUrl = isLocalhost ? 'http://localhost:5173' : 'https://reforge-sessions.vercel.app'

console.log('Using site URL:', siteUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    redirectTo: `${siteUrl}/auth/callback`
  }
})
