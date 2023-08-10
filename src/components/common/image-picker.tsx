import { createId } from '@paralleldrive/cuid2'
import * as ExpoImagePicker from 'expo-image-picker'
import mime from 'mime'
import {
  forwardRef,
  type ReactElement,
  useCallback,
  useImperativeHandle,
} from 'react'

import { type PostMeta } from '~/hooks/posts/create'
import { BUCKET_ASSETS, supabase } from '~/lib/supabase'

export type ImageProps = PostMeta['images'][number]

export type ImagePickerComponent = {
  focus: () => void
  open: () => void
}

export type ImagePickerProps = {
  children: ReactElement
  prefix?: 'avatars' | 'posts'
  value?: Array<ImageProps>

  onChange: (value: Array<ImageProps>) => void
  onUploading?: (done: boolean) => void
}

export const ImagePicker = forwardRef<ImagePickerComponent, ImagePickerProps>(
  ({ children, onChange, onUploading, prefix, value }, ref) => {
    useImperativeHandle(ref, () => ({
      focus: onPick,
      open: onPick,
    }))

    const onPick = useCallback(async () => {
      onUploading?.(true)

      try {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
          allowsMultipleSelection: true,
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        })

        if (result.canceled) {
          throw new Error()
        }

        const files = await Promise.all(
          result.assets.map(async ({ height, uri, width }) => {
            const name = `${createId()}.${uri.split('.').pop()}`

            const form = new FormData()

            form.append('file', {
              name,
              type: mime.getType(uri) ?? 'image/jpeg',
              uri,
            } as never)

            const path = [prefix, name].filter(Boolean).join('/')

            await supabase.storage.from(BUCKET_ASSETS).upload(path, form)

            return {
              height,
              url: path,
              width,
            }
          }),
        )

        onChange([...(value ?? []), ...files])
      } finally {
        onUploading?.(false)
      }
    }, [onChange, onUploading, prefix, value])

    return <>{children}</>
  },
)
