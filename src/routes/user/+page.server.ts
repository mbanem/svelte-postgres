import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import type RequestEvent from '@sveltejs/kit'
import type { Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import * as utils from '$lib/utils';;
import { fail } from '@sveltejs/kit'


export const load: PageServerLoad = (async ({ }) => {
	const users = await db.user.findMany({
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			role: true,
			updatedAt: true
		}
	})
	if (!users) {
		return fail(400, { message: 'No  users in db' })
	}
	return {
		users
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	create: async ({ request }) => {
		const { email, firstName, lastName, password, role, updatedAt } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			firstName: string
			lastName: string
			email: string
			password: string
			role: Role
			updatedAt: Date

		}
		if (!(email && firstName && lastName && password && role && updatedAt)) {
			return fail(400, {
				data: {
					email, firstName, lastName, role, updatedAt
				},
				message: 'Insufficient data supplied'
			})
		}
		const userExists = await db.user.findFirst({
			where: {
				email,
				firstName,
				lastName,
			}
		})
		if (userExists) {
			return fail(400, {
				data: { email, firstName, lastName, role },
				message: 'Unacceptable data'
			})
		} else {
			const user = await db.user.create({
				data: {
					email,
					firstName,
					lastName,
					role,
					updatedAt: null,
					passwordHash: await bcrypt.hash(password, 10),
					userAuthToken: crypto.randomUUID(),
				}
			})
		}
		return {
			success: true,
			message: 'user created successfully'
		}
	},
	// ------------------------------------------------
	update: async ({ request }) => {
		const input_data = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			id?: string,
			firstName?: string,
			lastName?: string,
			email?: string,
			password?: string,
			role?: Role,
			updatedAt?: Date,

		}

		const { email, firstName, id, lastName, password, role, updatedAt } = input_data
		if (!(email || firstName || id || lastName || password || role || updatedAt)) {
			return fail(400, {
				data: { email, firstName, id, lastName, role, updatedAt },
				message: 'Insufficient data for update supplied'
			})
		}
		await utils.sleep(2000)
		try {
			await db.user.update({
				where: {
					id
				},
				data: {
					id,
					firstName,
					lastName,
					email,
					passwordHash: await bcrypt.hash(password, 10),
					role,
					updatedAt,
					userAuthToken: crypto.randomUUID()
				},
			})
			return {
				id, firstName, lastName, email, role, updatedAt,
				success: "Xuser updated successfully",
			}
		} catch (err) {
			return fail(500, { message: 'Internal error occurred' })
		}
	}
} satisfies Actions
