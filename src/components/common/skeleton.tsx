import { type FunctionComponent, type ReactNode, useEffect } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { useTailwind } from '~/lib/tailwind'

type Props = {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

export const Skeleton: FunctionComponent<Props> = ({ children, style }) => {
  const tw = useTailwind()

  const value = useSharedValue(0.5)

  useEffect(() => {
    value.value = withRepeat(
      withTiming(1, {
        duration: 500,
      }),
      -1,
      true,
    )
  }, [value])

  const opacity = useAnimatedStyle(() => ({
    opacity: value.value,
  }))

  return (
    <Animated.View style={[tw`bg-gray-7 rounded`, style, opacity]}>
      {children}
    </Animated.View>
  )
}
