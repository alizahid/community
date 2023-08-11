import { useQuery } from '@tanstack/react-query'
import { parseJSON } from 'date-fns'
import { type FunctionComponent } from 'react'
import { View } from 'react-native'

import { Button } from '~/components/common/button'
import { Spinner } from '~/components/common/spinner'
import { UserCard } from '~/components/users/card'
import { useSignOut } from '~/hooks/auth/sign-out'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const { session } = useAuth()
  const { loading, signOut } = useSignOut()

  const { data } = useQuery({
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, image, created_at')
        .eq('id', session?.user.id)
        .single()

      if (error) {
        throw error
      }

      return {
        createdAt: parseJSON(data.created_at),
        id: data.id,
        image: data.image,
        username: data.username,
      }
    },
    queryKey: ['profile', session?.user.id],
  })

  const tw = useTailwind()

  return (
    <View style={tw`flex-1 gap-4`}>
      {data ? <UserCard user={data} /> : <Spinner />}

      <Button
        loading={loading}
        onPress={() => signOut()}
        style={tw`m-4 mt-auto border border-red-7`}
        styleLabel={tw`text-red-11`}
        variant="text"
      >
        Sign out
      </Button>
    </View>
  )
}

export default Screen
