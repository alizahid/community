import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'

import { type Database } from '~/types/supabase'

import { store } from './store'

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: store,
    },
  },
)

export const BUCKET_ASSETS = 'assets'

export const getImageUrl = (url: string, width = 400) => {
  if (url.includes('images.unsplash.com')) {
    return url.replace('w=1080', `w=${width}`)
  }

  const { data } = supabase.storage.from(BUCKET_ASSETS).getPublicUrl(url, {
    transform: {
      width,
    },
  })

  return data.publicUrl
}
