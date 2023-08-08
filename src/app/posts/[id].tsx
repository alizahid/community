import { useLocalSearchParams } from 'expo-router'
import { type FunctionComponent } from 'react'
import { View } from 'react-native'

import { Typography } from '~/components/common/typography'
import { useTailwind } from '~/lib/tailwind'

const Page: FunctionComponent = () => {
  const { id } = useLocalSearchParams()

  const tw = useTailwind()

  return (
    <View style={tw`flex-1 gap-8 items-center justify-center`}>
      <Typography>Post</Typography>

      <Typography>{id}</Typography>
    </View>
  )
}

export default Page
