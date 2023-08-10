import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { type FunctionComponent } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTailwind } from '~/lib/tailwind'

import { IconButton } from '../common/icon-button'
import { Typography } from '../common/typography'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export const StackHeader: FunctionComponent<Props> = ({
  navigation,
  options,
  ...props
}) => {
  const insets = useSafeAreaInsets()

  const tw = useTailwind()

  return (
    <View style={tw`bg-gray-1 pt-[${insets.top}px] border-b border-gray-6`}>
      <View style={tw`h-12 items-center justify-center`}>
        {(options.headerLeft || 'back' in props) && (
          <View style={tw`absolute bottom-0 left-0 flex-row`}>
            {options.headerLeft?.({
              canGoBack: navigation.canGoBack(),
            }) ?? (
              <IconButton name="left" onPress={() => navigation.goBack()} />
            )}
          </View>
        )}

        {typeof options.headerTitle === 'function' ? (
          options.headerTitle({
            children: options.title ?? 'Screen',
          })
        ) : (
          <Typography weight="bold">{options.title}</Typography>
        )}

        {options.headerRight && (
          <View style={tw`absolute bottom-0 right-0 flex-row`}>
            {options.headerRight({
              canGoBack: navigation.canGoBack(),
            })}
          </View>
        )}
      </View>
    </View>
  )
}
