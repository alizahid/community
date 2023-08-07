import { View } from 'react-native'

import { useTailwind } from '~/lib/tailwind'

export const Separator = () => {
  const tw = useTailwind()

  return <View style={tw`h-px bg-gray-6`} />
}
