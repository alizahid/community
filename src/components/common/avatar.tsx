import { type FunctionComponent } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import Boring from 'react-native-boring-avatars'

import { useTailwind } from '~/lib/tailwind'

type Props = {
  name: string
  style?: StyleProp<ViewStyle>
  variant?: 'community' | 'user'
}

export const Avatar: FunctionComponent<Props> = ({
  name,
  style,
  variant = 'community',
}) => {
  const tw = useTailwind()

  return (
    <View style={[tw`h-12 w-12`, style]}>
      <Boring
        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
        name={name}
        size="100%"
        variant={variant === 'community' ? 'pixel' : 'beam'}
      />
    </View>
  )
}
