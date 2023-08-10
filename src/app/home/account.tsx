import { useQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { type FunctionComponent } from 'react'
import { View } from 'react-native'
import { useFormatter } from 'use-intl'

import { Button } from '~/components/common/button'
import { Spinner } from '~/components/common/spinner'
import { Typography } from '~/components/common/typography'
import { useSignOut } from '~/hooks/auth/sign-out'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const formatter = useFormatter()

  const { session } = useAuth()
  const { loading, signOut } = useSignOut()

  const { data } = useQuery({
    queryFn: async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session?.user.id)
        .single()

      return data
    },
    queryKey: ['profile', session?.user.id],
  })

  const tw = useTailwind()

  return (
    <View style={tw`flex-1 gap-8 items-center justify-center`}>
      {data ? (
        <View style={tw`gap-2 items-center`}>
          <Typography>{data.username}</Typography>

          <Typography>
            {formatter.relativeTime(parseJSON(data.created_at))}
          </Typography>
        </View>
      ) : (
        <Spinner />
      )}

      <Button loading={loading} onPress={() => signOut()}>
        Sign out
      </Button>
    </View>
  )
}

export default Screen
