import { type Json } from './supabase'

export type CountColumn = [
  {
    count: number
  },
]

export type User = {
  createdAt: Date
  id: string
  username: string
}

export type Community = {
  admin?: boolean
  description: string
  id: number
  member?: boolean
  name: string
  slug: string
}

export type Post = {
  comments: number
  community: {
    id: number
    name: string
    slug: string
  } | null
  content: string
  createdAt: Date
  id: number
  liked: boolean
  likes: number
  meta: Json
  user: {
    id: string
    username: string
  } | null
}

export type Comment = {
  content: string
  createdAt: Date
  id: number
  user: {
    id: string
    username: string
  } | null
}

export type CommunityCollection = {
  communities: Array<Community>
  cursor?: number
}

export type PostCollection = {
  cursor?: number
  posts: Array<Post>
}

export type CommentCollection = {
  comments: Array<Comment>
  cursor?: number
}
