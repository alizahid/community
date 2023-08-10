import Lottie from 'lottie-react-native'
import { type FunctionComponent } from 'react'
import { View } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { useTranslations } from 'use-intl'

import lottie_empty from '~/assets/lottie/empty.json'
import { useTailwind } from '~/lib/tailwind'

import { Typography } from './typography'

export const Empty: FunctionComponent = () => {
  const frame = useSafeAreaFrame()

  const t = useTranslations('component.common.empty')

  const tw = useTailwind()

  const size = frame.width * 0.6

  return (
    <View style={tw`flex-col justify-center items-center py-4 flex-1`}>
      <Lottie
        autoPlay
        resizeMode="contain"
        source={lottie_empty}
        style={tw`h-[${size}px] w-[${size}px]`}
      />

      <Typography>{t('description')}</Typography>
    </View>
  )
}
