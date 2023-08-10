import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import { type FunctionComponent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { ImageUploader } from '~/components/common/image-uploader'
import { Input } from '~/components/common/input'
import { Message } from '~/components/common/message'
import { useCommunity } from '~/hooks/communities/get'
import { useKeyboard } from '~/hooks/keyboard'
import { type Form, schema, useCreatePost } from '~/hooks/posts/create'
import { getSpace, useTailwind } from '~/lib/tailwind'
import { useAuth } from '~/providers/auth'

const Screen: FunctionComponent = () => {
  const insets = useSafeAreaInsets()

  const params = useLocalSearchParams()

  const slug = String(params.slug)

  const { session } = useAuth()

  const tw = useTailwind()

  const t = useTranslations('screen.posts.new')

  const keyboard = useKeyboard()

  const { community } = useCommunity(slug)
  const { createPost, error, loading } = useCreatePost()

  const { control, handleSubmit } = useForm<Form>({
    defaultValues: {
      communityId: community?.id,
      content: '',
      meta: {
        images: [],
      },
      userId: session?.user.id,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit((data) => {
    keyboard.dismiss()

    if (loading) {
      return
    }

    createPost(data)
  })

  const padding = (keyboard.visible ? 0 : insets.bottom) + getSpace(tw, 4)

  return (
    <ScrollView
      contentContainerStyle={tw`flex-1 gap-4 p-4 pb-[${padding}px]`}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      {!!error && <Message variant="error">{error}</Message>}

      <Controller
        control={control}
        name="content"
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            error={error?.message}
            multiline
            placeholder={t('form.content.placeholder')}
            returnKeyType="next"
            style={tw`flex-1`}
            styleInput={tw`flex-1`}
          />
        )}
      />

      <Controller
        control={control}
        name="meta.images"
        render={({ field }) => <ImageUploader {...field} prefix="posts" />}
      />

      <Button loading={loading} onPress={onSubmit}>
        {t('form.submit')}
      </Button>
    </ScrollView>
  )
}

export default Screen
