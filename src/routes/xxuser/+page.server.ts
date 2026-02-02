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
		const { id, firstName, lastName, email, password, role, updatedAt } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			id: String
			firstName: String
			lastName: String
			email: String
			password: String
			role: Role
			updatedAt: Date

		}
		if (!(id && firstName && lastName && email && password && role && updatedAt)) {
			return fail(400, {
				data: {
					id, firstName, lastName, email, role, updatedAt
				},
				message: 'Insufficient data supplied'
			})
		}
		const userExists = await db.user.findFirst({
			where: {
				firstName, lastName, email, updatedAt
			}
		})
		if (userExists) {
			return fail(400, {
				data: { id, firstName, lastName, email, role, updatedAt },
				message: 'Unacceptable data'
			})
		} else {
			const user = await db.user.create({
				data: {
					firstName, lastName, email, role, updatedAt,
					undefined
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
			id?: String,
			firstName?: String,
			lastName?: String,
			email?: String,
			password?: String,
			role?: Role,
			updatedAt?: Date,

		}
		const { firstName, lastName, email, password, role, updatedAt } = input_data
		if (!(firstName && lastName && email && password && role && updatedAt)) {
			return fail(400, {
				data: { firstName, lastName, email, role, updatedAt },
				message: 'Insufficient data supplied'
			})
		}
		await utils.sleep(2000)

		let d = {}
		const hashEntry = async (el: string[]) => {
			if (el[1]) {
				if (el[0] === 'password') {
					d['passwordHash'] = await bcrypt.hash(el[1], 10)
				} else {
					d[el[0]] = el[1]
				}
			}
		}
		// Object.entries(input_data).map(el => el[1] ? hashEntry(el) : null)
		Object.entries(input_data).map(el => el[1] ? hashEntry(el) : null)
		d = Object.fromEntries(
			Object.entries(d).filter(([_, value]) => value !== 'null')
		)
		try {
			await db.user.update({
				where: {
					id
				},
				data: d,
			})
			return {
				email, firstName, id, lastName, role, updatedAt,
				success: "User updated successfully",
			}
		} catch (err) {
			return fail(500, { message: 'Internal error occurred' })
		}
	}
} satisfies Actions
