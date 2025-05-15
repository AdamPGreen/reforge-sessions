import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { FiLock, FiLoader } from 'react-icons/fi'

const LoginPage = () => {
  const { user, signIn, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for error in URL
    const urlParams = new URLSearchParams(location.search)
    const urlError = urlParams.get('error')
    if (urlError) {
      setError(decodeURIComponent(urlError))
    }

    if (user) {
      console.log('User authenticated, redirecting to home')
      navigate('/')
    }
  }, [user, navigate, location])

  useEffect(() => {
    // Check if we have an error from the auth provider
    if (authError) {
      setError(authError.message || 'Authentication failed')
      setIsLoading(false)
    }
  }, [authError])

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await signIn()
      if (error) {
        setError(error.message || 'Failed to sign in')
        setIsLoading(false)
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4" style={{
      background: 'radial-gradient(128.62% 95.44% at 100% 131.06%, rgba(79, 110, 219, 0.50) 0%, rgba(79, 110, 219, 0.00) 100%), linear-gradient(0deg, #F0F2FF 0%, #F0F2FF 100%), #FFF'
    }}>
      <motion.div 
        className="max-w-md w-full relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <img 
            src="https://cltgdzmxfnyhdzdiuomy.supabase.co/storage/v1/object/public/app-assets//Reforge%20Logo%20Variants.png" 
            alt="Reforge" 
            className="h-6 mx-auto mb-6" 
          />
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Welcome to Reforge AI Sessions</h1>
          <p className="text-dark-600">Sign in to access AI learning resources and sessions</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-card border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center shadow-inner">
              <FiLock className="w-6 h-6 text-primary-600" />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <motion.button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Sign in with Google
              </>
            )}
          </motion.button>

          <p className="mt-4 text-sm text-center text-dark-500">
            Only @reforge.com email addresses are allowed
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage