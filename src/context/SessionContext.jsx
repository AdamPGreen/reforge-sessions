import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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

  const loadSessions = useCallback(async () => {
    console.log('[SessionContext] Loading sessions:', {
      timestamp: Date.now(),
      stack: new Error().stack
    })
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        console.error('[SessionContext] Error loading sessions:', error)
        throw error
      }

      if (data) {
        // Split sessions into upcoming and past
        const now = new Date()
        const upcoming = data.filter(session => new Date(session.date) > now)
        const past = data.filter(session => new Date(session.date) <= now)

        console.log('[SessionContext] Sessions loaded:', {
          upcoming: upcoming.length,
          past: past.length,
          timestamp: Date.now(),
          stack: new Error().stack
        })
        setUpcoming(upcoming)
        setPast(past)
      }
    } catch (err) {
      console.error('[SessionContext] Unexpected error loading sessions:', err)
      throw err
    }
  }, [])

  const loadTopics = useCallback(async () => {
    console.log('[SessionContext] Loading topics:', {
      timestamp: Date.now(),
      stack: new Error().stack
    })
    try {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          votes:votes(count)
        `)
        .order('votes', { ascending: false })

      if (error) {
        console.error('[SessionContext] Error loading topics:', error)
        throw error
      }

      if (data) {
        // Transform the data to include the vote count
        const topicsWithVotes = data.map(topic => ({
          ...topic,
          votes: topic.votes?.[0]?.count || 0
        }))

        console.log('[SessionContext] Topics loaded:', {
          count: topicsWithVotes.length,
          timestamp: Date.now(),
          stack: new Error().stack
        })
        setTopics(topicsWithVotes)
      }
    } catch (err) {
      console.error('[SessionContext] Unexpected error loading topics:', err)
      throw err
    }
  }, [])

  const loadUserVotes = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { data: votes, error } = await supabase
        .from('votes')
        .select('topic_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('[SessionContext] Error loading user votes:', error)
        return
      }

      // Convert array of vote objects to object with topic_ids as keys
      const votesMap = votes.reduce((acc, vote) => {
        acc[vote.topic_id] = true
        return acc
      }, {})

      setVotes(votesMap)
    } catch (err) {
      console.error('[SessionContext] Unexpected error loading user votes:', err)
    }
  }, [setVotes])

  useEffect(() => {
    let mounted = true;

    console.log('[SessionContext] Initializing context:', {
      timestamp: Date.now(),
      path: window.location.pathname,
      stack: new Error().stack
    })

    const initialize = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (mounted) {
          setIsAdmin(!!adminData)
        }

        // Load initial data
        await Promise.all([
          loadSessions(),
          loadTopics(),
          loadUserVotes()
        ])

        if (mounted) {
          setIsLoading(false)
        }
      } catch (err) {
        console.error('[SessionContext] Error initializing:', err)
        if (mounted) {
          setError(err)
          setIsLoading(false)
        }
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [loadSessions, loadTopics, loadUserVotes])

  const createSession = async (sessionData) => {
    try {
      // Start a transaction
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()
        .single()

      if (sessionError) throw sessionError

      // If this session was created from a topic, update the topic
      if (sessionData.topic_id) {
        const { error: topicError } = await supabase
          .from('topics')
          .update({ session_id: session.id })
          .eq('id', sessionData.topic_id)

        if (topicError) throw topicError
      }
      
      await loadSessions()
      await loadTopics() // Reload topics to reflect the change
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  const isVoted = (topicId) => {
    return !!votes[topicId]
  }

  const voteForTopic = async (topicId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const hasVoted = votes[topicId]

      if (hasVoted) {
        // Remove vote
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .match({ topic_id: topicId, user_id: user.id })

        if (deleteError) throw deleteError

        // Update local state
        setVotes(prev => {
          const newVotes = { ...prev }
          delete newVotes[topicId]
          return newVotes
        })
      } else {
        // Add vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({ topic_id: topicId, user_id: user.id })

        if (insertError) throw insertError

        // Update local state
        setVotes(prev => ({ ...prev, [topicId]: true }))
      }

      // Reload topics to get fresh vote counts
      await loadTopics()
    } catch (error) {
      console.error('Error voting for topic:', error)
      // Reload topics and votes to ensure UI is in sync
      await Promise.all([loadTopics(), loadUserVotes()])
    }
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
    if (!isAdmin) {
      console.error('Only admins can delete topics')
      return false
    }

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

    try {
      const { error } = await supabase
        .from('topics')
        .insert([{ 
          ...newTopic,
          user_id: user.id,
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email
        }])

      if (error) {
        console.error('[SessionContext] Error submitting topic:', error)
        throw error
      }
      
      await loadTopics()
    } catch (err) {
      console.error('[SessionContext] Unexpected error submitting topic:', err)
      throw err
    }
  }

  const updateSession = async (sessionData) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({
          title: sessionData.title,
          description: sessionData.description,
          speaker: sessionData.speaker,
          date: sessionData.date,
          calendar_link: sessionData.calendar_link
        })
        .eq('id', sessionData.id)

      if (error) throw error
      
      await loadSessions()
    } catch (error) {
      console.error('Error updating session:', error)
      throw error
    }
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
    updateSession,
    updateTopic,
    deleteTopic
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}