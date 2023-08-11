import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Alert } from 'react-native'
import { useTranslations } from 'use-intl'

import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'
import { type Comment } from '~/types'

export const useDeleteComment = (postId: number, comment: Comment) => {
  const t = useTranslations('hook.comments.delete')

  const { session } = useAuth()

  const queryClient = useQueryClient()

  const updateKeyComments = ['comments', postId]
  const updateKeyPost = ['post', postId, session?.user.id]

  const updateKeys = [updateKeyComments, updateKeyPost]

  const { isLoading, mutateAsync } = useMutation<unknown, Error>({
    mutationFn: async () => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', comment.id)
        .single()

      if (error) {
        throw error
      }
    },
    onSettled: () => {
      updateKeys.forEach((key) => queryClient.invalidateQueries(key))
    },
  })

  const deleteComment = useCallback(
    () =>
      new Promise<void>((resolve) =>
        Alert.alert(t('title'), t('message'), [
          {
            isPreferred: true,
            text: t('no'),
          },
          {
            onPress: async () => {
              await mutateAsync()

              resolve()
            },
            style: 'destructive',
            text: t('yes'),
          },
        ]),
      ),
    [mutateAsync, t],
  )

  return {
    deleteComment,
    loading: isLoading,
  }
}
