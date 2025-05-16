import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSession } from '../context/SessionContext'
import { FiArrowLeft, FiCalendar, FiUsers, FiThumbsUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const AdminPage = ({ openModal }) => {
  const navigate = useNavigate()
  const { createSession, isAdmin, topics } = useSession()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    speaker: '',
    calendarLink: ''
  })
  const [selectedTopic, setSelectedTopic] = useState(null)

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

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
    setFormData({
      title: topic.title,
      description: topic.description,
      date: '',
      speaker: '',
      calendarLink: ''
    })
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Suggested Topics Section */}
            <div>
              <motion.h2 
                className="text-2xl font-bold text-dark-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Suggested Topics
              </motion.h2>
              
              <div className="space-y-4">
                {topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedTopic?.id === topic.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-light-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleTopicSelect(topic)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <h3 className="font-semibold text-dark-900 mb-2">{topic.title}</h3>
                    <p className="text-dark-600 text-sm mb-3">{topic.description}</p>
                    <div className="flex items-center gap-4 text-sm text-dark-500">
                      <div className="flex items-center gap-1">
                        <FiThumbsUp size={14} />
                        <span>{topic.votes} votes</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Create Session Form */}
            <div>
              <motion.h2 
                className="text-2xl font-bold text-dark-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Create New Session
              </motion.h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-dark-700 mb-1">
                    Session Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-dark-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="speaker" className="block text-sm font-medium text-dark-700 mb-1">
                    Speaker
                  </label>
                  <input
                    id="speaker"
                    type="text"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-dark-700 mb-1">
                    Date and Time
                  </label>
                  <input
                    id="date"
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="calendarLink" className="block text-sm font-medium text-dark-700 mb-1">
                    Calendar Link
                  </label>
                  <input
                    id="calendarLink"
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
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default AdminPage