import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type Post } from '~/components/posts/card'
import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'

export const useLikePost = (post: Post) => {
  const { session } = useAuth()

  const queryClient = useQueryClient()

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => {
      const userId = session?.user.id

      if (!userId) {
        return
      }

      const { data: exists } = await supabase
        .from('likes')
        .select('id')
        .eq('postId', post.id)
        .eq('userId', userId)
        .single()

      if (exists) {
        return supabase.from('likes').delete().eq('id', exists.id)
      }

      return supabase.from('likes').insert({
        postId: post.id,
        userId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      })

      queryClient.invalidateQueries({
        queryKey: ['post', post.id],
      })

      queryClient.invalidateQueries({
        queryKey: ['user_posts', post.user?.id],
      })

      queryClient.invalidateQueries({
        queryKey: ['community_posts', post.community?.id],
      })
    },
  })

  return {
    likePost: mutate,
    loading: isLoading,
  }
}
