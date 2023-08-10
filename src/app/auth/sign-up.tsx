import { zodResolver } from '@hookform/resolvers/zod'
import { type FunctionComponent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Input } from '~/components/common/input'
import { Message } from '~/components/common/message'
import { type Form, schema, useSignUp } from '~/hooks/auth/sign-up'
import { useKeyboard } from '~/hooks/keyboard'
import { getSpace, useTailwind } from '~/lib/tailwind'

const Screen: FunctionComponent = () => {
  const insets = useSafeAreaInsets()

  const tw = useTailwind()
  const t = useTranslations('screen.auth.signUp')

  const keyboard = useKeyboard()

  const { error, loading, signUp } = useSignUp()

  const { control, handleSubmit, setFocus } = useForm<Form>({
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit((data) => {
    keyboard.dismiss()

    if (loading) {
      return
    }

    signUp(data)
  })

  const padding = (keyboard.visible ? 0 : insets.bottom) + getSpace(tw, 4)

  return (
    <ScrollView
      contentContainerStyle={tw`flex-1 justify-end gap-4 p-4 pb-[${padding}px]`}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      {!!error && <Message variant="error">{error}</Message>}

      <Controller
        control={control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            error={error?.message}
            keyboardType="email-address"
            label={t('form.email.label')}
            onSubmitEditing={() => setFocus('username')}
            placeholder={t('form.email.placeholder')}
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="username"
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            autoCapitalize="none"
            autoCorrect={false}
            error={error?.message}
            label={t('form.username.label')}
            onSubmitEditing={() => setFocus('password')}
            placeholder={t('form.username.placeholder')}
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            error={error?.message}
            label={t('form.password.label')}
            onSubmitEditing={onSubmit}
            placeholder={t('form.password.placeholder')}
            returnKeyType="go"
            secureTextEntry
          />
        )}
      />

      <Button loading={loading} onPress={onSubmit}>
        {t('form.submit')}
      </Button>
    </ScrollView>
  )
}

export default Screen
