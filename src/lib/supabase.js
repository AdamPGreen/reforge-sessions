import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('4. Creating Supabase client with PKCE flow')
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  }
})

// Debug logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('5. Auth state changed:', event)
  console.log('6. Session:', session)
  console.log('7. Current URL:', window.location.href)
  console.log('8. Iframes in document:', document.getElementsByTagName('iframe').length)
})
