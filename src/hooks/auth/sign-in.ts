import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { z } from 'zod'

import { supabase } from '~/lib/supabase'

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type Form = z.infer<typeof schema>

export const useSignIn = () => {
  const router = useRouter()

  const { error, isLoading, mutate } = useMutation<void, Error, Form>({
    mutationFn: async ({ email, password }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.replace('/home/')
    },
  })

  return {
    error: error?.message,
    loading: isLoading,
    signIn: mutate,
  }
}
