// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type User = {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		passwordHash: string;
		userAuthToken: string;
		posts: Post[];
		profile?: Profile;
	};

	type Profile = {
		id: number;
		bio: string;
		user: User;
		userId: number;
	};

	type Post = {
		id: number;
		createdAt: DateTime;
		updatedAt: DateTime;
		title: string;
		content: string;
		published: boolean;
		author: User;
		authorId: number;
	};
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
