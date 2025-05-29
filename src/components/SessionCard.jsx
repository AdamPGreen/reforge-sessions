import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiVideo, FiFileText, FiUser, FiPlus, FiEdit2 } from 'react-icons/fi'
import { useSession } from '../context/SessionContext'
import EditSessionModal from './EditSessionModal'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  const options = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: userTimezone
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

const SessionCard = ({ session, isPast = false }) => {
  const { isAdmin } = useSession()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

  return (
    <>
      <motion.div 
        className="bg-white rounded-2xl shadow-card hover:shadow-hover p-6 transition-all border border-light-200"
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-dark-900">{session.title}</h3>
              {isAdmin && !isPast && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FiEdit2 size={18} />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-dark-600 mb-2">
              <FiUser size={16} className="text-dark-900" />
              <span>{session.speaker}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-dark-600 mb-4">
              <FiCalendar size={16} className="text-dark-900" />
              <time>{formatDate(session.date)}</time>
              <span className="text-dark-400">({userTimezone})</span>
            </div>
            
            <p className="text-dark-700">{session.description}</p>
          </div>
          
          <div className="mt-6">
            {isPast ? (
              <div className="flex gap-4">
                <a 
                  href={session.recordingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FiVideo size={16} className="text-dark-900" />
                  <span>Recording</span>
                </a>
                <a 
                  href={session.summaryLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FiFileText size={16} className="text-dark-900" />
                  <span>Summary</span>
                </a>
              </div>
            ) : (
              <a 
                href={session.calendar_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                <FiPlus size={16} className="text-primary-600" />
                <span>Add to Calendar</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <EditSessionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        session={session}
      />
    </>
  )
}

export default SessionCard