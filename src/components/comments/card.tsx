import { useRouter } from 'expo-router'
import { type FunctionComponent, useRef } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { useFormatter } from 'use-intl'

import { useDeleteComment } from '~/hooks/comments/delete'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'
import { type Comment } from '~/types'

import { Avatar } from '../common/avatar'
import { Icon } from '../common/icon'
import { IconButton } from '../common/icon-button'
import { Pressable } from '../common/pressable'
import { Typography } from '../common/typography'

type Props = {
  comment: Comment
  postId: number
  style?: StyleProp<ViewStyle>
}

export const CommentCard: FunctionComponent<Props> = ({
  comment,
  postId,
  style,
}) => {
  const router = useRouter()

  const formatter = useFormatter()

  const swipeable = useRef<Swipeable>(null)

  const { session } = useAuth()

  const tw = useTailwind()

  const { deleteComment, loading } = useDeleteComment(postId, comment)

  return (
    <Swipeable
      ref={swipeable}
      renderRightActions={() => {
        if (session?.user.id !== comment.user?.id) {
          return
        }

        return (
          <IconButton
            color="white"
            loading={loading}
            name="delete"
            onPress={async () => {
              await deleteComment()

              swipeable.current?.close()
            }}
            style={tw`bg-red-9 h-auto`}
          />
        )
      }}
    >
      <View style={[tw`flex-row gap-4 p-4 bg-gray-1`, style]}>
        <Avatar
          name={comment.user?.username!}
          style={tw`h-6 w-6`}
          variant="user"
        />

        <View style={tw`flex-1 gap-2`}>
          <Typography size="sm">{comment.content}</Typography>

          <View style={tw`flex-row items-center gap-4`}>
            <Pressable
              onPress={() => router.push(`/profile/${comment.user?.username}`)}
            >
              <Typography color="gray-11" size="xs" weight="medium">
                {comment.user?.username}
              </Typography>
            </Pressable>

            <View style={tw`flex-row items-center gap-2`}>
              <Icon color="gray-9" name="clock" style={tw`h-3 w-3`} />

              <Typography color="gray-11" size="xs">
                {formatter.relativeTime(comment.createdAt)}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  )
}
