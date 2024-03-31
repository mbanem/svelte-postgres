import type { PageServerLoad, Actions } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { db } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
// import type { User, Todo} from '@prisma/client'
// in order to load todos we cannot use end point
// +server.ts as it can only Respond on a request;
// instead we should use this +page.server.ts as it
// has +page in its name and so it has a load function
// that can deliver data: PageData to +page.svelte

export const load: PageServerLoad = (async ({ locals, cookies }) => {
	// admin should be able to see all todos of any user
	// so we have to load all todos with user info
	type UTodos = ({
		user: {
			id: string;
			firstName: string;
			lastName: string;
		};
	} & Todo)[];
	let todos: UTodos = [];

	let userAuthToken = cookies.get('session') ?? '';
	if (!userAuthToken) {
		throw error(400, 'User cookie not found');
	}
	// console.log('get user vua userAuthToken', userAuthToken);
	const user = await db.user.findUnique({
		where: {
			userAuthToken: cookies.get('session')
		}
	});
	if (!user) {
		throw error(400, 'User not found');
	}
	// console.log('user', JSON.stringify(user, null, 2));
	if (locals.user?.role === 'ADMIN') {
		todos = await db.todo.findMany({
			include: {
				user: {
					select: {
						id: true,
						firstName: true,
						lastName: true
					}
				}
			}
		});
	} else {
		todos = await db.todo.findMany({
			where: {
				userId: user.id
			},
			include: {
				user: {
					select: {
						id: true,
						firstName: true,
						lastName: true
					}
				}
			}
		});
	}
	const users = [...new Set(todos.map((todo) => todo.user))];
	// ('users with todos', JSON.stringify(users, null, 2));
	return {
		todos, // as Todo[] is important for TypeScript
		user,
		users
	};
}) satisfies PageServerLoad;

type InputData = {
	userId: string;
	title: string;
	content: string;
	priority: number;
};
export const actions: Actions = {
	create: async ({ request }) => {
		const input_data = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as InputData;

		input_data.priority = Number(input_data.priority);
		const { title, content, priority, userId } = input_data;
		if (title === '' || content === '' || userId === '') {
			return fail(400, {
				data: { title, content, priority, userId },
				message: 'Insufficient data supplied'
			});
		}
		const allData = {
			...input_data,
			updatedAt: new Date() // schema left this field non-default
		};

		try {
			const newTodo = await db.todo.create({
				data: {
					title,
					content,
					priority: Number(priority),
					userId,
					updatedAt: new Date()
				}
			});
		} catch (err) {
			return fail(500, { message: 'internal error occurred' });
		}

		return {
			message: 'todo successfully created'
		};
	}
} satisfies Actions;
