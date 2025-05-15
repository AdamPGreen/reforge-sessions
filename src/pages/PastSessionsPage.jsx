import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SessionCard from '../components/SessionCard'
import { useSession } from '../context/SessionContext'
import { FiArrowLeft } from 'react-icons/fi'
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
          
          <div className="grid grid-cols-1 gap-6">
            {past.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session}
                isPast={true}
              />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default PastSessionsPage