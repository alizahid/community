import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { useLocalSearchParams } from 'expo-router'
import { type FunctionComponent } from 'react'

import { type Comment, CommentCard } from '~/components/comments/card'
import { Separator } from '~/components/common/separator'
import { PostCard } from '~/components/posts/card'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const params = useLocalSearchParams()

  const id = Number(params.id)

  const { session } = useAuth()

  const tw = useTailwind()

  const post = useQuery({
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select(
          'id, content, meta, createdAt, community:communities(id, slug, name), user:users(id, username), likes(userId), comments(userId)',
        )
        .eq('id', id)
        .single()

      if (data) {
        return {
          comments: data.comments.length,
          community: data.community,
          content: data.content,
          createdAt: parseJSON(data.createdAt),
          id: data.id,
          liked: !!data.likes.find(({ userId }) => userId === session?.user.id),
          likes: data.likes.length,
          meta: data.meta,
          user: data.user,
        }
      }
    },
    queryKey: ['post', id],
  })

  const comments = useInfiniteQuery<{
    comments: Array<Comment>
    cursor?: number
  }>({
    enabled: !!post.data,
    getNextPageParam: ({ cursor }) => cursor,
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 10

      const from = pageParam * limit
      const to = from + limit

      const { data } = await supabase
        .from('comments')
        .select('id, content, createdAt, user:users(id, username)')
        .order('createdAt', {
          ascending: false,
        })
        .eq('id', post.data?.id)
        .range(from, to)
        .limit(limit + 1)

      const comments = (data ?? []).map(({ content, createdAt, id, user }) => ({
        content,
        createdAt: parseJSON(createdAt),
        id,
        user,
      }))

      const next = comments.length > limit ? comments.pop() : undefined

      return {
        comments,
        cursor: next ? pageParam + 1 : undefined,
      }
    },
    queryKey: ['comments', post.data?.id],
  })

  const data = (
    comments.data?.pages.map(({ comments }) => comments) ?? []
  ).flat()

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={() =>
        post.data ? (
          <PostCard
            linked={false}
            post={post.data}
            style={tw`border-gray-6 border-b-2`}
          />
        ) : null
      }
      data={data}
      estimatedItemSize={108}
      onEndReached={() => {
        if (comments.hasNextPage) {
          comments.fetchNextPage()
        }
      }}
      renderItem={({ item }) => <CommentCard comment={item} />}
    />
  )
}

export default Screen
