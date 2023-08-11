import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { kebabCase } from 'lodash'
import { z } from 'zod'

import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'

export const schema = z.object({
  description: z.string().min(8),
  image: z.string().optional(),
  name: z.string().min(4),
})

export type Form = z.infer<typeof schema>

export const useCreateCommunity = () => {
  const router = useRouter()

  const { session } = useAuth()

  const queryClient = useQueryClient()

  const { error, isLoading, mutateAsync } = useMutation<void, Error, Form>({
    mutationFn: async ({ description, image, name }) => {
      const userId = session?.user.id

      if (!userId) {
        return
      }

      const { data, error } = await supabase
        .from('communities')
        .insert({
          description,
          image,
          name,
          slug: kebabCase(name),
        })
        .select('slug')
        .single()

      if (error) {
        throw error
      }

      router.push(`/communities/${data.slug}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['communities'])
    },
  })

  return {
    createCommunity: mutateAsync,
    error: error?.message,
    loading: isLoading,
  }
}
