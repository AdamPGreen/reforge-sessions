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
        console.log('Checking for existing session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setError(error)
        } else {
          console.log('Session check result:', session ? 'Session found' : 'No session')
          console.log('Session details:', session)
          
          if (session?.user) {
            console.log('User email:', session.user.email)
            console.log('User ID:', session.user.id)
            console.log('User metadata:', session.user.user_metadata)
            console.log('User app metadata:', session.user.app_metadata)
            setUser(session.user)
          } else {
            setUser(null)
          }
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error during session check:', err)
        setError(err)
        setLoading(false)
      }
    }
    
    checkSession()

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      console.log('Session:', session)
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email)
        // Verify the session is valid
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        console.log('Current session after sign in:', currentSession)
        
        if (currentSession?.user) {
          setUser(currentSession.user)
        }
      } else if (event === 'SIGNED_OUT') {
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