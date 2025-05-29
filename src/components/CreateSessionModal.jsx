import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { useSession } from '../context/SessionContext'

const CreateSessionModal = ({ isOpen, onClose, topic = null }) => {
  const { createSession } = useSession()
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  // Update form values when topic changes
  useEffect(() => {
    if (topic) {
      setValue('title', topic.title)
      setValue('description', topic.description)
      setValue('speaker', topic.user_name || 'TBD')
      setValue('date', '')
      setValue('calendar_link', '')
    } else {
      // Reset form for custom session
      setValue('title', '')
      setValue('description', '')
      setValue('speaker', '')
      setValue('date', '')
      setValue('calendar_link', '')
    }
  }, [topic, setValue])

  const onSubmit = async (data) => {
    try {
      const sessionData = {
        ...data,
        topic_id: topic?.id // Include topic_id if this is being created from a topic
      }
      await createSession(sessionData)
      reset()
      onClose()
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark-900">
                    {topic ? 'Create Session from Topic' : 'Create Custom Session'}
                  </h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 text-dark-500 hover:text-dark-700 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-dark-700 mb-1">
                      Session Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-dark-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      {...register('description', { required: 'Description is required' })}
                      className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="speaker" className="block text-sm font-medium text-dark-700 mb-1">
                      Speaker
                    </label>
                    <input
                      id="speaker"
                      type="text"
                      {...register('speaker', { required: 'Speaker is required' })}
                      className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.speaker && (
                      <p className="text-red-500 text-sm mt-1">{errors.speaker.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-dark-700 mb-1">
                      Date and Time
                    </label>
                    <input
                      id="date"
                      type="datetime-local"
                      {...register('date', { required: 'Date is required' })}
                      className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="calendar_link" className="block text-sm font-medium text-dark-700 mb-1">
                      Calendar Link
                    </label>
                    <input
                      id="calendar_link"
                      type="url"
                      {...register('calendar_link', { required: 'Calendar link is required' })}
                      className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.calendar_link && (
                      <p className="text-red-500 text-sm mt-1">{errors.calendar_link.message}</p>
                    )}
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
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CreateSessionModal 