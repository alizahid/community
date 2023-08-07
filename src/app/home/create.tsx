import { type FunctionComponent, useCallback, useState } from 'react'
import { View } from 'react-native'

import { Button } from '~/components/common/button'
import { Input } from '~/components/common/input'
import { supabase } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const tw = useTailwind()

  const { session } = useAuth()

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const post = useCallback(async () => {
    if (!session) {
      return
    }

    setLoading(true)

    await supabase.from('posts').insert({
      communityId: 1,
      content,
      userId: session.user.id,
    })

    setLoading(false)
  }, [content, session])

  return (
    <View style={tw`gap-4 p-4 flex-1`}>
      <Input
        multiline
        onChangeText={setContent}
        placeholder="Say something nice"
        style={tw`flex-1`}
        styleInput={tw`flex-1`}
        value={content}
      />

      <Button loading={loading} onPress={post}>
        Post
      </Button>
    </View>
  )
}

export default Screen
