import { zodResolver } from '@hookform/resolvers/zod'
import { type FunctionComponent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Input } from '~/components/common/input'
import { Message } from '~/components/common/message'
import {
  type Form,
  schema,
  useCreateCommunity,
} from '~/hooks/communities/create'
import { useKeyboard } from '~/hooks/keyboard'
import { getSpace, useTailwind } from '~/lib/tailwind'

const Screen: FunctionComponent = () => {
  const insets = useSafeAreaInsets()

  const tw = useTailwind()

  const t = useTranslations('screen.communities.new')

  const keyboard = useKeyboard()

  const { createCommunity, error, loading } = useCreateCommunity()

  const { control, handleSubmit, setFocus } = useForm<Form>({
    defaultValues: {
      description: '',
      name: '',
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit((data) => {
    keyboard.dismiss()

    if (loading) {
      return
    }

    createCommunity(data)
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
        name="name"
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            error={error?.message}
            label={t('form.name.label')}
            onSubmitEditing={() => setFocus('description')}
            placeholder={t('form.name.placeholder')}
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            error={error?.message}
            label={t('form.description.label')}
            multiline
            placeholder={t('form.description.placeholder')}
            styleInput={tw`h-32`}
          />
        )}
      />

      <Button loading={loading} onPress={onSubmit} style={tw`mt-auto`}>
        {t('form.submit')}
      </Button>
    </ScrollView>
  )
}

export default Screen
