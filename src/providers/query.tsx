import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type FunctionComponent, type ReactNode } from 'react'

export const queryClient = new QueryClient()

type Props = {
  children: ReactNode
}

export const QueryProvider: FunctionComponent<Props> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
