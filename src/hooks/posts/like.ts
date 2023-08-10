import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { produce } from 'immer'

import { type Post } from '~/components/posts/card'
import { supabase } from '~/lib/supabase'
import { useAuth } from '~/providers/auth'

type PostCollection = {
  cursor?: number
  posts: Array<Post>
}

const updateCollection = (
  postId: number,
  data?: InfiniteData<PostCollection>,
) => {
  if (!data) {
    return
  }

  return produce(data, (next) => {
    const page = next.pages.find(({ posts }) =>
      posts.find(({ id }) => id === postId),
    )

    if (!page) {
      return
    }

    const post = page.posts.find(({ id }) => id === postId)

    if (post) {
      post.liked = !post.liked
      post.likes += post.liked ? 1 : -1
    }
  })
}

const updateOne = (post?: Post) => {
  if (!post) {
    return
  }

  return produce(post, (next) => {
    if (next) {
      next.liked = !next.liked
      next.likes += next.liked ? 1 : -1
    }
  })
}

export const useLikePost = (post: Post) => {
  const { session } = useAuth()

  const queryClient = useQueryClient()

  const updateKeyPosts = ['posts']
  const updateKeyPost = ['post', post.id]
  const updateKeyUserPosts = ['user_posts', post.user?.id]
  const updateKeyCommunityPosts = ['community_posts', post.community?.id]

  const updateKeys = [
    updateKeyPosts,
    updateKeyPost,
    updateKeyUserPosts,
    updateKeyCommunityPosts,
  ]

  const updateKeysWithCollection = [
    updateKeyPosts,
    updateKeyUserPosts,
    updateKeyCommunityPosts,
  ]

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => {
      const userId = session?.user.id

      if (!userId) {
        return
      }

      const { data: exists } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', userId)
        .single()

      if (exists) {
        await supabase.from('likes').delete().eq('id', exists.id)

        return
      }

      await supabase.from('likes').insert({
        post_id: post.id,
        user_id: userId,
      })
    },
    onError: (_, __, context) => {
      if (context) {
        queryClient.setQueryData(updateKeyPost, context.previous)
      }
    },
    onMutate: async () => {
      await Promise.all(updateKeys.map((key) => queryClient.cancelQueries(key)))

      const previous = queryClient.getQueryData(updateKeyPost)

      queryClient.setQueryData<Post>(updateKeyPost, (post) => updateOne(post))

      updateKeysWithCollection.forEach((key) =>
        queryClient.setQueryData<InfiniteData<PostCollection>>(key, (data) =>
          updateCollection(post.id, data),
        ),
      )

      return {
        previous,
      }
    },
    onSettled: () => {
      updateKeys.forEach((key) => queryClient.invalidateQueries(key))
    },
  })

  return {
    likePost: mutate,
    loading: isLoading,
  }
}
