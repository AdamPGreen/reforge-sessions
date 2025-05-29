import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { useSession } from '../context/SessionContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const EditSessionModal = ({ isOpen, onClose, session }) => {
  const { updateSession } = useSession()
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()
  const [userTimezone, setUserTimezone] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    // Get user's timezone
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  // Update form values when session changes
  useEffect(() => {
    if (session) {
      setValue('title', session.title)
      setValue('description', session.description)
      setValue('speaker', session.speaker)
      // Convert UTC date to local date for DatePicker
      const localDate = new Date(session.date)
      setSelectedDate(localDate)
      setValue('calendar_link', session.calendar_link)
    }
  }, [session, setValue])

  const onSubmit = async (data) => {
    try {
      if (!selectedDate) throw new Error('Date is required')
      // Save the selected date as UTC ISO string (no manual offset)
      const sessionData = {
        ...data,
        date: selectedDate.toISOString(),
        id: session.id
      }
      await updateSession(sessionData)
      reset()
      setSelectedDate(null)
      onClose()
    } catch (error) {
      console.error('Error updating session:', error)
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
                    Edit Session
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
                      Date and Time ({userTimezone})
                    </label>
                    <DatePicker
                      id="date"
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="Pp"
                      minDate={new Date()}
                      placeholderText="Select date and time"
                      className="w-full px-4 py-2 rounded-lg border border-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      popperClassName="z-[200]"
                      required
                    />
                    {!selectedDate && (
                      <p className="text-red-500 text-sm mt-1">Date is required</p>
                    )}
                    <p className="text-sm text-dark-500 mt-1">
                      Times are shown in your local timezone ({userTimezone}) and must be in 15-minute intervals
                    </p>
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
                    Update Session
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

export default EditSessionModal 