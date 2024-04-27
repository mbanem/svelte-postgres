// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type Person = {
		name: string;
		age: number;
		city?: string;
	};
	type QueryAuthor = {
		id: string;
		firstName: string;
		lastName: string;
		role: string;
	};
	type PartialUser = {
		id: string;
		firstName: string;
		lastName: string;
		role: string;
	};

	type PostAuthors = (Post & Author)[];
	type UserProfile = Profile & PartialUser;

	type UTodo = {
		id: string;
		firstName: string;
		lastName: string;
		role: string;
		todoId: string;
		title: string;
		content: string;
		priority: string;
		completed: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
	type UTodos = UTodo[];

	type Bio = {
		id: string;
		bio: string;
		user: Partial<User>;
	};
	type Session = {
		userAuthToken: string;
		firstName: string;
		lastName: string;
	};

	type Article = {
		id: string;
		title: string;
		content: string;
		authorId: string;
	};

	type Todo = {
		id: string;
		title: string;
		content: string;
		priority: number;
		completed: boolean;
		userId: string;
		createdAt: Date;
		updatedAt: ?Date;
	};

	type User = {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		passwordHash: string;
		userAuthToken: string;
		role: $Enums.Role;
		createdAt: Date;
		updatedAt: ?Date;
	};

	enum Role {
		USER = 'USER',
		ADMIN = 'ADMIN'
	}

	type Profile = {
		id: string;
		bio: string | null;
		userId: string;
		createdAt: Date;
		updatedAt: Date;
	};

	type Category = {
		id: number;
		name: string;
	};

	type Post = {
		id: string;
		title: string;
		content: string | null;
		published: boolean;
		authorId: string;
		createdAt: Date;
		updatedAt: Date;
	};
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string;
				firstName: string;
				lastName: string;
				role: Role;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
