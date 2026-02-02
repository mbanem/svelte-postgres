import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import type RequestEvent from '@sveltejs/kit'
import type { Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import * as utils from '$lib/utils'

export const load: PageServerLoad = (async ({ locals, cookies }) => {

	const users = (await db.user.findMany({
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			role: true,
		},
	})).map(user => ({
		...user,
		password: 'xx', // extra field added here
	})) as UserPartial[]
	// await utils.sleep(1000);
	// console.log('user',users[0],'users',users)
	return {
		user: locals.user as UserPartial,
		users,
	}
}) satisfies PageServerLoad


export const actions: Actions = {
	create: async ({ request }) => {
		const { firstName, lastName, email, password } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			firstName: string
			lastName: string
			email: string
			password: string
		}

		if (firstName === '' || lastName === '' || email === '') {
			return fail(400, {
				data: {
					firstName,
					lastName,
					email
				},
				message: 'Insufficient data supplied'
			})
		}

		const existingUser = await db.user.findFirst({
			where: {
				firstName,
				lastName,
				email
			}
		})
		if (existingUser) {
			return fail(400, {
				data: { firstName, lastName, email },
				message: 'Unacceptable data'
			})
		} else {
			const user = await db.user.create({
				data: {
					firstName,
					lastName,
					email,
					passwordHash: await bcrypt.hash(password, 10),
					userAuthToken: crypto.randomUUID(),
					updatedAt: null
				}
			})
		}
		return {
			success: true,
			message: 'a-user created successfully'
		}
	},
	//} satisfies Actions;

	update: async ({ request }) => {
		const { firstName, lastName, email, password } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			firstName: string
			lastName: string
			email: string
			password: string
		}
		console.log('A-User update', firstName, lastName, email, password)

		if (!(firstName && lastName && email)) {
			return fail(400, {
				data: {
					firstName,
					lastName,
					email
				},
				message: 'Insufficient data supplied'
			})
		}

		const existingUser = await db.user.findFirst({
			where: {
				firstName,
				lastName,
				email,
				passwordHash
			}
		})
		if (!existingUser) {
			return fail(400, {
				data: { firstName, lastName, email },
				message: 'User does not exist'
			})
		} else {
			console.log('user exists', existingUser)
			const user = await db.user.update({
				where: {
					firstName: existingUser.firstName,
					lastName: existingUser.lastName,
					email: existingUser.email,
					password: existingUser.passwordHash,
				},
				data: {
					firstName,
					lastName,
					email,
					passwordHash: await bcrypt.hash(password, 10),
				}
			})
		}
		return {
			success: true,
			message: 'a-user updated successfully'
		}
	},
	delete: async ({ request }) => {
		const { firstName, lastName, email, password } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			firstName: string
			lastName: string
			email: string
			password: string
		}
		console.log('A-User update', firstName, lastName, email, password)

		if (firstName === '' || lastName === '' || email === '') {
			return fail(400, {
				data: {
					firstName,
					lastName,
					email
				},
				message: 'Insufficient data supplied'
			})
		}

		try {
			await db.profile.delete({
				where: {
					firstName,
					lastName,
					email
				},
			})
		} catch (err) {
			return fail(400, {
				data: { authorId: id },
				message: 'internal error occurred',
			})
		}
		await utils.sleep(2000)
		return {
			success: true,
			message: 'a-user successfully deleted',
		}
	}
} satisfies Actions