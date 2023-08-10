import { useQuery } from '@tanstack/react-query'

import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'

export const useCommunity = (slug: string) => {
  const { session } = useAuth()

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await supabase
        .from('communities')
        .select('id, slug, name, description, users(id)')
        .eq('slug', slug)
        .eq('users.id', session?.user.id)
        .single()

      if (data) {
        return {
          description: data.description,
          id: data.id,
          member: data.users.length > 0,
          name: data.name,
          slug: data.slug,
        }
      }

      return data
    },
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['community', slug],
  })

  return {
    community: data,
    loading: isLoading,
  }
}
