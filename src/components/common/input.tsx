import { forwardRef, useState } from 'react'
import {
  type StyleProp,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'

import { getColor, useTailwind } from '~/lib/tailwind'

import { Typography } from './typography'

type Props = Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'autoFocus'
  | 'editable'
  | 'keyboardType'
  | 'multiline'
  | 'onBlur'
  | 'onChangeText'
  | 'onFocus'
  | 'onSubmitEditing'
  | 'placeholder'
  | 'returnKeyType'
  | 'secureTextEntry'
  | 'value'
> & {
  error?: string
  hint?: string
  label?: string
  style?: StyleProp<ViewStyle>
  styleInput?: StyleProp<TextStyle>
}

export const Input = forwardRef<TextInput, Props>(
  (
    {
      autoCapitalize,
      autoComplete,
      autoCorrect,
      autoFocus,
      editable = true,
      error,
      hint,
      keyboardType,
      label,
      multiline,
      onBlur,
      onChangeText,
      onFocus,
      onSubmitEditing,
      placeholder,
      returnKeyType,
      secureTextEntry,
      style,
      styleInput,
      value,
    },
    ref,
  ) => {
    const tw = useTailwind()

    const [focused, setFocused] = useState(false)

    return (
      <View style={[tw`gap-1`, style]}>
        {!!label && (
          <Typography color="gray-11" size="sm" weight="medium">
            {label}
          </Typography>
        )}

        <TextInput
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          editable={editable}
          keyboardType={keyboardType}
          multiline={multiline}
          onBlur={(event) => {
            setFocused(false)

            onBlur?.(event)
          }}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true)

            onFocus?.(event)
          }}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={getColor(tw, 'gray-9')}
          ref={ref}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          style={[
            tw.style(
              'font-body-regular rounded-lg border border-gray-7 bg-gray-2 px-3 text-base leading-tight',
              multiline ? 'h-24 py-3' : 'h-12 pb-0 pt-0.5',
              error && 'border-red-7',
              focused && (error ? 'border-red-8' : 'border-primary-8'),
            ),
            styleInput,
          ]}
          textAlignVertical={multiline ? 'top' : 'center'}
          value={value}
        />

        {!!hint && (
          <Typography color="gray-11" size="sm">
            {hint}
          </Typography>
        )}

        {!!error && (
          <Typography color="red-11" size="sm">
            {error}
          </Typography>
        )}
      </View>
    )
  },
)
