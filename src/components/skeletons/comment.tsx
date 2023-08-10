import { range } from 'lodash'
import { type FunctionComponent } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { useTailwind } from '~/lib/tailwind'

import { Skeleton } from '../common/skeleton'

type Props = {
  count?: number
  style?: StyleProp<ViewStyle>
}

export const CommentSkeleton: FunctionComponent<Props> = ({
  count = 6,
  style,
}) => {
  const tw = useTailwind()

  return (
    <View style={style}>
      {range(count).map((index) => (
        <View
          key={index}
          style={tw.style(
            'flex-row gap-4 p-4',
            index > 0 && 'border-t border-gray-6',
          )}
        >
          <Skeleton style={tw`h-6 w-6 rounded-full`} />

          <View style={tw`flex-1 gap-2`}>
            <Skeleton style={tw`h-12`} />

            <View style={tw`flex-row gap-4`}>
              <Skeleton style={tw`h-4 w-16`} />

              <Skeleton style={tw`h-4 w-20`} />
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}
