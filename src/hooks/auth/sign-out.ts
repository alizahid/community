import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

import { supabase } from '~/lib/supabase'
import { queryClient } from '~/providers/query'

export const useSignOut = () => {
  const router = useRouter()

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => {
      queryClient.clear()

      await supabase.auth.signOut()

      router.replace('/')
    },
  })

  return {
    loading: isLoading,
    signOut: mutate,
  }
}
