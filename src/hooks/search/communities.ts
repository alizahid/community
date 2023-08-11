import { useQuery } from '@tanstack/react-query'

import { supabase } from '~/lib/supabase'

export const useCommunitySearch = (query: string) => {
  const enabled = query.length >= 3

  const { data, isFetching, refetch } = useQuery({
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('id, slug, name, description')
        .textSearch('search', query)
        .limit(10)

      if (error) {
        throw error
      }

      return data
    },
    queryKey: ['search_communities', query],
  })

  return {
    enabled,
    loading: isFetching,
    refetch,
    results: data,
  }
}
