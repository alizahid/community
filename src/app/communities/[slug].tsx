import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { type FunctionComponent, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { IconButton } from '~/components/common/icon-button'
import { Separator } from '~/components/common/separator'
import { CommunityCard } from '~/components/communities/card'
import { type Post, PostCard } from '~/components/posts/card'
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
          'id, content, meta, createdAt, community:communities(id, slug, name), user:users(id, username), likes(userId), comments(userId)',
        )
        .order('createdAt', {
          ascending: false,
        })
        .eq('communityId', community?.id)
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
    queryKey: ['community_posts', community?.id],
  })

  const data = (posts.data?.pages.map(({ posts }) => posts) ?? []).flat()

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={() =>
        community ? (
          <CommunityCard
            community={community}
            linked={false}
            membership
            style={tw`border-gray-6 border-b-2`}
          />
        ) : null
      }
      contentContainerStyle={tw`pb-[${insets.bottom}px]`}
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
