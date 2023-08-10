import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { type FunctionComponent } from 'react'

import { Empty } from '~/components/common/empty'
import { Separator } from '~/components/common/separator'
import { Spinner } from '~/components/common/spinner'
import { type Post, PostCard } from '~/components/posts/card'
import { PostSkeleton } from '~/components/skeletons/post'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const tw = useTailwind()

  const { session } = useAuth()

  const posts = useInfiniteQuery<{
    cursor?: number
    posts: Array<Post>
  }>({
    getNextPageParam: ({ cursor }) => cursor,
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 10

      const from = pageParam * limit
      const to = from + limit

      const { data } = await supabase
        .from('posts')
        .select(
          'id, content, meta, created_at, community:communities(id, slug, name), user:users(id, username), likes(user_id), comments(user_id)',
        )
        .order('created_at', {
          ascending: false,
        })
        .range(from, to)
        .limit(limit + 1)

      const posts = (data ?? []).map(
        ({
          comments,
          community,
          content,
          created_at,
          id,
          likes,
          meta,
          user,
        }) => ({
          comments: comments.length,
          community,
          content,
          createdAt: parseJSON(created_at),
          id,
          liked: !!likes.find(({ user_id }) => user_id === session?.user.id),
          likes: likes.length,
          meta,
          user,
        }),
      )

      const next = posts.length > limit ? posts.pop() : undefined

      return {
        cursor: next ? pageParam + 1 : undefined,
        posts,
      }
    },
    queryKey: ['posts'],
  })

  const data = (posts.data?.pages.map(({ posts }) => posts) ?? []).flat()

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={() =>
        posts.isLoading ? <PostSkeleton /> : <Empty />
      }
      ListFooterComponent={() =>
        posts.isFetchingNextPage ? <Spinner style={tw`my-4`} /> : null
      }
      data={data}
      estimatedItemSize={108}
      onEndReached={() => {
        if (posts.hasNextPage) {
          posts.fetchNextPage()
        }
      }}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  )
}

export default Screen
