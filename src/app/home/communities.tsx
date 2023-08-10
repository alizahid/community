import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { type FunctionComponent } from 'react'

import { Refresher } from '~/components/common/refresh'
import { Separator } from '~/components/common/separator'
import { type Community, CommunityCard } from '~/components/communities/card'
import { supabase } from '~/lib/supabase'

const Screen: FunctionComponent = () => {
  const communities = useInfiniteQuery<{
    communities: Array<Community>
    cursor?: number
  }>({
    getNextPageParam: ({ cursor }) => cursor,
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 10

      const from = pageParam * limit
      const to = from + limit

      const { data } = await supabase
        .from('communities')
        .select('id, slug, name, description')
        .order('created_at', {
          ascending: false,
        })
        .range(from, to)
        .limit(limit + 1)

      const communities = (data ?? []).map(
        ({ description, id, name, slug }) => ({
          description,
          id,
          name,
          slug,
        }),
      )

      const next = communities.length > limit ? communities.pop() : undefined

      return {
        communities,
        cursor: next ? pageParam + 1 : undefined,
      }
    },
    queryKey: ['communities'],
  })

  const data = (
    communities.data?.pages.map(({ communities }) => communities) ?? []
  ).flat()

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      data={data}
      estimatedItemSize={80}
      onEndReached={() => {
        if (communities.hasNextPage) {
          communities.fetchNextPage()
        }
      }}
      refreshControl={<Refresher onRefresh={communities.refetch} />}
      renderItem={({ item }) => <CommunityCard community={item} />}
    />
  )
}

export default Screen
