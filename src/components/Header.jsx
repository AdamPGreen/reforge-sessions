import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiLogIn, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const Header = ({ openModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const handleAuthAction = async () => {
    if (user) {
      await signOut()
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-light-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="https://cltgdzmxfnyhdzdiuomy.supabase.co/storage/v1/object/public/app-assets//Reforge%20Logo%20Variants.png" 
              alt="Reforge" 
              className="h-5" 
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-[13px] font-medium hover:text-dark-900 transition-colors ${
                location.pathname === '/' ? 'text-dark-900' : 'text-dark-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/voting" 
              className={`text-[13px] font-medium hover:text-dark-900 transition-colors ${
                location.pathname === '/voting' ? 'text-dark-900' : 'text-dark-500'
              }`}
            >
              Vote on Topics
            </Link>
            <Link 
              to="/past-sessions" 
              className={`text-[13px] font-medium hover:text-dark-900 transition-colors ${
                location.pathname === '/past-sessions' ? 'text-dark-900' : 'text-dark-500'
              }`}
            >
              Past Sessions
            </Link>
            <motion.button
              onClick={openModal}
              className="px-4 py-[6px] text-[13px] font-medium bg-dark-900 text-white rounded-lg hover:bg-dark-800 transition-all"
              whileTap={{ scale: 0.98 }}
            >
              Suggest a Session
            </motion.button>
            <motion.button
              onClick={handleAuthAction}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-dark-500 hover:text-dark-900 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              {user ? (
                <>
                  <FiLogOut size={16} />
                  <span>Sign Out</span>
                </>
              ) : (
                <>
                  <FiLogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-dark-800" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white absolute left-0 right-0 mt-4 py-4 px-6 shadow-lg border-t border-light-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-[13px] font-medium ${
                  location.pathname === '/' ? 'text-dark-900' : 'text-dark-500'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/voting" 
                className={`text-[13px] font-medium ${
                  location.pathname === '/voting' ? 'text-dark-900' : 'text-dark-500'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vote on Topics
              </Link>
              <Link 
                to="/past-sessions" 
                className={`text-[13px] font-medium ${
                  location.pathname === '/past-sessions' ? 'text-dark-900' : 'text-dark-500'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Past Sessions
              </Link>
              <motion.button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openModal()
                }}
                className="px-4 py-[6px] text-[13px] font-medium bg-dark-900 text-white rounded-lg"
                whileTap={{ scale: 0.98 }}
              >
                Suggest a Session
              </motion.button>
              <motion.button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleAuthAction()
                }}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-dark-500"
                whileTap={{ scale: 0.98 }}
              >
                {user ? (
                  <>
                    <FiLogOut size={16} />
                    <span>Sign Out</span>
                  </>
                ) : (
                  <>
                    <FiLogIn size={16} />
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header