import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { type FunctionComponent } from 'react'

import { Separator } from '~/components/common/separator'
import { type Post, PostCard } from '~/components/posts/card'
import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const { session } = useAuth()

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<{
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
          'id, content, meta, createdAt, community:communities(slug, name), user:users(username), likes(userId), comments(userId)',
        )
        .order('createdAt', {
          ascending: false,
        })
        .range(from, to)
        .limit(limit + 1)

      const posts = (data ?? []).map(
        ({
          comments,
          community,
          content,
          createdAt,
          id,
          likes,
          meta,
          user,
        }) => ({
          comments: comments.length,
          community,
          content,
          createdAt: parseJSON(createdAt),
          id,
          liked: !!likes.find(({ userId }) => userId === session?.user.id),
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

  const posts = (data?.pages.map(({ posts }) => posts) ?? []).flat()

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      data={posts}
      estimatedItemSize={108}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  )
}

export default Screen
