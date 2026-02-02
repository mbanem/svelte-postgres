
// src/app.d.ts
import 'sveltekit'

// ──────────────────────────────────────────────────────────────
// 1. Augment Locals (available in hooks, load functions, etc.)
// ──────────────────────────────────────────────────────────────
declare global {
  // app namespace
  namespace App {
    // interface Error {}                    // optional: custom error shape
    interface Locals {
      user: UserPartial
      role: 'ADMIN' | 'USER' | 'VISITOR' | 'MODERATOR'
      session: {
        id: string
        expires: string
      } | null
    }

    // interface PageData {}                 // optional: shared page data
    // interface Platform {}                 // optional: for server-only env in load
  }
}

// ──────────────────────────────────────────────────────────────
// 2. Augment Svelte component module ($$Props, $$Events, $$Slots)
// ──────────────────────────────────────────────────────────────
import { SvelteComponent } from 'svelte'

declare module 'svelte' {
  export interface ComponentProps<C extends SvelteComponent> {
    // Example: make `class` prop available on every component
    class?: string
  }
}
// ──────────────────────────────────────────────────────────────
// 3. Custom global types (optional but very useful)
// ──────────────────────────────────────────────────────────────
declare global {

  const TOOLBAR_HEIGHT: number
  type TNavBar = {
    navId: string
    startIx: number
    Ix: number
    activeEl: HTMLInputElement | undefined
  }
  type Role = 'USER' | 'ADMIN' | 'VISITOR' | 'MODERATOR'
  type TNavButton = {
    position: string | number
    className: string // hidden or className as .navCategoryIx
    ix: number // for label to point to checkbox
    href: string // for goto statement
    title: string // button title
    condition: string // 'USER', 'ADMIN', 'VISITOR'
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

  // declare module 'FrontBackButton' {
  // 	import { SvelteComponentTyped } from 'svelte'
  // 	interface FBButtonProps
  // 		extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['HTMLButtonElement']> {
  // 		target_href: string
  // 		title: string
  // 		css_class?: string
  // 		css_style_active?: string
  // 		onclick:(event:MouseEvent)=>void
  // 	}
  // 	export default class FBButton extends SvelteComponentTyped<FBButtonProps> {}
  // }
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
    role: string
  }
  type UserPartial = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    role: string | null
    todoUserId?: string | null
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
    categoryNames: string
    firstName: string
    lastName: string
    authorIs: string
    createdAt: Date
    updatedAt: Date
  }
  type PostAuthor = {
    id: string
    title: string
    content: string
    author: boolean
    categoryIds: string
    categoryNames: string
    authorId: string
    published: boolean
    firstName: string
    lastName: string
    role: string
    createdAt: Date
    updatedAt: Date
  }
  type UserProfile = Profile & UserPartial
  // type Categories = Category[];

  type UTodo = {
    id: string
    firstName: string
    lastName: string
    role: string
    todoId: string
    title: string
    content: string
    priority: string | number
    completed: boolean
    createdAt: Date
    updatedAt: Date
  }
  // type UTodo[] = UTodo[];

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
    user: UserPartial
  }
  type Session = {
    userAuthToken: string
    firstName: string
    lastName: string
  }

  type Article = {
    author: User
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
    role: Role
    passwordHash: string
    userAuthToken: string
    createdAt: Date | null
    updatedAt: Date
  }


  type Role = 'USER' | 'ADMIN' | 'VISITOR' | 'MODERATOR'

  export const Role = {
    USER: 'USER' as const,
    ADMIN: 'ADMIN' as const,
    VISITOR: 'VISITOR' as const,
    MODERATOR: 'MODERATOR' as const,
  } satisfies Record<Role, Role>

  type Profile =
    | ({
      id: string | null
      bio: string | null
      userId: string
      createdAt: Date
      updatedAt: Date | null
    } & undefined)
    | null

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
    updatedAt: Date | null
  }

}

// This is required in a .d.ts file when using `declare global`
export { }