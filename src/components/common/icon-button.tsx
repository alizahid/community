import { type FunctionComponent } from 'react'
import {
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { useTailwind } from '~/lib/tailwind'
import { type TailwindColor } from '~/types/tailwind'

import { Icon, type IconName } from './icon'
import { Pressable } from './pressable'
import { Spinner } from './spinner'

type Props = {
  color?: TailwindColor
  disabled?: boolean
  loading?: boolean
  name: IconName
  style?: StyleProp<ViewStyle>
  styleIcon?: StyleProp<ViewStyle>

  onPress: (event: GestureResponderEvent) => void
}

export const IconButton: FunctionComponent<Props> = ({
  color = 'gray-12',
  disabled,
  loading,
  name,
  onPress,
  style,
  styleIcon,
}) => {
  const tw = useTailwind()

  return (
    <Pressable
      disabled={loading || disabled}
      onPress={onPress}
      style={[tw`h-12 w-12 items-center justify-center`, style]}
    >
      {loading ? (
        <Spinner color={color} style={styleIcon} />
      ) : (
        <Icon color={color} name={name} style={styleIcon} />
      )}
    </Pressable>
  )
}
