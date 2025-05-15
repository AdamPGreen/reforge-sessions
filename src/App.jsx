import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import VotingPage from './pages/VotingPage'
import PastSessionsPage from './pages/PastSessionsPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import { SessionProvider } from './context/SessionContext'
import { AuthProvider } from './context/AuthContext'
import SubmissionModal from './components/SubmissionModal'
import ProtectedRoute from './components/ProtectedRoute'
import AuthCallback from './pages/AuthCallback'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    console.log('[App] Component mounted:', {
      timestamp: Date.now(),
      path: window.location.pathname
    })
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <ErrorBoundary>
      <AuthProvider>
        <SessionProvider>
          <div className="min-h-screen bg-light-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage openModal={openModal} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/voting"
                element={
                  <ProtectedRoute>
                    <VotingPage openModal={openModal} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/past-sessions"
                element={
                  <ProtectedRoute>
                    <PastSessionsPage openModal={openModal} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage openModal={openModal} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <SubmissionModal isOpen={isModalOpen} onClose={closeModal} />
          </div>
        </SessionProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App