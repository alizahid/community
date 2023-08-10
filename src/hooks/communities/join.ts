import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type Community } from '~/components/communities/card'
import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'

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
        .select('communityId, userId')
        .eq('communityId', community.id)
        .eq('userId', userId)
        .single()

      if (exists) {
        return supabase
          .from('members')
          .delete()
          .eq('communityId', community.id)
          .eq('userId', userId)
      }

      return supabase.from('members').insert({
        communityId: community.id,
        role: 'member',
        userId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['community', community.slug],
      })
    },
  })

  return {
    joinCommunity: mutate,
    loading: isLoading,
  }
}
