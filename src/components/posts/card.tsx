import { useRouter } from 'expo-router'
import { type FunctionComponent } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useFormatter } from 'use-intl'

import { useLikePost } from '~/hooks/posts/like'
import { useTailwind } from '~/lib/tailwind'
import { type Json } from '~/types/supabase'

import { Avatar } from '../common/avatar'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Typography } from '../common/typography'

export type Post = {
  comments: number
  community: {
    id: number
    name: string
    slug: string
  } | null
  content: string
  createdAt: Date
  id: number
  liked: boolean
  likes: number
  meta: Json
  user: {
    id: string
    username: string
  } | null
}

type Props = {
  community?: boolean
  linked?: boolean
  post: Post
  style?: StyleProp<ViewStyle>
}

export const PostCard: FunctionComponent<Props> = ({
  community = true,
  linked = true,
  post,
  style,
}) => {
  const router = useRouter()

  const formatter = useFormatter()

  const tw = useTailwind()

  const { likePost, loading } = useLikePost(post)

  const Main = linked ? Pressable : View

  return (
    <View style={[tw`flex-row`, style]}>
      <Pressable
        onPress={() => likePost()}
        style={tw`items-center justify-center gap-2 w-12`}
      >
        {loading ? (
          <Spinner />
        ) : (
          <Icon color={post.liked ? 'primary-9' : 'gray-9'} name="like" />
        )}

        <Typography
          color="gray-11"
          size="sm"
          style={tw`tabular-nums`}
          weight="medium"
        >
          {formatter.number(post.likes, {
            notation: 'compact',
          })}
        </Typography>
      </Pressable>

      <Main
        onPress={() => router.push(`/posts/${post.id}`)}
        style={tw`flex-1 gap-2 py-4 pr-4`}
      >
        {community && (
          <Pressable
            onPress={() => router.push(`/communities/${post.community?.slug}`)}
            style={tw`flex-row items-center gap-2`}
          >
            <Avatar name={post.community?.slug!} style={tw`h-4 w-4`} />

            <Typography color="gray-11" size="xs" weight="medium">
              {post.community?.name}
            </Typography>
          </Pressable>
        )}

        <Typography>{post.content}</Typography>

        <View style={tw`flex-row items-center gap-4`}>
          <Pressable
            onPress={() => router.push(`/profile/${post.user?.username}`)}
          >
            <Typography color="gray-11" size="sm" weight="medium">
              {post.user?.username}
            </Typography>
          </Pressable>

          <View style={tw`flex-row items-center gap-2`}>
            <Icon color="gray-9" name="comment" style={tw`h-4 w-4`} />

            <Typography color="gray-11" size="sm" style={tw`tabular-nums`}>
              {formatter.number(post.comments, {
                notation: 'compact',
              })}
            </Typography>
          </View>

          <View style={tw`flex-row items-center gap-2`}>
            <Icon color="gray-9" name="clock" style={tw`h-4 w-4`} />

            <Typography color="gray-11" size="sm">
              {formatter.relativeTime(post.createdAt)}
            </Typography>
          </View>
        </View>
      </Main>
    </View>
  )
}
