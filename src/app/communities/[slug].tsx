import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { type FunctionComponent, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Empty } from '~/components/common/empty'
import { IconButton } from '~/components/common/icon-button'
import { Refresher } from '~/components/common/refresh'
import { Separator } from '~/components/common/separator'
import { Spinner } from '~/components/common/spinner'
import { CommunityCard } from '~/components/communities/card'
import { type Post, PostCard } from '~/components/posts/card'
import { CommunitySkeleton } from '~/components/skeletons/community'
import { PostSkeleton } from '~/components/skeletons/post'
import { useCommunity } from '~/hooks/communities/get'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const insets = useSafeAreaInsets()

  const router = useRouter()
  const navigation = useNavigation()
  const params = useLocalSearchParams()

  const slug = String(params.slug)

  const { session } = useAuth()

  const tw = useTailwind()

  const { community } = useCommunity(slug)

  useEffect(() => {
    if (!community) {
      return
    }

    navigation.setOptions({
      headerRight: () =>
        community.member ? (
          <IconButton
            name="create"
            onPress={() => router.push(`/create/${community?.slug}`)}
          />
        ) : null,
      title: community.name,
    })
  }, [community, navigation, router])

  const posts = useInfiniteQuery<{
    cursor?: number
    posts: Array<Post>
  }>({
    enabled: !!community,
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
        .eq('community_id', community?.id)
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
    queryKey: ['community_posts', community?.id],
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
      ListHeaderComponent={() =>
        community ? (
          <CommunityCard
            community={community}
            linked={false}
            membership
            style={tw`border-gray-6 border-b-2`}
          />
        ) : (
          <CommunitySkeleton style={tw`border-gray-6 border-b-2`} />
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
      renderItem={({ item }) => <PostCard community={false} post={item} />}
    />
  )
}

export default Screen
