import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import useLocalStorage from 'use-local-storage'

const SessionContext = createContext()

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }) {
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [topics, setTopics] = useState([])
  const [votes, setVotes] = useLocalStorage('session-votes', {})
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAdmin(user?.email?.endsWith('@reforge.com') || false)
    }
    
    checkAdmin()
    loadSessions()
    loadTopics()
  }, [])

  const loadSessions = async () => {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: true })

    if (sessions) {
      const now = new Date()
      const upcomingSessions = sessions.filter(s => new Date(s.date) > now)
      const pastSessions = sessions.filter(s => new Date(s.date) <= now)
      
      setUpcoming(upcomingSessions)
      setPast(pastSessions)
    }
  }

  const loadTopics = async () => {
    const { data } = await supabase
      .from('topics')
      .select('*')
      .order('votes', { ascending: false })

    if (data) {
      setTopics(data)
    }
  }

  const createSession = async (sessionData) => {
    const { error } = await supabase
      .from('sessions')
      .insert([sessionData])

    if (error) throw error
    
    await loadSessions()
  }

  const isVoted = (topicId) => {
    return !!votes[topicId]
  }

  const voteForTopic = async (topicId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (votes[topicId]) {
      await supabase
        .from('votes')
        .delete()
        .match({ topic_id: topicId, user_id: user.id })
      
      await supabase.rpc('decrement_votes', { topic_id: topicId })
    } else {
      await supabase
        .from('votes')
        .insert({ topic_id: topicId, user_id: user.id })
      
      await supabase.rpc('increment_votes', { topic_id: topicId })
    }

    setVotes(prev => {
      if (prev[topicId]) {
        const newVotes = { ...prev }
        delete newVotes[topicId]
        return newVotes
      }
      return { ...prev, [topicId]: true }
    })

    await loadTopics()
  }

  const updateTopic = async (topicId, updates) => {
    const { error } = await supabase
      .from('topics')
      .update(updates)
      .eq('id', topicId)

    if (error) {
      console.error('Error updating topic:', error)
      return false
    }

    await loadTopics()
    return true
  }

  const deleteTopic = async (topicId) => {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', topicId)

    if (error) {
      console.error('Error deleting topic:', error)
      return false
    }

    await loadTopics()
    return true
  }

  const submitTopic = async (newTopic) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('topics')
      .insert([{ ...newTopic, user_id: user.id }])

    if (error) throw error
    
    await loadTopics()
  }

  const value = {
    upcoming,
    past,
    topics,
    votes,
    isAdmin,
    isVoted,
    voteForTopic,
    submitTopic,
    createSession,
    updateTopic,
    deleteTopic
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}