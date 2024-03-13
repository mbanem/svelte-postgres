const users = [
	{
		id: 'one',
		firstName: 'Filip',
		lastName: 'Isakovic',
		email: 'filip@isak.com',
		passwordHash: 'password-hash',
		userAuthToken: 'auth-token',
		role: 1,
		roleId: 1,
		posts: [],
		profile: 1,
		todos: [],
		createdAt: '2024-3-3 10:10:10.00'
	},
	{
		id: 'two',
		firstName: 'Matia',
		lastName: 'Isakovic',
		email: 'filip@isak.com',
		passwordHash: 'password-hash',
		userAuthToken: 'auth-token',
		role: 1,
		roleId: 1,
		posts: [],
		profile: 1,
		todos: [],
		createdAt: '2024-3-3 10:10:10.00'
	}
];
let todos = [
	{
		id: 'first',
		content: 'first todo',
		priority: 0,
		completed: false,
		userId: 'two',
		createdAt: '2024-3-3 10:10:10.00'
	},
	{
		id: 'third',
		content: 'third todo',
		priority: 0,
		completed: false,
		userId: 'two',
		createdAt: '2024-3-3 10:10:10.00'
	},
	{
		id: 'forth',
		content: 'forth todo',
		priority: 0,
		completed: false,
		userId: 'two',
		createdAt: '2024-3-3 10:10:10.00'
	},
	{
		id: 'second',
		content: 'second todo',
		priority: 0,
		completed: true,
		userId: 'one',
		createdAt: '2024-3-3 10:10:10.00'
	}
];
import type { PageServerLoad } from './$types';

// in order to load todos we cannot use end point
// +server.ts as it can only Respond on a request;
// instead we should use this +page.server.ts as it
// has +page in its name and so it has a load function
// that can deliver data: PageData to +page.svelte

export const load: PageServerLoad = (async ({}) => {
	return {
		todos: todos as Todo[] // as Todo[] is important for TypeScript
	};
}) satisfies PageServerLoad;
