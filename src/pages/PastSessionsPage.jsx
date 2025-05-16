import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SessionCard from '../components/SessionCard'
import { useSession } from '../context/SessionContext'
import { FiArrowLeft, FiCalendar, FiThumbsUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const PastSessionsPage = ({ openModal }) => {
  const { past } = useSession()
  
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
            Past Sessions
          </motion.h1>
          
          {past.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {past.map((session) => (
                <SessionCard 
                  key={session.id} 
                  session={session}
                  isPast={true}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              className="bg-white rounded-2xl shadow-card p-8 text-center border border-light-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-dark-900">No Past Sessions</h3>
              <p className="text-dark-700 mb-8 max-w-lg mx-auto">
                There are no past sessions recorded yet. Check back later for recordings and summaries of completed sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={openModal}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiCalendar size={18} />
                  <span>Suggest a Session</span>
                </motion.button>
                <Link
                  to="/voting"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-light-100 text-dark-900 font-medium rounded-lg hover:bg-light-200 transition-colors"
                >
                  <FiThumbsUp size={18} />
                  <span>Vote on Topics</span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default PastSessionsPage