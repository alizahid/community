import { useQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'

import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'
import { type CountColumn } from '~/types'

export const usePostSearch = (query: string) => {
  const { session } = useAuth()

  const enabled = query.length >= 3

  const { data, isFetching, refetch } = useQuery({
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(
          'id, content, meta, created_at, community:communities(id, slug, name), user:users(id, username), liked:likes(user_id), likes(count), comments(count)',
        )
        .eq('liked.user_id', session?.user.id)
        .textSearch('search', query)
        .limit(10)

      if (error) {
        throw error
      }

      return data.map(
        ({
          comments,
          community,
          content,
          created_at,
          id,
          liked,
          likes,
          meta,
          user,
        }) => ({
          comments: (comments as unknown as CountColumn)[0].count,
          community,
          content,
          createdAt: parseJSON(created_at),
          id,
          liked: liked.length > 0,
          likes: (likes as unknown as CountColumn)[0].count,
          meta,
          user,
        }),
      )
    },
    queryKey: ['search_posts', query, session?.user.id],
  })

  return {
    enabled,
    loading: isFetching,
    refetch,
    results: data,
  }
}
