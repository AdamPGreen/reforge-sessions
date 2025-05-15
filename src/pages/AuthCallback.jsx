import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true;

    const handleCallback = async () => {
      if (!mounted) return;

      try {
        console.log('Handling auth callback...')
        
        // Check for error in URL
        const urlParams = new URLSearchParams(window.location.search)
        const authError = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        if (authError) {
          console.error('Auth error:', authError, errorDescription)
          navigate(`/login?error=${encodeURIComponent(errorDescription || authError)}`)
          return
        }

        // Try to get session from URL hash fragment
        if (window.location.hash) {
          console.log('Hash fragment found:', {
            hash: window.location.hash,
            timestamp: Date.now(),
            stack: new Error().stack
          })
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            console.log('Access token found in URL:', {
              hasAccessToken: !!accessToken,
              hasRefreshToken: !!refreshToken,
              timestamp: Date.now(),
              stack: new Error().stack
            })
            try {
              const { data, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              })
              
              if (sessionError) {
                console.error('Error setting session:', {
                  error: sessionError,
                  timestamp: Date.now(),
                  stack: new Error().stack
                })
                navigate(`/login?error=${encodeURIComponent(sessionError.message)}`)
                return
              }
              
              if (data?.session) {
                console.log('Session established from hash:', {
                  session: {
                    user: {
                      email: data.session.user.email,
                      id: data.session.user.id
                    },
                    expires_at: data.session.expires_at
                  },
                  timestamp: Date.now(),
                  stack: new Error().stack
                })
                navigate('/')
                return
              }
            } catch (err) {
              console.error('Error in setSession:', {
                error: err,
                timestamp: Date.now(),
                stack: new Error().stack
              })
              navigate(`/login?error=${encodeURIComponent(err.message)}`)
              return
            }
          }
        }
        
        // If we're still here, try to get existing session
        console.log('Attempting to get existing session:', {
          timestamp: Date.now(),
          stack: new Error().stack
        })
        
        const { data, error: getSessionError } = await supabase.auth.getSession()
        
        if (getSessionError) {
          console.error('Error getting session:', {
            error: getSessionError,
            timestamp: Date.now(),
            stack: new Error().stack
          })
          navigate(`/login?error=${encodeURIComponent(getSessionError.message)}`)
          return
        }
        
        if (data?.session) {
          console.log('Session found:', {
            session: {
              user: {
                email: data.session.user.email,
                id: data.session.user.id
              },
              expires_at: data.session.expires_at
            },
            timestamp: Date.now(),
            stack: new Error().stack
          })
          navigate('/')
        } else {
          console.log('No session found:', {
            timestamp: Date.now(),
            stack: new Error().stack
          })
          navigate('/login')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        navigate(`/login?error=${encodeURIComponent(err.message)}`)
      }
    }

    handleCallback()

    return () => {
      mounted = false
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
    </div>
  )
}

export default AuthCallback
