import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import type RequestEvent from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt'
import * as utils from '$lib/utils';;

export const actions: Actions = {
	create: async ({ request }) => {
    const { email, firstName, id, lastName, password, role, updatedAt } = Object.fromEntries(
		// @ts-expect-error
		await request.formData()
	) as {
		email: String
	  firstName: String
	  id: String
	  lastName: String
	  password: String
	  role: Role
	  updatedAt: Date
	};
	if (!(email && firstName && id && lastName && password && role && updatedAt)) {
		return fail(400, {
			data: {
				email, firstName, id, lastName,  role, updatedAt
			},
			message: 'Insufficient data supplied'
		})
	}
	const aa-userExists = await db.aa-user.findFirst({
			where: {
				email, firstName, id, lastName, password, role, updatedAt
			}
		})
		if (aa-userExists) {
			return fail(400, {
				data: { email, firstName, id, lastName,  role, updatedAt },
				message: 'Unacceptable data'
			})
		} else {
			const aa-user = await db.aa-user.create({
				data: {
					email, firstName, id, lastName, password, role, updatedAt,
					undefined
				}
			})
		}
		return {
			success: true,
			message: 'aa-user created successfully'
		}
}
