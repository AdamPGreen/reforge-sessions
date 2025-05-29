import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiThumbsUp, FiEdit2, FiTrash2, FiCheck, FiX, FiUser, FiCalendar } from 'react-icons/fi'
import { useSession } from '../context/SessionContext'
import { useAuth } from '../context/AuthContext'

const TopicCard = ({ topic }) => {
  const { voteForTopic, isVoted, updateTopic, deleteTopic, isAdmin } = useSession()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(topic.title)
  const [editedDescription, setEditedDescription] = useState(topic.description)
  const [isVoting, setIsVoting] = useState(false)
  
  const handleVote = async () => {
    if (!user || isVoting) return
    
    try {
      setIsVoting(true)
      await voteForTopic(topic.id)
    } finally {
      setIsVoting(false)
    }
  }

  const handleEdit = async () => {
    const success = await updateTopic(topic.id, {
      title: editedTitle,
      description: editedDescription
    })
    if (success) {
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      await deleteTopic(topic.id)
    }
  }

  const handleCancel = () => {
    setEditedTitle(topic.title)
    setEditedDescription(topic.description)
    setIsEditing(false)
  }
  
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-card p-5 transition-all border ${
        topic.session_id ? 'border-primary-200 bg-primary-50' : 'border-light-200'
      }`}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  <FiCheck size={14} />
                  Save
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-dark-600 bg-light-100 rounded-md hover:bg-light-200"
                >
                  <FiX size={14} />
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-1 text-dark-900">{topic.title}</h3>
              <div className="flex items-center gap-1 text-sm text-dark-500 mb-2">
                <FiUser size={14} />
                <span>Suggested by {topic.user_name || 'Anonymous'}</span>
              </div>
              <p className="text-dark-700 text-sm">{topic.description}</p>
              {topic.session_id && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                  <FiCalendar size={14} />
                  <span>Converted to Session</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          {!topic.session_id && (
            <motion.button
              type="button"
              onClick={handleVote}
              disabled={!user || isVoting}
              className={`flex flex-col items-center justify-center min-w-[60px] p-2 rounded-md transition-colors ${
                isVoted(topic.id) 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-light-100 text-dark-500 hover:bg-light-200'
              } ${(!user || isVoting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={topic.votes}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 8, opacity: 0 }}
                  className="font-bold"
                >
                  {topic.votes}
                </motion.span>
              </AnimatePresence>
              <div className="flex items-center gap-1 text-sm">
                <FiThumbsUp size={14} />
                <span>Votes</span>
              </div>
            </motion.button>
          )}

          {isAdmin && !isEditing && (
            <div className="flex flex-col gap-1">
              <motion.button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center p-2 text-dark-500 hover:text-dark-700 transition-colors"
              >
                <FiEdit2 size={16} />
              </motion.button>
              <motion.button
                type="button"
                onClick={handleDelete}
                className="flex items-center justify-center p-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <FiTrash2 size={16} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TopicCard