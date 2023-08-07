import { type FunctionComponent } from 'react'
import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native'

import { getColor, useTailwind } from '~/lib/tailwind'
import { type TailwindColor } from '~/types/tailwind'

type Props = {
  color?: TailwindColor
  size?: 'small' | 'large'
  style?: StyleProp<ViewStyle>
}

export const Spinner: FunctionComponent<Props> = ({
  color = 'primary-10',
  size = 'small',
  style,
}) => {
  const tw = useTailwind()

  return (
    <ActivityIndicator color={getColor(tw, color)} size={size} style={style} />
  )
}
