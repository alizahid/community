import { isInteger } from 'lodash'
import { type FunctionComponent, useRef, useState } from 'react'
import { View } from 'react-native'
import Pager from 'react-native-pager-view'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon-button'
import { Input } from '~/components/common/input'
import { Pressable } from '~/components/common/pressable'
import { Typography } from '~/components/common/typography'
import { SearchCommunitiesCard } from '~/components/search/communities'
import { SearchPostsCard } from '~/components/search/posts'
import { useTailwind } from '~/lib/tailwind'

const Screen: FunctionComponent = () => {
  const t = useTranslations('screen.home.search')

  const tw = useTailwind()

  const pager = useRef<Pager>(null)

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [page, setPage] = useState(0)

  const [value] = useDebounce(query, 300)

  return (
    <>
      <View
        style={tw.style(
          'flex-row border-b',
          focused ? 'border-primary-8' : 'border-gray-7',
        )}
      >
        <Input
          autoCapitalize="none"
          onBlur={() => setFocused(false)}
          onChange={setQuery}
          onFocus={() => setFocused(true)}
          placeholder={t('placeholder')}
          style={tw`flex-1`}
          styleInput={tw`border-0 bg-transparent rounded-none`}
          value={query}
        />

        {query.length > 0 && (
          <IconButton name="clear" onPress={() => setQuery('')} />
        )}
      </View>

      <View style={tw`flex-row border-b-2 border-gray-6`}>
        {(['posts', 'communities'] as const).map((key, index) => (
          <Pressable
            key={key}
            onPress={() => pager.current?.setPage(index)}
            style={tw`p-3`}
          >
            <Typography
              color={index === page ? 'primary-11' : 'gray-12'}
              weight="bold"
            >
              {t(key)}
            </Typography>
          </Pressable>
        ))}
      </View>

      <Pager
        onPageScroll={(event) =>
          setPage(
            isInteger(event.nativeEvent.offset)
              ? event.nativeEvent.position
              : Math.round(event.nativeEvent.offset),
          )
        }
        ref={pager}
        style={tw`flex-1`}
      >
        <SearchPostsCard description={t('start')} query={value} />

        <SearchCommunitiesCard description={t('start')} query={value} />
      </Pager>
    </>
  )
}

export default Screen
