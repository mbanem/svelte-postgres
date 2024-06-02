// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type Role = 'USER' | 'ADMIN' | 'UNKNOWN'
	type TNavBar = {
		navId: string
		startIx: number
		Ix: number
		activeEl: HTMLInputElement | undefined
	}
	type TNavButton = {
		position: string | number
		className: string // hidden or className as .navCategoryIx
		ix: number // for label to point to checkbox
		href: string // for goto statement
		title: string // button title
		condition: string // 'USER', 'ADMIN', 'UNKNOWN'
	}
	type TXNavButton =
		| TNavButton
		| { startIx: number; ix: number; className: string; hidden: boolean }
	type TNavButtons = TNavButton[]
	type TXNavButtons = TXNavButton[]
	type TNavButtonContext = Writable<TNavButton[]>

	type TBarContext = Writable<TNavBar[]>

	type TNavButtonObject = {
		position: string | number
		title: string
		href?: string
		cssRules?: string
		onHover?: string
		condition?: string
	}
	// As layout sends TNavButtonObject[] to TXNavButtonObject[] having additional
	// ix and className props. to avoid bothering user of missing ix and className,
	// that we generate dynamically anyway, so ix and className, though mandatory
	// for NavBar, are defined here as optional to avoid TypeScript complaint about
	// the type incompatibility
	type TXNavButtonObject = {
		position: string | number
		title: string
		href?: string
		ix?: number
		className?: string
		cssRules?: string
		onHover?: string
		condition?: string
		hidden?: boolean
		sort?: (order: string) => void
	}

	type PartialRecord<K extends keyof TXButtonParam, String> = {
		[P in TXButtonParam]?: String
	}
	// individual button params
	type TNavButtonProps = PartialRecord<TButtonParam, string>
	type TXNavButtonProps = PartialRecord<TXButtonParam, string>

	declare module 'FrontBackButton' {
		import { SvelteComponentTyped } from 'svelte'
		interface FBButtonProps
			extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['HTMLButtonElement']> {
			target_href: string
			title: string
			css_class?: string
			css_style_active?: string
		}
		export default class FBButton extends SvelteComponentTyped<FBButtonProps> {}
	}
	// interface WritableStore<T> extends Writable<T> {
	// 	getPath: () => string;
	// 	setPath: (name: string) => void;
	// }

	type Person = {
		name: string
		age: number
		city?: string
	}
	type QueryAuthor = {
		id: string
		firstName: string
		lastName: string
		role: Role
	}
	type PartialUser = {
		id: string
		firstName: string
		lastName: string
		role: Role
	}

	type Category = {
		id: number
		name: string
		selected?: boolean
	}
	type PAuthor = {
		id: string
		title: string
		content: string
		published: boolean
		createdAt: Date
		updatedAt: Date
		firstName: string
		lastName: string
		author: boolean
	}
	type PostAuthor = {
		id: string
		title: string
		content: string
		createdAt: Date
		updatedAt: Date
		author: boolean
		categoryIds: string
		categoryNames: string
		authorId: string
		published: boolean
		firstName: string
		lastName: string
		role: Role
	}
	type UserProfile = Profile & PartialUser
	// type Categories = Category[];

	type UTodo = {
		id: string
		firstName: string
		lastName: string
		role: Role
		todoId: string
		title: string
		content: string
		priority: string | number
		completed: boolean
		createdAt: Date
		updatedAt: Date
	}
	type UTodos = UTodo[]

	type TodoFormData = {
		id: string
		authorId: string
		title: string
		priority: number
		content: string
	}
	type Bio = {
		id: string
		bio: string
		user: Partial<User>
	}
	type Session = {
		userAuthToken: string
		firstName: string
		lastName: string
	}

	type Article = {
		id: string
		title: string
		content: string
		authorId: string
	}

	type Todo = {
		id: string
		title: string
		content: string
		priority: number
		completed: boolean
		userId: string
		createdAt: Date
		updatedAt?: Date
	}

	type User = {
		id: string
		firstName: string
		lastName: string
		email: string
		passwordHash: string
		userAuthToken: string
		role: Role
		createdAt: Date
		updatedAt?: Date
	}

	enum Role {
		USER = 'USER',
		ADMIN = 'ADMIN',
		UNKNOWN = 'UNKNOWN'
	}

	type Profile = {
		id: string
		bio: string | null
		userId: string
		createdAt: Date
		updatedAt: Date
	}

	// type Category = {
	// 	id: number;
	// 	name: string;
	// };

	type Post = {
		id: string
		title: string
		content: string | null
		published: boolean
		authorId: string
		createdAt: Date
		updatedAt: Date
	}

	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string
				firstName: string
				lastName: string
				role: string
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
