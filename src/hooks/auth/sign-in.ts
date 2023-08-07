import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { z } from 'zod'

import { supabase } from '~/lib/supabase'

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type Form = z.infer<typeof schema>

export const useSignIn = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const signIn = useCallback(
    async ({ email, password }: Form) => {
      try {
        setLoading(true)
        setError(undefined)

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        router.replace('/home/')
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  return {
    error,
    loading,
    signIn,
  }
}
