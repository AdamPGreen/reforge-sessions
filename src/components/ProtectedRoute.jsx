import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('[ProtectedRoute] Auth state update:', {
      hasUser: !!user,
      isLoading: loading,
      path: window.location.pathname,
      timestamp: Date.now()
    })

    if (!loading && !user) {
      console.log('[ProtectedRoute] No user found, redirecting to login:', {
        path: window.location.pathname,
        timestamp: Date.now()
      })
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  // Show loading state while checking authentication
  if (loading) {
    console.log('[ProtectedRoute] Rendering loading state:', {
      path: window.location.pathname,
      timestamp: Date.now()
    })
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    )
  }

  // If not loading and no user, return null (will redirect in useEffect)
  if (!user) {
    console.log('[ProtectedRoute] No user, returning null:', {
      path: window.location.pathname,
      timestamp: Date.now()
    })
    return null
  }

  // If we have a user, render the children
  console.log('[ProtectedRoute] Rendering protected content:', {
    path: window.location.pathname,
    userEmail: user.email,
    timestamp: Date.now()
  })
  return children
}

export default ProtectedRoute