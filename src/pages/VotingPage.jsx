import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TopicCard from '../components/TopicCard'
import { useSession } from '../context/SessionContext'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const VotingPage = ({ openModal }) => {
  const { topics } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('votes')
  
  const filteredTopics = topics.filter(topic => 
    topic.status === 'active' && (
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortBy === 'votes') {
      return b.votes - a.votes
    }
    return b.id.localeCompare(a.id)
  })
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header openModal={openModal} />
      
      <main className="flex-grow">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-1 text-dark-600 hover:text-primary-600 transition-colors mb-4">
                <FiArrowLeft size={18} />
                <span>Back to Home</span>
              </Link>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-dark-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Vote on Future Topics
              </motion.h1>
              
              <motion.p 
                className="text-dark-700 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Help shape our AI Sessions by voting on topics you'd like to learn about. The most popular topics will be prioritized for upcoming sessions.
              </motion.p>
            </div>
            
            <motion.div 
              className="mb-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative flex-grow">
                <FiSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="relative w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-light-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="votes">Most voted</option>
                  <option value="newest">Most recent</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {sortedTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
              
              {sortedTopics.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-600 text-lg">
                    {searchTerm 
                      ? "No topics found. Try a different search term."
                      : "No topics available for voting. All topics have been converted to sessions."}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default VotingPage