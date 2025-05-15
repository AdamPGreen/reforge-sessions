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
  const [sessionState, setSessionState] = useState('initializing')

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      try {
        console.log('[AuthContext] Checking for existing session...')
        setSessionState('checking')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[AuthContext] Error getting session:', error)
          setError(error)
          setSessionState('error')
        } else {
          console.log('[AuthContext] Session check result:', session ? 'Session found' : 'No session')
          console.log('[AuthContext] Session details:', session)
          
          if (session?.user) {
            console.log('[AuthContext] User details:', {
              email: session.user.email,
              id: session.user.id,
              metadata: session.user.user_metadata,
              appMetadata: session.user.app_metadata
            })
            setUser(session.user)
            setSessionState('authenticated')
          } else {
            setUser(null)
            setSessionState('unauthenticated')
          }
        }
        
        setLoading(false)
      } catch (err) {
        console.error('[AuthContext] Unexpected error during session check:', err)
        setError(err)
        setSessionState('error')
        setLoading(false)
      }
    }
    
    checkSession()

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', {
        event,
        session: session ? {
          user: {
            email: session.user.email,
            id: session.user.id
          },
          expires_at: session.expires_at
        } : null,
        timestamp: Date.now(),
        stack: new Error().stack
      })
      
      if (event === 'SIGNED_IN') {
        console.log('[AuthContext] Processing sign in:', {
          userEmail: session?.user?.email,
          timestamp: Date.now(),
          stack: new Error().stack
        })
        setSessionState('authenticating')
        
        try {
          // Verify the session is valid
          const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
          
          console.log('[AuthContext] Session verification:', {
            hasSession: !!currentSession,
            error: sessionError,
            timestamp: Date.now(),
            stack: new Error().stack
          })
          
          if (sessionError) {
            console.error('[AuthContext] Session verification error:', sessionError)
            setSessionState('error')
            setError(sessionError)
            return
          }
          
          if (currentSession?.user) {
            console.log('[AuthContext] Setting authenticated user:', {
              email: currentSession.user.email,
              timestamp: Date.now()
            })
            setUser(currentSession.user)
            setSessionState('authenticated')
          } else {
            console.error('[AuthContext] No user in verified session')
            setSessionState('error')
            setError(new Error('Failed to establish session after sign in'))
          }
        } catch (err) {
          console.error('[AuthContext] Unexpected error during session verification:', err)
          setSessionState('error')
          setError(err)
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] Processing sign out:', {
          timestamp: Date.now()
        })
        setUser(null)
        setSessionState('unauthenticated')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      console.log('[AuthContext] Starting sign in process...')
      setSessionState('signing_in')
      
      // Determine the current environment for redirect URL
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const redirectUrl = isLocalhost 
        ? `${window.location.origin}/auth/callback`
        : 'https://reforge-sessions.vercel.app/auth/callback'
      
      console.log('[AuthContext] Using redirect URL:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      })
      
      if (error) {
        console.error('[AuthContext] Error signing in:', error)
        setError(error)
        setSessionState('error')
        return { error }
      }
      
      console.log('[AuthContext] Sign in response:', data)
      
      // If we have a URL, we need to redirect
      if (data?.url) {
        console.log('[AuthContext] Redirecting to:', data.url)
        window.location.href = data.url
        return { data }
      }
      
      return { data }
    } catch (err) {
      console.error('[AuthContext] Unexpected error during sign in:', err)
      setError(err)
      setSessionState('error')
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      console.log('[AuthContext] Starting sign out process...')
      setSessionState('signing_out')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('[AuthContext] Error signing out:', error)
        setError(error)
        setSessionState('error')
        return { error }
      }
      
      setUser(null)
      setSessionState('unauthenticated')
      return { success: true }
    } catch (err) {
      console.error('[AuthContext] Unexpected error during sign out:', err)
      setError(err)
      setSessionState('error')
      return { error: err }
    }
  }

  const value = {
    signIn,
    signOut,
    user,
    loading,
    error,
    sessionState
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}