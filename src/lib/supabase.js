import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true,
    storageKey: 'sb-auth-token',
    storage: window.localStorage
  }
})

// Debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event)
  console.log('Session:', session)
  
  if (event === 'SIGNED_IN' && session) {
    console.log('User signed in successfully:', {
      userId: session.user.id,
      email: session.user.email,
      timestamp: Date.now()
    })
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Session token refreshed at:', Date.now())
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out at:', Date.now())
  } else if (event === 'USER_UPDATED') {
    console.log('User data updated at:', Date.now())
  }
})

// Add global error handler for auth errors
window.addEventListener('supabase.auth.error', (event) => {
  console.error('Supabase auth error:', event.detail)
})
