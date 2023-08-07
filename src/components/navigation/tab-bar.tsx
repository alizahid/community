import { type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { type FunctionComponent } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFormatter } from 'use-intl'

import { useKeyboard } from '~/hooks/keyboard'
import { getSpace, useTailwind } from '~/lib/tailwind'

import { Pressable } from '../common/pressable'
import { Typography } from '../common/typography'

type Props = BottomTabBarProps

export const TabBar: FunctionComponent<Props> = ({
  descriptors,
  navigation,
  state,
}) => {
  const { bottom } = useSafeAreaInsets()

  const formatter = useFormatter()

  const tw = useTailwind()

  const keyboard = useKeyboard()

  if (keyboard.visible) {
    return null
  }

  return (
    <View style={tw`flex-row border-t border-gray-6 bg-gray-1`}>
      {state.routes.map((route, index) => {
        const data = descriptors[route.key]

        const focused = index === state.index

        const onPress = () => {
          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: 'tabPress',
          })

          if (!focused && !event.defaultPrevented) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            navigation.navigate({
              merge: true,
              name: route.name,
            })
          }
        }

        const onLongPress = () => {
          navigation.emit({
            target: route.key,
            type: 'tabLongPress',
          })
        }

        return (
          <Pressable
            key={route.key}
            onLongPress={onLongPress}
            onPress={onPress}
            style={tw`flex-1 items-center justify-center pb-[${bottom}px] h-[${
              getSpace(tw, 12) + bottom
            }px]`}
          >
            <View>
              {data.options?.tabBarIcon?.({
                color: focused ? 'primary-9' : 'gray-9',
                focused,
                size: 0,
              })}

              {!!data.options.tabBarBadge && (
                <View
                  style={tw`absolute -top-1 -right-2 h-4 w-4 items-center justify-center rounded-full bg-primary-9`}
                >
                  <Typography align="center" color="gray-1" size="xs">
                    {formatter.number(Number(data.options.tabBarBadge), {
                      notation: 'compact',
                    })}
                  </Typography>
                </View>
              )}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}
