import { zodResolver } from '@hookform/resolvers/zod'
import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslations } from 'use-intl'

import { type Form, schema, useCreateComment } from '~/hooks/comments/create'
import { useKeyboard } from '~/hooks/keyboard'
import { getSpace, useTailwind } from '~/lib/tailwind'

import { IconButton } from '../common/icon-button'
import { Input } from '../common/input'
import { type Post } from '../posts/card'

export type CommentFormComponent = {
  focus: () => void
}

type Props = {
  post: Post
  style?: StyleProp<ViewStyle>
}

export const CommentForm = forwardRef<CommentFormComponent, Props>(
  ({ post, style }, ref) => {
    const insets = useSafeAreaInsets()

    const t = useTranslations('component.comments.form')

    const tw = useTailwind()

    useImperativeHandle(ref, () => ({
      focus: () => setFocus('content'),
    }))

    const keyboard = useKeyboard()

    const { createComment, loading } = useCreateComment(post)

    const { control, formState, handleSubmit, reset, setFocus } = useForm<Form>(
      {
        defaultValues: {
          content: '',
        },
        resolver: zodResolver(schema),
      },
    )

    const onSubmit = handleSubmit(async (data) => {
      keyboard.dismiss()

      await createComment(data)

      reset()
    })

    const padding = keyboard.visible ? 0 : insets.bottom
    const height = padding + getSpace(tw, 12)

    return (
      <View style={[tw`flex-row border-t border-gray-7`, style]}>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <Input
              {...field}
              onSubmitEditing={onSubmit}
              placeholder={t('content.placeholder')}
              returnKeyType="go"
              style={tw`flex-1`}
              styleInput={tw`border-0 bg-transparent h-[${height}px] pb-[${padding}px]`}
            />
          )}
          rules={{
            required: true,
          }}
        />

        <IconButton
          color={formState.isValid ? 'primary-9' : 'gray-9'}
          disabled={!formState.isValid}
          loading={loading}
          name="send"
          onPress={onSubmit}
          style={tw`h-[${height}px] pb-[${padding}px]`}
        />
      </View>
    )
  },
)
