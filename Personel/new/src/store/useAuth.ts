import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getUser()
      .then(({ data }) => setUser(data.user))
      .finally(() => setLoading(false))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthError(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return
    setAuthError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setAuthError(error.message)
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    setAuthError(null)
    const { error } = await supabase.auth.signOut()
    if (error) setAuthError(error.message)
  }, [])

  return {
    user,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    isConfigured: isSupabaseConfigured,
  }
}
