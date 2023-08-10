import { useRouter } from 'expo-router'
import { type FunctionComponent } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useFormatter } from 'use-intl'

import { useTailwind } from '~/lib/tailwind'
import { type Comment } from '~/types'

import { Avatar } from '../common/avatar'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Typography } from '../common/typography'

type Props = {
  comment: Comment
  style?: StyleProp<ViewStyle>
}

export const CommentCard: FunctionComponent<Props> = ({ comment, style }) => {
  const router = useRouter()

  const formatter = useFormatter()

  const tw = useTailwind()

  return (
    <View style={[tw`flex-row gap-4 p-4`, style]}>
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
  )
}
