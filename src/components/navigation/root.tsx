import { Stack } from 'expo-router'
import { type FunctionComponent } from 'react'

import { useAuth } from '../../providers/auth'

export const Root: FunctionComponent = () => {
  const { session } = useAuth()

  return (
    <Stack
      screenOptions={({ route }) => ({
        gestureEnabled: !(session
          ? route.name === 'home'
          : route.name === 'index'),
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
    </Stack>
  )
}
