import { useRouter } from 'expo-router'
import { type FunctionComponent } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useTranslations } from 'use-intl'

import { useJoinCommunity } from '~/hooks/communities/join'
import { useTailwind } from '~/lib/tailwind'
import { type Community } from '~/types'

import { Avatar } from '../common/avatar'
import { Button } from '../common/button'
import { Pressable } from '../common/pressable'
import { Typography } from '../common/typography'

type Props = {
  community: Community
  linked?: boolean
  membership?: boolean
  style?: StyleProp<ViewStyle>
}

export const CommunityCard: FunctionComponent<Props> = ({
  community,
  linked = true,
  membership = false,
  style,
}) => {
  const router = useRouter()

  const t = useTranslations('component.communities.card')

  const tw = useTailwind()

  const { joinCommunity, loading } = useJoinCommunity(community)

  const Main = linked ? Pressable : View

  return (
    <Main
      onPress={() => router.push(`/communities/${community.slug}`)}
      style={[tw`flex-row items-center gap-4 p-4`, style]}
    >
      <Avatar name={community.slug} />

      <View style={tw`flex-1 gap-2 items-start`}>
        <Typography weight="medium">{community.name}</Typography>

        <Typography color="gray-11" size="sm">
          {community.description}
        </Typography>

        {membership && !community.admin && (
          <Button
            loading={loading}
            onPress={() => joinCommunity()}
            style={tw`h-auto py-2 mt-2`}
            variant="accent"
          >
            {t(community.member ? 'leave' : 'join')}
          </Button>
        )}
      </View>
    </Main>
  )
}
