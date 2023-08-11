import { Stack } from 'expo-router'
import { type FunctionComponent } from 'react'
import { useTranslations } from 'use-intl'

import { useAuth } from '../../providers/auth'
import { StackHeader } from './header'

export const Root: FunctionComponent = () => {
  const t = useTranslations('screen')

  const { session } = useAuth()

  return (
    <Stack
      screenOptions={({ route }) => ({
        gestureEnabled: !(session
          ? route.name === 'home'
          : route.name === 'index'),
        header: (props) => <StackHeader {...props} />,
      })}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="communities/new"
        options={{
          title: t('communities.new.title'),
        }}
      />

      <Stack.Screen
        name="communities/[slug]"
        options={{
          title: t('communities.community.title'),
        }}
      />

      <Stack.Screen
        name="posts/new/[slug]"
        options={{
          title: t('posts.new.title'),
        }}
      />

      <Stack.Screen
        name="posts/[id]"
        options={{
          title: t('posts.post.title'),
        }}
      />

      <Stack.Screen
        name="profile/[username]"
        options={{
          title: t('users.profile.title'),
        }}
      />
    </Stack>
  )
}
