import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
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

  const { error, isLoading, mutate } = useMutation<void, Error, Form>({
    mutationFn: async ({ email, password, username }) => {
      const response = await supabase.auth.signUp({
        email,
        options: {
          data: {
            username,
          },
        },
        password,
      })

      if (response.error) {
        throw response.error
      }

      const community = await supabase
        .from('communities')
        .select('id')
        .eq('slug', 'community')
        .single()

      if (community.data && response.data.user) {
        await supabase.from('members').insert({
          community_id: community.data.id,
          role: 'member',
          user_id: response.data.user.id,
        })
      }

      router.replace('/home/')
    },
  })

  return {
    error: error?.message,
    loading: isLoading,
    signUp: mutate,
  }
}
