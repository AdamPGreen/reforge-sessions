import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to login')
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    )
  }

  // If not loading and no user, return null (will redirect in useEffect)
  if (!user) {
    return null
  }

  // If we have a user, render the children
  return children
}

export default ProtectedRoute