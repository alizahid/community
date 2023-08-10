import { Image } from 'expo-image'
import { type FunctionComponent, useRef } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import {
  ImageViewer,
  type ImageViewerRef,
  ImageWrapper,
} from 'react-native-reanimated-viewer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { getImageUrl } from '~/lib/supabase'
import { getSpace, useTailwind } from '~/lib/tailwind'

import { type ImageProps } from '../common/image-picker'

type Props = {
  images: Array<ImageProps>
  style?: StyleProp<ViewStyle>
}

export const Gallery: FunctionComponent<Props> = ({ images, style }) => {
  const insets = useSafeAreaInsets()

  const tw = useTailwind()

  const viewer = useRef<ImageViewerRef>(null)

  if (images.length === 0) {
    return null
  }

  return (
    <>
      <View style={[tw`flex-row flex-wrap gap-2`, style]}>
        {images.map(({ url }, index) => (
          <ImageWrapper
            index={index}
            key={index}
            source={{
              uri: getImageUrl(url),
            }}
            viewerRef={viewer}
          >
            <Image
              source={getImageUrl(url)}
              style={tw`h-20 w-20 rounded-lg bg-gray-3`}
            />
          </ImageWrapper>
        ))}
      </View>

      <ImageViewer
        data={images.map(({ url, width }) => ({
          key: url,
          source: {
            uri: getImageUrl(url, width),
          },
        }))}
        ref={viewer}
        renderCustomComponent={({ index }) => (
          <View
            style={tw`absolute gap-1 w-full flex-row justify-center bottom-[${
              insets.bottom + getSpace(tw, 4)
            }px]`}
          >
            {[...new Array(images.length)].map((_, item) => (
              <View
                key={item}
                style={tw.style(
                  'h-1 rounded-full',
                  item === index ? 'bg-primary-9 w-2' : 'bg-gray-9 w-1',
                )}
              />
            ))}
          </View>
        )}
      />
    </>
  )
}
