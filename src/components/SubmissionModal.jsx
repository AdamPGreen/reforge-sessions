import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { useSession } from '../context/SessionContext'

const sessionTypes = [
  { id: 'internal', label: 'Internal Presenter' },
  { id: 'expert', label: 'External Expert' }
]

const SubmissionModal = ({ isOpen, onClose }) => {
  const [sessionType, setSessionType] = useState('internal')
  const { submitTopic } = useSession()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  const onSubmit = async (data) => {
    try {
      await submitTopic({
        title: data.title,
        description: data.description,
        speaker: data.speaker || null,
        is_external: sessionType === 'expert',
        knows_expert: data.knows_expert || false,
        votes: 0
      })
      reset()
      onClose()
    } catch (error) {
      console.error('Error submitting:', error)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div 
            className="fixed inset-0 bg-dark-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div 
                className="bg-white rounded-2xl shadow-lg w-full max-w-lg relative"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 border-b border-light-200">
                  <h2 className="text-xl font-semibold text-dark-900">Suggest a Session</h2>
                  <button 
                    type="button"
                    onClick={onClose}
                    className="text-dark-500 hover:text-dark-700 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <label htmlFor="session-type" className="block text-sm font-medium text-dark-700 mb-2">
                      What type of session would you like to suggest?
                    </label>
                    <div id="session-type" className="grid grid-cols-2 gap-3">
                      {sessionTypes.map(type => (
                        <button
                          key={type.id}
                          type="button"
                          className={`p-3 text-sm font-medium rounded-lg transition-colors ${
                            sessionType === type.id
                              ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                              : 'bg-light-100 text-dark-600 hover:bg-light-200'
                          }`}
                          onClick={() => setSessionType(type.id)}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="session-speaker" className="block text-sm font-medium text-dark-700 mb-1">
                        Presenter Name (Optional)
                      </label>
                      <input
                        id="session-speaker"
                        {...register('speaker')}
                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Who will be presenting?"
                      />
                    </div>

                    <div>
                      <label htmlFor="session-title" className="block text-sm font-medium text-dark-700 mb-1">
                        Session Title/Topic
                      </label>
                      <input
                        id="session-title"
                        {...register('title', { required: 'Title is required' })}
                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="What's the session about?"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="session-description" className="block text-sm font-medium text-dark-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="session-description"
                        {...register('description', { required: 'Description is required' })}
                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={4}
                        placeholder="What will be covered in this session?"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    {sessionType === 'expert' && (
                      <div>
                        <label htmlFor="knows-expert" className="flex items-center space-x-2">
                          <input
                            id="knows-expert"
                            type="checkbox"
                            {...register('knows_expert')}
                            className="w-4 h-4 text-primary-600 rounded border-light-300 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-dark-700">Do you know them directly?</span>
                        </label>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-primary-600 text-white font-medium shadow-md hover:bg-primary-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Suggest Session
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SubmissionModal