import { FlashList } from '@shopify/flash-list'
import { type FunctionComponent } from 'react'

import { usePostSearch } from '~/hooks/search/posts'

import { Empty } from '../common/empty'
import { Refresher } from '../common/refresh'
import { Separator } from '../common/separator'
import { PostCard } from '../posts/card'
import { PostSkeleton } from '../skeletons/post'

type Props = {
  description: string
  query: string
}

export const SearchPostsCard: FunctionComponent<Props> = ({
  description,
  query,
}) => {
  const { enabled, loading, refetch, results } = usePostSearch(query)

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
      renderItem={({ item }) => <PostCard likeable={false} post={item} />}
    />
  )
}
