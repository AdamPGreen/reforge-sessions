import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Handling auth callback...')
        
        // Try to get session from URL hash fragment
        if (window.location.hash) {
          console.log('Hash fragment found:', window.location.hash)
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          
          if (accessToken) {
            console.log('Access token found in URL')
            // Set session directly from hash fragment
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token')
            })
            
            if (error) {
              console.error('Error setting session:', error)
            } else if (data?.session) {
              console.log('Session established from hash:', data.session)
              navigate('/')
              return
            }
          }
        }
        
        // If we're still here, try to get existing session
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          navigate('/login')
          return
        }
        
        if (data?.session) {
          console.log('Session found:', data.session)
          navigate('/')
        } else {
          console.log('No session found')
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
