import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSession } from '../context/SessionContext'
import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const AdminPage = ({ openModal }) => {
  const navigate = useNavigate()
  const { createSession, isAdmin } = useSession()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    speaker: '',
    calendarLink: ''
  })

  if (!isAdmin) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createSession(formData)
    navigate('/')
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header openModal={openModal} />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-1 text-dark-600 hover:text-primary-600 transition-colors mb-6">
            <FiArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          
          <motion.h1 
            className="text-3xl font-bold text-dark-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Create New Session
          </motion.h1>
          
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Speaker
                </label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Calendar Link
                </label>
                <input
                  type="url"
                  name="calendarLink"
                  value={formData.calendarLink}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary-600 text-white font-medium shadow-md hover:bg-primary-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Session
              </motion.button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default AdminPage