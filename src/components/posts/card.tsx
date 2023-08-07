import { type FunctionComponent } from 'react'
import { View } from 'react-native'
import { useFormatter } from 'use-intl'

import { useTailwind } from '~/lib/tailwind'
import { type Json } from '~/types/supabase'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Typography } from '../common/typography'

export type Post = {
  comments: number
  community: {
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
    username: string
  } | null
}

type Props = {
  post: Post
}

export const PostCard: FunctionComponent<Props> = ({ post }) => {
  const formatter = useFormatter()

  const tw = useTailwind()

  return (
    <View style={tw`flex-row`}>
      <Pressable
        onPress={() => {
          // TODO: like post
        }}
        style={tw`items-center justify-center gap-2 w-12`}
      >
        <Icon color={post.liked ? 'primary-9' : 'gray-9'} name="like" />

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

      <Pressable
        onPress={() => {
          // TODO: navigate to post
        }}
        style={tw`flex-1 gap-2 py-4 pr-4`}
      >
        <Pressable
          onPress={() => {
            // TODO: navigate to community
          }}
        >
          <Typography color="gray-11" size="xs" weight="medium">
            {post.community?.name}
          </Typography>
        </Pressable>

        <Typography>{post.content}</Typography>

        <View style={tw`flex-row items-center gap-4`}>
          <Pressable
            onPress={() => {
              // TODO: navigate to profile
            }}
          >
            <Typography color="gray-11" size="sm" weight="medium">
              {post.user?.username}
            </Typography>
          </Pressable>

          <View style={tw`flex-row items-center gap-2`}>
            <Icon color="gray-9" name="comment" style={tw`h-3.5 w-3.5`} />

            <Typography color="gray-11" size="sm" style={tw`tabular-nums`}>
              {formatter.number(post.comments, {
                notation: 'compact',
              })}
            </Typography>
          </View>

          <View style={tw`flex-row items-center gap-2`}>
            <Icon color="gray-9" name="clock" style={tw`h-3.5 w-3.5`} />

            <Typography color="gray-11" size="sm">
              {formatter.relativeTime(post.createdAt)}
            </Typography>
          </View>
        </View>
      </Pressable>
    </View>
  )
}
