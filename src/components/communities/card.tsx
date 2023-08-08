import { useRouter } from 'expo-router'
import { type FunctionComponent } from 'react'
import { View } from 'react-native'

import { useTailwind } from '~/lib/tailwind'

import { Avatar } from '../common/avatar'
import { Pressable } from '../common/pressable'
import { Typography } from '../common/typography'

export type Community = {
  description: string
  id: number
  name: string
  slug: string
}

type Props = {
  community: Community
  linked?: boolean
}

export const CommunityCard: FunctionComponent<Props> = ({
  community,
  linked = true,
}) => {
  const router = useRouter()

  const tw = useTailwind()

  const Main = linked ? Pressable : View

  return (
    <Main
      onPress={() => router.push('/')}
      style={tw`flex-row items-center gap-4 p-4`}
    >
      <Avatar name={community.slug} />

      <View style={tw`flex-1`}>
        <Typography weight="medium">{community.name}</Typography>

        <Typography color="gray-11" size="sm">
          {community.description}
        </Typography>
      </View>
    </Main>
  )
}
