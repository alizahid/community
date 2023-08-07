import { type FunctionComponent, type ReactNode } from 'react'
import { type StyleProp, Text, type TextStyle } from 'react-native'

import { useTailwind } from '~/lib/tailwind'
import { type TailwindColor, type TailwindFontSize } from '~/types/tailwind'

type Props = {
  align?: 'left' | 'center' | 'right'
  children: ReactNode
  color?: TailwindColor
  lines?: number
  size?: TailwindFontSize
  style?: StyleProp<TextStyle>
  weight?: 'regular' | 'medium' | 'bold'
}

export const Typography: FunctionComponent<Props> = ({
  align = 'left',
  children,
  color = 'gray-12',
  lines,
  size = 'base',
  style,
  weight = 'regular',
}) => {
  const tw = useTailwind()

  return (
    <Text
      numberOfLines={lines}
      style={[
        tw`font-body-${weight} text-${size} text-${color} text-${align}`,
        style,
      ]}
    >
      {children}
    </Text>
  )
}
