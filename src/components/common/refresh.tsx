import { type FunctionComponent, useCallback, useState } from 'react'
import { RefreshControl } from 'react-native'

import { getColor, useTailwind } from '~/lib/tailwind'

type Props = {
  onRefresh: () => Promise<unknown>
}

export const Refresher: FunctionComponent<Props> = ({ onRefresh }) => {
  const tw = useTailwind()

  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    if (!onRefresh) {
      return
    }

    setRefreshing(true)

    await onRefresh()

    setRefreshing(false)
  }, [onRefresh])

  return (
    <RefreshControl
      colors={[getColor(tw, 'primary-10'), getColor(tw, 'accent-10')]}
      onRefresh={refresh}
      refreshing={refreshing}
      tintColor={getColor(tw, 'primary-10')}
    />
  )
}
