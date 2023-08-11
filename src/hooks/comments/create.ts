import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { z } from 'zod'

import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'
import { type Post } from '~/types'

export const schema = z.object({
  content: z.string().min(4),
})

export type Form = z.infer<typeof schema>

export const useCreateComment = (post: Post) => {
  const { session } = useAuth()

  const queryClient = useQueryClient()

  const updateKeyComments = ['comments', post.id]
  const updateKeyPost = ['post', post.id, session?.user.id]

  const updateKeys = [updateKeyComments, updateKeyPost]

  const { isLoading, mutateAsync } = useMutation<unknown, Error, Form>({
    mutationFn: async ({ content }) => {
      const userId = session?.user.id

      if (!userId) {
        return
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: post.id,
          user_id: userId,
        })
        .select('id, content, created_at, user:users(id, username)')
        .single()

      if (error) {
        throw error
      }

      return {
        content: data.content,
        createdAt: parseJSON(data.created_at),
        id: data.id,
        user: data.user,
      }
    },
    onSettled: () => {
      updateKeys.forEach((key) => queryClient.invalidateQueries(key))
    },
  })

  return {
    createComment: mutateAsync,
    loading: isLoading,
  }
}
