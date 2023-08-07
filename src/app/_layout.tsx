import { type Theme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen } from 'expo-router'
import { type FunctionComponent } from 'react'
import { KeyboardAvoidingView, Platform, useColorScheme } from 'react-native'

import { Root } from '~/components/navigation/root'
import { fonts } from '~/lib/fonts'
import { getColor, useTailwind } from '~/lib/tailwind'
import { AuthProvider } from '~/providers/auth'
import { IntlProvider } from '~/providers/intl'
import { QueryProvider } from '~/providers/query'

SplashScreen.preventAutoHideAsync()

const Layout: FunctionComponent = () => {
  const [loaded] = useFonts(fonts)

  const scheme = useColorScheme()

  const tw = useTailwind()

  const theme: Theme = {
    colors: {
      background: getColor(tw, 'gray-1'),
      border: getColor(tw, 'gray-6'),
      card: getColor(tw, 'gray-1'),
      notification: getColor(tw, 'primary-9'),
      primary: getColor(tw, 'primary-9'),
      text: getColor(tw, 'gray-12'),
    },
    dark: scheme === 'dark',
  }

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={theme}>
      <IntlProvider>
        <AuthProvider>
          <QueryProvider>
            <KeyboardAvoidingView
              behavior="padding"
              enabled={Platform.OS === 'ios'}
              style={tw`flex-1`}
            >
              <Root />
            </KeyboardAvoidingView>
          </QueryProvider>
        </AuthProvider>
      </IntlProvider>
    </ThemeProvider>
  )
}

export default Layout
