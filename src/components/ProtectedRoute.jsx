import { useEffect, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
  </div>
)

const ErrorFallback = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-red-600 p-4 rounded-lg bg-red-50">
      <h2 className="text-lg font-semibold mb-2">Error Loading Content</h2>
      <p className="text-sm">{error?.message || 'An unexpected error occurred'}</p>
      <button 
        type="button"
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Refresh Page
      </button>
    </div>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { user, loading, error: authError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('[ProtectedRoute] Auth state update:', {
      hasUser: !!user,
      isLoading: loading,
      path: window.location.pathname,
      timestamp: Date.now(),
      userDetails: user ? {
        email: user.email,
        id: user.id,
        metadata: user.user_metadata
      } : null
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
    return <LoadingSpinner />
  }

  // If not loading and no user, show loading (will redirect in useEffect)
  if (!user) {
    console.log('[ProtectedRoute] No user, showing loading:', {
      path: window.location.pathname,
      timestamp: Date.now()
    })
    return <LoadingSpinner />
  }

  // If we have an auth error, show error state
  if (authError) {
    console.error('[ProtectedRoute] Auth error:', {
      error: authError,
      path: window.location.pathname,
      userEmail: user.email,
      timestamp: Date.now()
    })
    return <ErrorFallback error={authError} />
  }

  // If we have a user, render the children
  console.log('[ProtectedRoute] Rendering protected content:', {
    path: window.location.pathname,
    userEmail: user.email,
    timestamp: Date.now()
  })

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="protected-route-wrapper" data-testid="protected-route">
        {children}
      </div>
    </Suspense>
  )
}

export default ProtectedRoute