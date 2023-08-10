import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { z } from 'zod'

import { supabase } from '~/lib/supabase'

export const postMeta = z.object({
  images: z.array(
    z.object({
      hash: z.string().optional(),
      height: z.number(),
      url: z.string(),
      width: z.number(),
    }),
  ),
})

export type PostMeta = z.infer<typeof postMeta>

export const schema = z.object({
  communityId: z.number(),
  content: z.string().min(8),
  meta: postMeta.default({
    images: [],
  }),
  userId: z.string().uuid(),
})

export type Form = z.infer<typeof schema>

export const useCreatePost = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const createPost = useCallback(
    async ({ communityId, content, meta, userId }: Form) => {
      try {
        setLoading(true)
        setError(undefined)

        const { data, error } = await supabase
          .from('posts')
          .insert({
            community_id: communityId,
            content,
            meta,
            user_id: userId,
          })
          .select('id')
          .single()

        if (error) {
          throw error
        }

        router.push(`/posts/${data.id}`)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  return {
    createPost,
    error,
    loading,
  }
}
