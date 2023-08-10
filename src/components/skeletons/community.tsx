import { range } from 'lodash'
import { type FunctionComponent } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { useTailwind } from '~/lib/tailwind'

import { Skeleton } from '../common/skeleton'

type Props = {
  count?: number
  style?: StyleProp<ViewStyle>
}

export const CommunitySkeleton: FunctionComponent<Props> = ({
  count = 1,
  style,
}) => {
  const tw = useTailwind()

  return (
    <View style={style}>
      {range(count).map((index) => (
        <View key={index} style={tw`flex-row items-center gap-4 p-4`}>
          <Skeleton style={tw`h-12 w-12 rounded-full`} />

          <View style={tw`flex-1 gap-2`}>
            <Skeleton style={tw`h-6 w-16`} />

            <Skeleton style={tw`h-12`} />

            <Skeleton style={tw`h-10 w-24 rounded-lg`} />
          </View>
        </View>
      ))}
    </View>
  )
}
