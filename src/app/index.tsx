import { Redirect, SplashScreen, useRouter } from 'expo-router'
import { type FunctionComponent, useEffect } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Logo } from '~/components/common/logo'
import { Typography } from '~/components/common/typography'
import { getSpace, useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const insets = useSafeAreaInsets()

  const router = useRouter()

  const tw = useTailwind()
  const t = useTranslations('screen.landing')

  const { session } = useAuth()

  useEffect(() => {
    if (session !== undefined) {
      SplashScreen.hideAsync()
    }
  }, [session])

  if (session === undefined) {
    return null
  }

  if (session) {
    return <Redirect href="/home/" />
  }

  const padding = insets.bottom + getSpace(tw, 4)

  return (
    <View style={tw`flex-1 pb-[${padding}px]`}>
      <View style={tw`flex-1 gap-4 items-center justify-center`}>
        <Logo />

        <Typography size="2xl" weight="bold">
          {t('title')}
        </Typography>
      </View>

      <View style={tw`flex-row mx-4 gap-4`}>
        <Button
          onPress={() => router.push('/auth/sign-in')}
          style={tw`flex-1`}
          variant="text"
        >
          {t('auth.signIn')}
        </Button>

        <Button onPress={() => router.push('/auth/sign-up')} style={tw`flex-1`}>
          {t('auth.signUp')}
        </Button>
      </View>
    </View>
  )
}

export default Screen
