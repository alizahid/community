import { type FunctionComponent } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { Path, Svg } from 'react-native-svg'

import { useTailwind } from '~/lib/tailwind'

type Props = {
  style?: StyleProp<ViewStyle>
}

export const Logo: FunctionComponent<Props> = ({ style }) => {
  const tw = useTailwind()

  return (
    <Svg
      fill="currentColor"
      style={[tw`h-24 w-24 text-primary-9`, style]}
      viewBox="0 0 30 30"
    >
      <Path d="M15,3C7.771,3,3,8.07,3,14c0,6.62,4.116,10,8.5,10c2.15,0,3.731-0.756,4.633-1.339C17.3,21.793,19,19.951,19,16.58 c0-2.92-2.383-5.58-5-5.58c-2.851,0-5,1.827-5,4.25C9,17.056,10.182,18,11.349,18c1.3,0,1.688-1.269,1.692-1.282 c0.155-0.53,0.711-0.835,1.241-0.678c0.53,0.156,0.833,0.711,0.678,1.241C14.684,18.222,13.573,20,11.349,20 C9.241,20,7,18.335,7,15.25C7,11.687,10.009,9,14,9c3.729,0,7,3.542,7,7.58c0,3.207-1.254,5.327-2.518,6.656l2.629,2.191 c1.064,0.887,2.66,0.589,3.35-0.612C25.604,22.824,27,19.647,27,16C27,9.827,21.94,3,15,3z" />
    </Svg>
  )
}
