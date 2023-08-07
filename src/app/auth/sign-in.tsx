import { zodResolver } from '@hookform/resolvers/zod'
import { type FunctionComponent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Input } from '~/components/common/input'
import { Message } from '~/components/common/message'
import { type Form, schema, useSignIn } from '~/hooks/auth/sign-in'
import { useKeyboard } from '~/hooks/keyboard'
import { getSpace, useTailwind } from '~/lib/tailwind'

const Screen: FunctionComponent = () => {
  const insets = useSafeAreaInsets()

  const tw = useTailwind()
  const t = useTranslations('screen.auth.signIn')

  const { visible } = useKeyboard()

  const { error, loading, signIn } = useSignIn()

  const { control, handleSubmit, setFocus } = useForm<Form>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit(async (data) => {
    if (loading) {
      return
    }

    signIn(data)
  })

  return (
    <ScrollView
      contentContainerStyle={tw`flex-1 justify-end gap-4 p-4 pb-[${
        (visible ? 0 : insets.bottom) + getSpace(tw, 4)
      }px]`}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      {!!error && <Message variant="error">{error}</Message>}

      <Controller
        control={control}
        name="email"
        render={({
          field: { onBlur, onChange, ref, value },
          fieldState: { error },
        }) => (
          <Input
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            error={error?.message}
            keyboardType="email-address"
            label={t('form.email.label')}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={() => setFocus('password')}
            placeholder={t('form.email.label')}
            ref={ref}
            returnKeyType="next"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({
          field: { onBlur, onChange, ref, value },
          fieldState: { error },
        }) => (
          <Input
            error={error?.message}
            label={t('form.password.label')}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={onSubmit}
            placeholder={t('form.password.label')}
            ref={ref}
            returnKeyType="go"
            secureTextEntry
            value={value}
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
