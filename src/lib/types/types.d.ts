
// CRAppTypes from schema.prisma
type Role = 'USER' | 'ADMIN' | 'VISITOR' | 'MODERATOR'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  passwordHash: string
  userAuthToken: string
  profile: Profile
  articles: Article[]
  posts: Post[]
  todos: Todo[]
  createdAt: Date
  updatedAt: Date | null
}

export type Profile = {
  bio: string
  createdAt: Date | null
  id: string
  updatedAt: Date
  user: User
  userId: string
}

export type Article = {
  author: User
  authorId: string
  content: string
  id: string
  title: string
}

export type Post = {
  authorId: string
  categories: Category[]
  content: string
  createdAt: Date | null
  id: string
  published: Boolean
  title: string
  updatedAt: Date
}

export type Category = {
  id: Number
  name: string
  posts: Post[]
}

export type Todo = {
  completed: Boolean
  content: string
  createdAt: Date | null
  id: string
  priority: Number
  title: string
  updatedAt: Date
  user: User
  userId: string
}
// import type { User, Profile, Role, Article, Post, Category, Todo } from '$lib/types/types';
// export {}