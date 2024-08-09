import type { PageServerLoad, Actions } from './$types'
import { error, fail } from '@sveltejs/kit'
import { v4 as uuidv4 } from 'uuid'
import { db } from '$server/db'
import * as utils from '$utils'
// import type { User, Todo} from '@prisma/client'
// in order to load uTodos we cannot use end point
// +server.ts as it can only Respond on a request;
// instead we should use this +page.server.ts as it
// has +page in its name and so it has a load function
// that can deliver data: PageData to +page.svelte
// via export let data: PageData
// also +layout.server.ts delivers data to +layout.svelte
// using import type { LayoutData } from './$types'

// admin should be able to see all uTodos of any user
// so we have to load all uTodos with user info
// type UTodos = ({
// 	user: {
// 		id: string;
// 		firstName: string;
// 		lastName: string;
// 	};
// } & Todo)[];

export const load: PageServerLoad = (async ({ locals, cookies }) => {
	let uTodos: UTodos = []

	let userAuthToken = cookies.get('session') ?? ''
	if (!userAuthToken) {
		throw error(400, 'User cookie not found')
	}

	const user = (await db.user.findUnique({
		where: {
			userAuthToken: cookies.get('session')
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			role: true
		}
	})) as UserPartial

	if (!user) {
		throw error(400, 'User not found')
	}

	if (locals.user?.role === 'ADMIN') {
		uTodos = (await db.$queryRaw`select
				u.id,
				u.first_name as "firstName",
				u.last_name as "lastName",
				u.role,
				t.id as "todoId",
				t.title,
				t.content,
				t.priority,
				t.completed,
				t.created_at as "createdAt",
				t.updated_at as "updatedAt"
		from 	todo t
		join 	users u on t.user_id = u.id
		order by 		u.last_name ASC,
								u.first_name ASC,
								t.priority DESC;`) as UTodos
	} else {
		uTodos = (await db.$queryRaw`select
					u.id,
					u.first_name as "firstName",
					u.last_name as "lastName",
					u.role,
					t.id as "todoId",
					t.title,
					t.content,
					t.priority,
					t.completed,
					t.created_at as "createdAt",
					t.updated_at as "updatedAt"
			from 	todo t
			join 	users u on t.user_id = u.id
			where u.id = ${user.id}
			order by 		u.last_name ASC,
									u.first_name ASC,
									t.priority DESC;`) as UTodos
	}
	const getUser = (id: string) => {
		for (let i = 0; i < uTodos.length; i++) {
			// @ts-expect-error
			if (id === uTodos[i].id) {
				return uTodos[i]
			}
		}
	}

	const users: UserPartial[] =
		await db.$queryRaw`select distinct t.user_id as "id", u.first_name as "firstName",u.last_name as "lastName", u.role from todo t join users u on u.id = t.user_id`
	return {
		uTodos, // as UTodos is important for TypeScript
		// user,		// user is in locals that is sent from root/+layout.server.ts
		users
	}
}) satisfies PageServerLoad

type InputData = {
	id?: string
	userId: string
	title: string
	content: string
	priority: number
}

// we could implement patchTodo  and deleteTodo here but
// we decided to implement in an end-point +server.ts
// which is more cumbersome
export const actions: Actions = {
	addTodo: async ({ request }) => {
		const input_data = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as InputData
		console.log('addTodo', JSON.stringify(input_data, null, 2))
		input_data.priority = Number(input_data.priority)
		const { userId, title, content, priority } = input_data
		if (title === '' || content === '' || userId === '') {
			return fail(400, {
				data: { userId, title, content, priority },
				message: 'Insufficient data supplied'
			})
		}
		const allData = {
			...input_data,
			updatedAt: new Date() // schema left this field non-default
		}

		try {
			const upd = new Date()
			console.log(
				'db.todo.create',
				JSON.stringify({ title, content, priority, userId, updatedAt: upd }, null, 2)
			)
			const newTodo = await db.todo.create({
				data: {
					title,
					content,
					priority,
					userId,
					updatedAt: new Date()
				}
			})
		} catch (err) {
			return fail(500, {
				data: { userId, title, content, priority },
				message: 'internal error occurred'
			})
		}

		await utils.sleep(2000)
		return {
			success: true,
			message: 'Todo successfully created'
		}
	},
	updateTodo: async ({ request }) => {
		const input_data = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as InputData

		// turn priority to numeric
		input_data.priority = Number(input_data.priority)
		const { id, userId, title, content, priority } = input_data
		if (id === '' || userId === '' || title === '' || content === '') {
			return fail(400, {
				data: { id, userId, title, content, priority },
				message: 'Insufficient data supplied'
			})
		}
		try {
			await db.todo.update({
				where: {
					id
				},
				data: {
					title,
					content,
					priority,
					updatedAt: new Date()
				}
			})
			await utils.sleep(2000)

			return {
				todos: { id: 'some id', title: 'some title', content: 'some content' },
				success: true,
				message: 'Todo successfully updated'
			}
		} catch (err) {
			return fail(500, {
				data: { userId, title, content, priority },
				message: 'internal error occurred'
			})
		}
	},
	deleteTodo: async ({ request }) => {
		const body = await request.formData()
		const id = body.get('id') as string

		if (id === '') {
			return fail(400, {
				data: id,
				message: 'id not provided'
			})
		}
		await utils.sleep(2000)
		await db.todo.delete({
			where: {
				id
			}
		})
		return {
			success: 'todo deleted'
		}
	}
} satisfies Actions
