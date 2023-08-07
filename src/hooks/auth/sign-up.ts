import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { z } from 'zod'

import { supabase } from '~/lib/supabase'

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(4).max(24),
})

export type Form = z.infer<typeof schema>

export const useSignUp = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const signUp = useCallback(
    async ({ email, password, username }: Form) => {
      try {
        setLoading(true)
        setError(undefined)

        const { error } = await supabase.auth.signUp({
          email,
          options: {
            data: {
              username,
            },
          },
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
    signUp,
  }
}
