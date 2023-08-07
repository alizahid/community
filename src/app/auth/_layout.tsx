import { Stack } from 'expo-router'
import { type FunctionComponent } from 'react'
import { useTranslations } from 'use-intl'

import { StackHeader } from '~/components/navigation/header'

const Layout: FunctionComponent = () => {
  const t = useTranslations('screen.auth')

  return (
    <Stack
      screenOptions={{
        header: (props) => <StackHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: t('signIn.title'),
        }}
      />

      <Stack.Screen
        name="sign-up"
        options={{
          title: t('signUp.title'),
        }}
      />
    </Stack>
  )
}

export default Layout
