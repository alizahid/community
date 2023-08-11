import { Tabs, useRouter } from 'expo-router'
import { type FunctionComponent } from 'react'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon-button'
import { StackHeader } from '~/components/navigation/header'
import { TabBar } from '~/components/navigation/tab-bar'

const Layout: FunctionComponent = () => {
  const router = useRouter()

  const t = useTranslations('screen.home')

  return (
    <Tabs
      screenOptions={{
        header: (props) => <StackHeader {...props} />,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon color={focused ? 'primary-9' : 'gray-9'} name="home" />
          ),
          title: t('index.title'),
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          headerRight: () => (
            <IconButton
              name="create"
              onPress={() => router.push('/communities/new')}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <Icon color={focused ? 'primary-9' : 'gray-9'} name="community" />
          ),
          title: t('communities.title'),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon color={focused ? 'primary-9' : 'gray-9'} name="user" />
          ),
          title: t('account.title'),
        }}
      />
    </Tabs>
  )
}

export default Layout
