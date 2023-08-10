import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { useLocalSearchParams } from 'expo-router'
import { type FunctionComponent } from 'react'

import { type Comment, CommentCard } from '~/components/comments/card'
import { CommentForm } from '~/components/comments/form'
import { Empty } from '~/components/common/empty'
import { Refresher } from '~/components/common/refresh'
import { Separator } from '~/components/common/separator'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { CommentSkeleton } from '~/components/skeletons/comment'
import { PostSkeleton } from '~/components/skeletons/post'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'
import { type CountColumn } from '~/types'

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
          'id, content, meta, created_at, community:communities(id, slug, name), user:users(id, username), liked:likes(user_id), likes(count), comments(count)',
        )
        .eq('liked.user_id', session?.user.id)
        .eq('id', id)
        .single()

      if (data) {
        return {
          comments: (data.comments as unknown as CountColumn)[0].count,
          community: data.community,
          content: data.content,
          createdAt: parseJSON(data.created_at),
          id: data.id,
          liked: data.liked.length > 0,
          likes: (data.likes as unknown as CountColumn)[0].count,
          meta: data.meta,
          user: data.user,
        }
      }
    },
    queryKey: ['post', id, session?.user.id],
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
        .select('id, content, created_at, user:users(id, username)')
        .eq('post_id', post.data?.id)
        .order('created_at', {
          ascending: false,
        })
        .range(from, to)
        .limit(limit + 1)

      const comments = (data ?? []).map(
        ({ content, created_at, id, user }) => ({
          content,
          createdAt: parseJSON(created_at),
          id,
          user,
        }),
      )

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
    <>
      <FlashList
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={() =>
          comments.isLoading ? <CommentSkeleton /> : <Empty />
        }
        ListFooterComponent={() =>
          comments.isFetchingNextPage ? <Spinner style={tw`my-4`} /> : null
        }
        ListHeaderComponent={() =>
          post.data ? (
            <PostCard
              linked={false}
              post={post.data}
              style={tw`border-gray-6 border-b-2`}
            />
          ) : (
            <PostSkeleton count={1} style={tw`border-gray-6 border-b-2`} />
          )
        }
        data={data}
        estimatedItemSize={108}
        onEndReached={() => {
          if (comments.hasNextPage) {
            comments.fetchNextPage()
          }
        }}
        refreshControl={<Refresher onRefresh={comments.refetch} />}
        renderItem={({ item }) => <CommentCard comment={item} />}
      />

      {post.data && <CommentForm post={post.data} />}
    </>
  )
}

export default Screen
