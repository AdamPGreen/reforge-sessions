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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true;

    console.log('[SessionContext] Initializing context:', {
      timestamp: Date.now(),
      path: window.location.pathname,
      stack: new Error().stack
    })

    const checkAdmin = async () => {
      if (!mounted) return;
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          console.error('[SessionContext] Error checking admin status:', error)
          return
        }
        const adminStatus = user?.email?.endsWith('@reforge.com') || false
        console.log('[SessionContext] Admin check:', {
          userEmail: user?.email,
          isAdmin: adminStatus,
          timestamp: Date.now(),
          stack: new Error().stack
        })
        setIsAdmin(adminStatus)
      } catch (err) {
        console.error('[SessionContext] Unexpected error during admin check:', err)
      }
    }
    
    const initialize = async () => {
      if (!mounted) return;
      
      try {
        setIsLoading(true)
        setError(null)
        
        await Promise.all([
          checkAdmin(),
          loadSessions(),
          loadTopics()
        ])
        
        console.log('[SessionContext] Initialization complete:', {
          timestamp: Date.now(),
          stack: new Error().stack
        })
      } catch (err) {
        console.error('[SessionContext] Error during initialization:', err)
        setError(err)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }
    
    initialize()

    return () => {
      mounted = false
    }
  }, [])

  const loadSessions = async () => {
    console.log('[SessionContext] Loading sessions:', {
      timestamp: Date.now(),
      stack: new Error().stack
    })
    try {
      const { data: sessions, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        console.error('[SessionContext] Error loading sessions:', error)
        throw error
      }

      if (sessions) {
        const now = new Date()
        const upcomingSessions = sessions.filter(s => new Date(s.date) > now)
        const pastSessions = sessions.filter(s => new Date(s.date) <= now)
        
        console.log('[SessionContext] Sessions loaded:', {
          total: sessions.length,
          upcoming: upcomingSessions.length,
          past: pastSessions.length,
          timestamp: Date.now(),
          stack: new Error().stack
        })
        
        setUpcoming(upcomingSessions)
        setPast(pastSessions)
      }
    } catch (err) {
      console.error('[SessionContext] Unexpected error loading sessions:', err)
      throw err
    }
  }

  const loadTopics = async () => {
    console.log('[SessionContext] Loading topics:', {
      timestamp: Date.now(),
      stack: new Error().stack
    })
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('votes', { ascending: false })

      if (error) {
        console.error('[SessionContext] Error loading topics:', error)
        throw error
      }

      if (data) {
        console.log('[SessionContext] Topics loaded:', {
          count: data.length,
          timestamp: Date.now(),
          stack: new Error().stack
        })
        setTopics(data)
      }
    } catch (err) {
      console.error('[SessionContext] Unexpected error loading topics:', err)
      throw err
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
    isLoading,
    error,
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