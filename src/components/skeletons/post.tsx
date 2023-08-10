import { range } from 'lodash'
import { type FunctionComponent } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { useTailwind } from '~/lib/tailwind'

import { Skeleton } from '../common/skeleton'

type Props = {
  community?: boolean
  count?: number
  style?: StyleProp<ViewStyle>
}

export const PostSkeleton: FunctionComponent<Props> = ({
  community = true,
  count = 6,
  style,
}) => {
  const tw = useTailwind()

  return (
    <View style={style}>
      {range(count).map((index) => (
        <View
          key={index}
          style={tw.style('flex-row', index > 0 && 'border-t border-gray-6')}
        >
          <View style={tw`items-center justify-center w-12`}>
            <Skeleton style={tw`h-6 w-6`} />
          </View>

          <View style={tw`flex-1 gap-4 py-4 pr-4`}>
            {community && (
              <View style={tw`flex-row items-center gap-2`}>
                <Skeleton style={tw`h-4 w-20`} />
              </View>
            )}

            <Skeleton style={tw`h-12`} />

            <View style={tw`flex-row items-center gap-4`}>
              <Skeleton style={tw`h-5 w-16`} />

              <Skeleton style={tw`h-5 w-20`} />
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}
