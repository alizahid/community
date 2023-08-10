import { useMutation, useQueryClient } from '@tanstack/react-query'

import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'
import { type Community } from '~/types'

export const useJoinCommunity = (community: Community) => {
  const { session } = useAuth()

  const queryClient = useQueryClient()

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => {
      const userId = session?.user.id

      if (!userId) {
        return
      }

      const { data: exists } = await supabase
        .from('members')
        .select('community_id, user_id')
        .eq('community_id', community.id)
        .eq('user_id', userId)
        .single()

      if (exists) {
        await supabase
          .from('members')
          .delete()
          .eq('community_id', community.id)
          .eq('user_id', userId)

        return
      }

      await supabase.from('members').insert({
        community_id: community.id,
        role: 'member',
        user_id: userId,
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries(['community', community.slug])
    },
  })

  return {
    joinCommunity: mutate,
    loading: isLoading,
  }
}
