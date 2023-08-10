import { type Comment } from '~/components/comments/card'
import { type Post } from '~/components/posts/card'

export type CountColumn = [
  {
    count: number
  },
]

export type PostCollection = {
  cursor?: number
  posts: Array<Post>
}

export type CommentCollection = {
  comments: Array<Comment>
  cursor?: number
}
