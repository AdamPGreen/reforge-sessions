import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import SessionCard from '../components/SessionCard'
import { useSession } from '../context/SessionContext'
import { FiCalendar, FiThumbsUp } from 'react-icons/fi'

const HomePage = ({ openModal }) => {
  const { upcoming } = useSession()
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header openModal={openModal} />
      
      <main className="flex-grow">
        <Hero />
        
        <section id="upcoming" className="py-12">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-dark-900 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Upcoming Sessions
            </motion.h2>
            
            {upcoming.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {upcoming.map((session) => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
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
                <h3 className="text-xl font-semibold mb-4 text-dark-900">No Upcoming Sessions</h3>
                <p className="text-dark-700 mb-8 max-w-lg mx-auto">
                  There are no sessions scheduled at the moment. Help shape our future sessions by suggesting a topic or voting on existing ones.
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
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default HomePage