import { useRouter } from 'expo-router'
import { type FunctionComponent } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useTranslations } from 'use-intl'

import { useTailwind } from '~/lib/tailwind'
import { type User } from '~/types'

import { Avatar } from '../common/avatar'
import { Pressable } from '../common/pressable'
import { Typography } from '../common/typography'

type Props = {
  linked?: boolean
  style?: StyleProp<ViewStyle>
  user: User
}

export const UserCard: FunctionComponent<Props> = ({
  linked = true,
  style,
  user,
}) => {
  const router = useRouter()

  const t = useTranslations('component.users.card')

  const tw = useTailwind()

  const Main = linked ? Pressable : View

  return (
    <Main
      onPress={() => router.push(`/profile/${user.username}`)}
      style={[tw`flex-row items-center gap-4 p-4`, style]}
    >
      <Avatar name={user.username} variant="user" />

      <View style={tw`flex-1 gap-2`}>
        <Typography weight="medium">{user.username}</Typography>

        <Typography color="gray-11" size="sm">
          {t('joined', {
            date: user.createdAt,
          })}
        </Typography>
      </View>
    </Main>
  )
}
