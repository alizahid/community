import { Tabs } from 'expo-router'
import { type FunctionComponent } from 'react'

import { Icon } from '~/components/common/icon'
import { StackHeader } from '~/components/navigation/header'
import { TabBar } from '~/components/navigation/tab-bar'

const Layout: FunctionComponent = () => {
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
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon color={focused ? 'primary-9' : 'gray-9'} name="community" />
          ),
          title: 'Communities',
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon color={focused ? 'primary-9' : 'gray-9'} name="create" />
          ),
          title: 'New post',
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon color={focused ? 'primary-9' : 'gray-9'} name="user" />
          ),
          title: 'Account',
        }}
      />
    </Tabs>
  )
}

export default Layout
