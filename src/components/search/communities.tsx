import { FlashList } from '@shopify/flash-list'
import { type FunctionComponent } from 'react'

import { useCommunitySearch } from '~/hooks/search/communities'

import { Empty } from '../common/empty'
import { Refresher } from '../common/refresh'
import { Separator } from '../common/separator'
import { CommunityCard } from '../communities/card'
import { PostSkeleton } from '../skeletons/post'

type Props = {
  description: string
  query: string
}

export const SearchCommunitiesCard: FunctionComponent<Props> = ({
  description,
  query,
}) => {
  const { enabled, loading, refetch, results } = useCommunitySearch(query)

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={() =>
        loading ? (
          <PostSkeleton />
        ) : enabled ? (
          <Empty animated={false} />
        ) : (
          <Empty animated={false} description={description} />
        )
      }
      data={results}
      estimatedItemSize={108}
      refreshControl={<Refresher onRefresh={refetch} />}
      renderItem={({ item }) => <CommunityCard community={item} />}
    />
  )
}
