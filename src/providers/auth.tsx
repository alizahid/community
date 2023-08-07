import { type Session } from '@supabase/supabase-js'
import {
  createContext,
  type FunctionComponent,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { supabase } from '~/lib/supabase'

type Context = {
  session?: Session | null
}

const AuthContext = createContext<Context>({})

type Props = {
  children: ReactNode
}

export const AuthProvider: FunctionComponent<Props> = ({ children }) => {
  const [session, setSession] = useState<Context['session']>()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
