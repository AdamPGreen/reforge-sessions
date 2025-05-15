import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      try {
        console.log('[AuthContext] Checking for existing session...', {
          timestamp: Date.now(),
          path: window.location.pathname
        })
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[AuthContext] Error getting session:', error)
          setError(error)
        } else {
          console.log('[AuthContext] Session check result:', {
            hasSession: !!session,
            userEmail: session?.user?.email,
            timestamp: Date.now()
          })
          
          if (session?.user) {
            console.log('[AuthContext] Setting user:', {
              email: session.user.email,
              id: session.user.id,
              timestamp: Date.now()
            })
            setUser(session.user)
          } else {
            setUser(null)
          }
        }
        
        setLoading(false)
      } catch (err) {
        console.error('[AuthContext] Unexpected error during session check:', err)
        setError(err)
        setLoading(false)
      }
    }
    
    checkSession()

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', {
        event,
        hasSession: !!session,
        userEmail: session?.user?.email,
        timestamp: Date.now(),
        path: window.location.pathname
      })
      
      if (event === 'SIGNED_IN') {
        console.log('[AuthContext] Processing sign in:', {
          userEmail: session?.user?.email,
          timestamp: Date.now()
        })
        // Verify the session is valid
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        console.log('[AuthContext] Current session after sign in:', {
          hasSession: !!currentSession,
          userEmail: currentSession?.user?.email,
          timestamp: Date.now()
        })
        
        if (currentSession?.user) {
          setUser(currentSession.user)
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] Processing sign out:', {
          timestamp: Date.now()
        })
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      console.log('Starting sign in process...')
      
      // Determine the current environment for redirect URL
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const redirectUrl = isLocalhost 
        ? `${window.location.origin}/auth/callback`
        : 'https://reforge-sessions.vercel.app/auth/callback'
      
      console.log('Using redirect URL:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      })
      
      if (error) {
        console.error('Error signing in:', error)
        setError(error)
        return { error }
      }
      
      console.log('Sign in response:', data)
      
      // If we have a URL, we need to redirect
      if (data?.url) {
        console.log('Redirecting to:', data.url)
        window.location.href = data.url
        return { data }
      }
      
      return { data }
    } catch (err) {
      console.error('Unexpected error during sign in:', err)
      setError(err)
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        setError(error)
        return { error }
      }
      
      setUser(null)
      return { success: true }
    } catch (err) {
      console.error('Unexpected error during sign out:', err)
      setError(err)
      return { error: err }
    }
  }

  const value = {
    signIn,
    signOut,
    user,
    loading,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}