// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {

type Todo = {
  id:        	string
  content:   	string
  priority:  	Int
  completed: 	boolean
  user:   		User
  userId: 		string
  createdAt: 	DateTime
  updatedAt:? DateTime
}

type User = {
  id:      				string
  firstName:   		string
  lastName:    		string
  email:   				string
  passwordHash: 	string
  userAuthToken:	string
  role:   				Roles
  roleId: 				number
  posts:   				Post[]
  profile: 				Profile
  todos:         	Todo[]
  createdAt: 			DateTime
  updatedAt:? 		DateTime
}

type Roles = {
  id:   number
  name: string
  User: User[]
}

type Profile = {
  id:     		string
  bio:?    		string
  user:   		User
  userId: 		string
  createdAt: 	DateTime
  updatedAt:? DateTime
}

type Post = {
  id:        	string
  title:    	 string
  content:  	 string?
  published:	 boolean
  author:   	 User
  authorId:  	string
  createdAt: 	DateTime
  updatedAt:? DateTime
}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
