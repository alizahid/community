import { useLocalSearchParams } from 'expo-router'
import { type FunctionComponent } from 'react'
import { View } from 'react-native'

import { Typography } from '~/components/common/typography'
import { useTailwind } from '~/lib/tailwind'

const Page: FunctionComponent = () => {
  const { slug } = useLocalSearchParams()

  const tw = useTailwind()

  return (
    <View style={tw`flex-1 gap-8 items-center justify-center`}>
      <Typography>Community</Typography>

      <Typography>{slug}</Typography>
    </View>
  )
}

export default Page
