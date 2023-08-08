import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { type FunctionComponent, useEffect } from 'react'

import { Separator } from '~/components/common/separator'
import { CommunityCard } from '~/components/communities/card'
import { type Post, PostCard } from '~/components/posts/card'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const navigation = useNavigation()
  const params = useLocalSearchParams()

  const slug = String(params.slug)

  const { session } = useAuth()

  const tw = useTailwind()

  const community = useQuery({
    queryFn: async () => {
      const { data } = await supabase
        .from('communities')
        .select('id, slug, name, description')
        .eq('slug', slug)
        .single()

      return data
    },
    queryKey: ['community', slug],
  })

  useEffect(() => {
    if (!community.data) {
      return
    }

    navigation.setOptions({
      title: community.data.name,
    })
  }, [community.data, navigation])

  const posts = useInfiniteQuery<{
    cursor?: number
    posts: Array<Post>
  }>({
    enabled: !!community.data,
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
        .eq('communityId', community.data?.id)
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
    queryKey: ['community_posts', community.data?.id],
  })

  const data = (posts.data?.pages.map(({ posts }) => posts) ?? []).flat()

  return (
    <FlashList
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={() =>
        community.data ? (
          <CommunityCard
            community={community.data}
            linked={false}
            style={tw`border-gray-6 border-b-2`}
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
