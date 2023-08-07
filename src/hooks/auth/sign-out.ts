import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'

import { supabase } from '~/lib/supabase'

export const useSignOut = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const signOut = useCallback(async () => {
    try {
      setLoading(true)

      await supabase.auth.signOut()

      router.replace('/')
    } finally {
      setLoading(false)
    }
  }, [router])

  return {
    loading,
    signOut,
  }
}
