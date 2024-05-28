// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type TNavBar = {
		navId: string;
		pIx: number;
		oIx: number;
		activeEl: HTMLInputElement | undefined;
	};
	type TBarContext = Writable<TNavBar[]>;
	type TButtonObject = {
		title: string;
		href?: string;
		ix?: number;
		className?: string;
		cssRules?: string;
		onHover?: string;
	};
	type TButtonObjects = TButtonObject[];
	type TButtonProps = Array<string | string[]>;
	declare module 'FrontBackButton' {
		import { SvelteComponentTyped } from 'svelte';
		interface FBButtonProps
			extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['HTMLButtonElement']> {
			target_href: string;
			title: string;
			css_class?: string;
			css_style_active?: string;
		}
		export default class FBButton extends SvelteComponentTyped<FBButtonProps> {}
	}
	// interface WritableStore<T> extends Writable<T> {
	// 	getPath: () => string;
	// 	setPath: (name: string) => void;
	// }

	type Person = {
		name: string;
		age: number;
		city?: string;
	};
	type QueryAuthor = {
		id: string;
		firstName: string;
		lastName: string;
		role: Role;
	};
	type PartialUser = {
		id: string;
		firstName: string;
		lastName: string;
		role: Role;
	};

	type Category = {
		id: number;
		name: string;
		selected?: boolean;
	};
	type PAuthor = {
		id: string;
		title: string;
		content: string;
		published: boolean;
		createdAt: Date;
		updatedAt: Date;
		firstName: string;
		lastName: string;
		author: boolean;
	};
	type PostAuthor = {
		id: string;
		title: string;
		content: string;
		createdAt: Date;
		updatedAt: Date;
		author: boolean;
		categoryIds: string;
		categoryNames: string;
		authorId: string;
		published: boolean;
		firstName: string;
		lastName: string;
		role: Role;
	};
	type UserProfile = Profile & PartialUser;
	// type Categories = Category[];

	type UTodo = {
		id: string;
		firstName: string;
		lastName: string;
		role: Role;
		todoId: string;
		title: string;
		content: string;
		priority: string | number;
		completed: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
	type UTodos = UTodo[];

	type TodoFormData = {
		id: string;
		authorId: string;
		title: string;
		priority: number;
		content: string;
	};
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
		updatedAt?: Date;
	};

	type User = {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		passwordHash: string;
		userAuthToken: string;
		role: Role;
		createdAt: Date;
		updatedAt?: Date;
	};

	enum Role {
		USER = 'USER',
		ADMIN = 'ADMIN',
		UNKNOWN = 'UNKNOWN'
	}

	type Profile = {
		id: string;
		bio: string | null;
		userId: string;
		createdAt: Date;
		updatedAt: Date;
	};

	// type Category = {
	// 	id: number;
	// 	name: string;
	// };

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
