import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Handling auth callback...')
        
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        if (accessToken) {
          console.log('Access token found in URL')
          // Set the session using the tokens
          const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (error) {
            console.error('Error setting session:', error)
            navigate('/login')
            return
          }

          if (session) {
            console.log('Session established:', session)
            navigate('/')
            return
          }
        }

        // If no access token in URL, try to get existing session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          navigate('/login')
          return
        }

        if (session) {
          console.log('Existing session found:', session)
          navigate('/')
        } else {
          console.log('No session found in callback')
          navigate('/login')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        navigate('/login')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
    </div>
  )
}

export default AuthCallback 