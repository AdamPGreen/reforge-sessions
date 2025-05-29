import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSession } from '../context/SessionContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FiArrowLeft, FiCalendar, FiUsers, FiThumbsUp, FiUserPlus, FiUserMinus, FiSearch, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import CreateSessionModal from '../components/CreateSessionModal'

const AdminPage = ({ openModal }) => {
  const navigate = useNavigate()
  const { createSession, isAdmin, topics } = useSession()
  const { user } = useAuth()
  const [adminUsers, setAdminUsers] = useState([])
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    loadAdminUsers()
  }, [isAdmin, navigate])

  const loadAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select(`
          id,
          user_id,
          created_at,
          created_by,
          users:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAdminUsers(data)
    } catch (err) {
      console.error('Error loading admin users:', err)
    }
  }

  const searchUsers = async (email) => {
    if (!email) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .ilike('email', `%${email}%`)
        .limit(5)

      if (error) throw error
      setSearchResults(data)
    } catch (err) {
      console.error('Error searching users:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const addAdmin = async (userId) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          user_id: userId,
          created_by: user.id
        }])

      if (error) throw error
      await loadAdminUsers()
      setSearchEmail('')
      setSearchResults([])
    } catch (err) {
      console.error('Error adding admin:', err)
    }
  }

  const removeAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId)

      if (error) throw error
      await loadAdminUsers()
    } catch (err) {
      console.error('Error removing admin:', err)
    }
  }

  const handleCreateSession = (topic = null) => {
    setSelectedTopic(topic)
    setIsCreateSessionModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-light-50">
      <Header openModal={openModal} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-light-100 transition-colors"
            >
              <FiArrowLeft className="w-6 h-6 text-dark-600" />
            </Link>
            <h1 className="text-2xl font-bold text-dark-900">Admin Dashboard</h1>
          </div>

          <div className="grid gap-8">
            {/* Topics Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-dark-900">Create Sessions from Topics</h2>
                <motion.button
                  type="button"
                  onClick={() => handleCreateSession()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium shadow-md hover:bg-primary-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPlus size={18} />
                  <span>Create Custom Session</span>
                </motion.button>
              </div>

              <div className="grid gap-4">
                {topics.filter(topic => topic.status === 'active').map((topic) => (
                  <motion.div
                    key={topic.id}
                    className="flex items-start justify-between p-4 bg-light-50 rounded-lg border border-light-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-dark-900 mb-1">{topic.title}</h3>
                      <p className="text-sm text-dark-500 mb-2">Suggested by {topic.user_name}</p>
                      <p className="text-dark-700 text-sm">{topic.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1 text-sm text-dark-500">
                          <FiThumbsUp size={14} />
                          {topic.votes} votes
                        </span>
                        <span className="flex items-center gap-1 text-sm text-dark-500">
                          <FiCalendar size={14} />
                          {topic.status === 'converted' ? 'Converted to Session' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => handleCreateSession(topic)}
                      className="ml-4 px-4 py-2 rounded-lg border-2 border-primary-600 text-primary-600 font-medium hover:bg-primary-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create Session
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Admin Users Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-dark-900 mb-6">Manage Admins</h2>
              
              {/* Add Admin Form */}
              <div className="mb-8">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Search by email..."
                      value={searchEmail}
                      onChange={(e) => {
                        setSearchEmail(e.target.value)
                        searchUsers(e.target.value)
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-light-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="bg-light-50 rounded-lg border border-light-200 divide-y divide-light-200">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-4 hover:bg-light-100 transition-colors"
                      >
                        <span className="text-dark-600">{result.email}</span>
                        <button
                          type="button"
                          onClick={() => addAdmin(result.id)}
                          className="p-2 text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <FiUserPlus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Users List */}
              <div className="space-y-4">
                {adminUsers.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 bg-light-50 rounded-lg border border-light-200"
                  >
                    <div>
                      <p className="font-medium text-dark-900">{admin.users.email}</p>
                      <p className="text-sm text-dark-500">
                        Added {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {admin.user_id !== user.id && (
                      <button
                        type="button"
                        onClick={() => removeAdmin(admin.id)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <FiUserMinus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      <CreateSessionModal
        isOpen={isCreateSessionModalOpen}
        onClose={() => {
          setIsCreateSessionModalOpen(false)
          setSelectedTopic(null)
        }}
        topic={selectedTopic}
      />
    </div>
  )
}

export default AdminPage