import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { type FunctionComponent, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Empty } from '~/components/common/empty'
import { Refresher } from '~/components/common/refresh'
import { Separator } from '~/components/common/separator'
import { Spinner } from '~/components/common/spinner'
import { type Post, PostCard } from '~/components/posts/card'
import { PostSkeleton } from '~/components/skeletons/post'
import { UserSkeleton } from '~/components/skeletons/user'
import { UserCard } from '~/components/users/card'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'
import { type CountColumn } from '~/types'

const Screen: FunctionComponent = () => {
  const insets = useSafeAreaInsets()

  const navigation = useNavigation()
  const params = useLocalSearchParams()

  const username = String(params.username)

  const { session } = useAuth()

  const tw = useTailwind()

  const user = useQuery({
    queryFn: async () => {
      const { data } = await supabase
        .from('users')
        .select('id, username, created_at')
        .eq('username', username)
        .single()

      if (data) {
        return {
          createdAt: parseJSON(data.created_at),
          id: data.id,
          username: data.username,
        }
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
          'id, content, meta, created_at, community:communities(id, slug, name), user:users(id, username), liked:likes(user_id), likes(count), comments(count)',
        )
        .eq('liked.user_id', session?.user.id)
        .order('created_at', {
          ascending: false,
        })
        .eq('user_id', user.data?.id)
        .range(from, to)
        .limit(limit + 1)

      const posts = (data ?? []).map(
        ({
          comments,
          community,
          content,
          created_at,
          id,
          liked,
          likes,
          meta,
          user,
        }) => ({
          comments: (comments as unknown as CountColumn)[0].count,
          community,
          content,
          createdAt: parseJSON(created_at),
          id,
          liked: liked.length > 0,
          likes: (likes as unknown as CountColumn)[0].count,
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
    queryKey: ['user_posts', user.data?.id, session?.user.id],
  })

  const data = (posts.data?.pages.map(({ posts }) => posts) ?? []).flat()

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={() =>
        posts.isLoading ? <PostSkeleton count={3} /> : <Empty />
      }
      ListFooterComponent={() =>
        posts.isFetchingNextPage ? <Spinner style={tw`my-4`} /> : null
      }
      ListHeaderComponent={() =>
        user.data ? (
          <UserCard
            linked={false}
            style={tw`border-gray-6 border-b-2`}
            user={user.data}
          />
        ) : (
          <UserSkeleton style={tw`border-gray-6 border-b-2`} />
        )
      }
      contentContainerStyle={tw`pb-[${insets.bottom}px]`}
      data={data}
      estimatedItemSize={108}
      onEndReached={() => {
        if (posts.hasNextPage) {
          posts.fetchNextPage()
        }
      }}
      refreshControl={<Refresher onRefresh={posts.refetch} />}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  )
}

export default Screen
