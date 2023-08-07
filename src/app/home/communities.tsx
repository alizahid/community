import { type FunctionComponent } from 'react'
import { View } from 'react-native'

import { Typography } from '~/components/common/typography'
import { useTailwind } from '~/lib/tailwind'

const Screen: FunctionComponent = () => {
  const tw = useTailwind()

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Typography>Hello</Typography>
    </View>
  )
}

export default Screen
