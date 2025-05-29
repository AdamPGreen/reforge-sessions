import { motion } from 'framer-motion'
import { FiThumbsUp } from 'react-icons/fi'
import { useSession } from '../context/SessionContext'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const TopicLeaderboard = () => {
  const { topics, voteForTopic, isVoted } = useSession()
  const { user } = useAuth()

  // Get top 5 active topics sorted by votes
  const topTopics = topics
    .filter(topic => topic.status === 'active')
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5)

  const handleVote = async (topicId) => {
    if (!user) return
    await voteForTopic(topicId)
  }

  return (
    <div className="max-w-sm">
      <div className="flex items-center justify-between mb-0">
        <div>
          <h2 className="text-2xl font-bold text-dark-900">Submitted Topics</h2>
          <p className="text-base text-dark-500">Vote on topics you'd like to see</p>
        </div>
        <Link
          to="/voting"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4 mt-6">
        {topTopics.map((topic) => (
          <motion.div
            key={topic.id}
            className="flex items-center justify-between bg-white rounded-2xl shadow-card border border-light-200 px-4 py-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-dark-900 truncate">{topic.title}</h3>
              <p className="text-sm text-dark-500 truncate">{topic.user_name}</p>
            </div>
            <motion.button
              type="button"
              onClick={() => handleVote(topic.id)}
              disabled={!user}
              className={`ml-4 flex items-center gap-1 px-3 py-2 rounded-lg text-base font-medium transition-colors focus:outline-none ${
                isVoted(topic.id)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ boxShadow: 'none', border: 'none' }}
              whileTap={{ scale: 0.97 }}
            >
              <FiThumbsUp size={18} />
              <span>{topic.votes}</span>
            </motion.button>
          </motion.div>
        ))}

        {topTopics.length === 0 && (
          <p className="text-sm text-dark-500 text-center py-4">
            No active topics available
          </p>
        )}
      </div>
    </div>
  )
}

export default TopicLeaderboard 