  
declare module '$lib/types/types' {

      // CRAppTypes from schema.prisma
      
      export type User = {
        articles: Article[];
        createdAt: Date | null;
        email: string;
        firstName: string;
        id: string;
        lastName: string;
        passwordHash: string;
        posts: Post[];
        profile: Profile;
        role: Role;
        todos: Todo[];
        updatedAt: Date;
        userAuthToken: string;
      };

      export type Profile = {
        bio: string;
        createdAt: Date | null;
        id: string;
        updatedAt: Date;
        user: User;
        userId: string;
      };

      export type Article = {
        author: User;
        authorId: string;
        content: string;
        id: string;
        title: string;
      };

      export type Post = {
        author: User;
        authorId: string;
        categories: Category[];
        content: string;
        createdAt: Date | null;
        id: string;
        published: Boolean;
        title: string;
        updatedAt: Date;
      };

      export type Category = {
        id: Number;
        name: string;
        posts: Post[];
      };

      export type Todo = {
        completed: Boolean;
        content: string;
        createdAt: Date | null;
        id: string;
        priority: Number;
        title: string;
        updatedAt: Date;
        user: User;
        userId: string;
      };
  }
  // import type { User, Profile, Role, Article, Post, Category, Todo } from '$lib/types/types';