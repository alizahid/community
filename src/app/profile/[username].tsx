import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { type FunctionComponent, useEffect } from 'react'

import { Separator } from '~/components/common/separator'
import { type Post, PostCard } from '~/components/posts/card'
import { UserCard } from '~/components/users/card'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const navigation = useNavigation()
  const params = useLocalSearchParams()

  const username = String(params.username)

  const { session } = useAuth()

  const tw = useTailwind()

  const user = useQuery({
    queryFn: async () => {
      const { data } = await supabase
        .from('users')
        .select('id, username, createdAt')
        .eq('username', username)
        .single()

      if (!data) {
        return
      }

      return {
        createdAt: parseJSON(data.createdAt),
        id: data.id,
        username: data.username,
      }
    },
    queryKey: ['profile', username],
  })

  useEffect(() => {
    if (!user.data) {
      return
    }

    navigation.setOptions({
      title: user.data.username,
    })
  }, [user.data, navigation])

  const posts = useInfiniteQuery<{
    cursor?: number
    posts: Array<Post>
  }>({
    enabled: !!user.data,
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
        .eq('userId', user.data?.id)
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
    queryKey: ['user_posts', user.data?.id],
  })

  const data = (posts.data?.pages.map(({ posts }) => posts) ?? []).flat()

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={() =>
        user.data ? (
          <UserCard
            linked={false}
            style={tw`border-gray-6 border-b-2`}
            user={user.data}
          />
        ) : null
      }
      data={data}
      estimatedItemSize={108}
      onEndReached={() => {
        if (posts.hasNextPage) {
          posts.fetchNextPage()
        }
      }}
      renderItem={({ item }) => <PostCard community={false} post={item} />}
    />
  )
}

export default Screen
