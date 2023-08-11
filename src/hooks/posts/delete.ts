import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Alert } from 'react-native'
import { useTranslations } from 'use-intl'

import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'
import { type Post } from '~/types'

export const useDeletePost = (post?: Post) => {
  const router = useRouter()

  const t = useTranslations('hook.posts.delete')

  const { session } = useAuth()

  const queryClient = useQueryClient()

  const updateKeyPosts = ['feed', session?.user.id]
  const updateKeyUserPosts = ['user_posts', post?.user?.id, session?.user.id]
  const updateKeyCommunityPosts = [
    'community_posts',
    post?.community?.id,
    session?.user.id,
  ]

  const updateKeys = [
    updateKeyPosts,
    updateKeyUserPosts,
    updateKeyCommunityPosts,
  ]

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => {
      if (!post) {
        return
      }

      const { error } = await supabase.from('posts').delete().eq('id', post.id)

      if (error) {
        throw error
      }

      router.back()
    },
    onSettled: () => {
      updateKeys.forEach((key) => queryClient.invalidateQueries(key))
    },
  })

  const deletePost = useCallback(() => {
    Alert.alert(t('title'), t('message'), [
      {
        isPreferred: true,
        text: t('no'),
      },
      {
        onPress: () => mutate(),
        style: 'destructive',
        text: t('yes'),
      },
    ])
  }, [mutate, t])

  return {
    deletePost,
    loading: isLoading,
  }
}
