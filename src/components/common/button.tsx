import { type FunctionComponent, type ReactNode } from 'react'
import {
  type GestureResponderEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'

import { useTailwind } from '~/lib/tailwind'

import { Pressable } from './pressable'
import { Spinner } from './spinner'
import { Typography } from './typography'

type Props = {
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  style?: StyleProp<ViewStyle>
  styleLabel?: StyleProp<TextStyle>
  variant?: 'primary' | 'text'

  onPress?: (event: GestureResponderEvent) => void
}

export const Button: FunctionComponent<Props> = ({
  children,
  disabled,
  loading,
  onPress,
  style,
  styleLabel,
  variant = 'primary',
}) => {
  const tw = useTailwind()

  return (
    <Pressable
      disabled={loading || disabled}
      onPress={onPress}
      style={[
        tw.style(
          'h-12 flex-row items-center justify-center gap-2 rounded-lg px-4',
          variant === 'primary' && 'bg-primary-9',
        ),
        style,
      ]}
    >
      <Typography
        color={variant === 'primary' ? 'gray-1' : 'gray-12'}
        style={styleLabel}
        weight="bold"
      >
        {children}
      </Typography>

      {loading && (
        <Spinner color={variant === 'primary' ? 'gray-1' : 'gray-12'} />
      )}
    </Pressable>
  )
}
