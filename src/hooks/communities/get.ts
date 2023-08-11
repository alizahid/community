import { useQuery } from '@tanstack/react-query'

import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'
import { type Community } from '~/types'

export const useCommunity = (slug: string) => {
  const { session } = useAuth()

  const { data, isLoading } = useQuery<Community | undefined>({
    queryFn: async () => {
      const { data } = await supabase
        .from('communities')
        .select('id, slug, name, description, members(role)')
        .eq('slug', slug)
        .eq('members.user_id', session?.user.id)
        .single()

      if (data) {
        return {
          admin: data.members[0]?.role === 'admin',
          description: data.description,
          id: data.id,
          member: data.members.length > 0,
          name: data.name,
          slug: data.slug,
        }
      }
    },
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['community', slug],
  })

  return {
    community: data,
    loading: isLoading,
  }
}
