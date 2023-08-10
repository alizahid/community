import { Image } from 'expo-image'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { getImageUrl } from '~/lib/supabase'
import { useTailwind } from '~/lib/tailwind'

import { IconButton } from './icon-button'
import {
  ImagePicker,
  type ImagePickerComponent,
  type ImagePickerProps,
} from './image-picker'
import { Pressable } from './pressable'

type Props = Omit<ImagePickerProps, 'children' | 'onUploading'> & {
  style?: StyleProp<ViewStyle>
}

export const ImageUploader = forwardRef<ImagePickerComponent, Props>(
  ({ onChange, prefix, style, value }, ref) => {
    const picker = useRef<ImagePickerComponent>(null)

    // @ts-expect-error
    useImperativeHandle(ref, () => picker)

    const [loading, setLoading] = useState(false)

    const tw = useTailwind()

    return (
      <View style={[tw`flex-row flex-wrap gap-2`, style]}>
        {value?.map(({ url }, index) => (
          <Pressable
            key={index}
            onPress={() => {
              const next = [...value]

              next.splice(index, 1)

              onChange(next)
            }}
          >
            <Image
              source={getImageUrl(url)}
              style={tw`h-20 w-20 rounded-lg bg-gray-3`}
            />
          </Pressable>
        ))}

        <ImagePicker
          onChange={onChange}
          onUploading={setLoading}
          prefix={prefix}
          ref={picker}
          value={value}
        >
          <IconButton
            loading={loading}
            name="image"
            onPress={() => picker.current?.open()}
            style={tw`h-20 w-20 rounded-lg bg-gray-3`}
          />
        </ImagePicker>
      </View>
    )
  },
)
