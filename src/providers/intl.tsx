import { getCalendars } from 'expo-localization'
import { type FunctionComponent, type ReactNode } from 'react'
import { IntlProvider as Provider } from 'use-intl'

import en from '../intl/locales/en.json'

const calendar = getCalendars()[0]

type Props = {
  children: ReactNode
}

export const IntlProvider: FunctionComponent<Props> = ({ children }) => (
  <Provider
    locale="en"
    messages={en}
    now={new Date()}
    timeZone={calendar?.timeZone ?? undefined}
  >
    {children}
  </Provider>
)
