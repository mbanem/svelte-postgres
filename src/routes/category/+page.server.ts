import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import type RequestEvent from '@sveltejs/kit'
import type { Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import * as utils from '$lib/utils';;
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = (async ({ locals }) => {
	const category = await db.category.findMany({
		select: {
			id: true,
			name: true
		},
		orderBy: {
			id: 'asc'
		}
	})
	if (!categories) {
		return fail(400, { message: 'No  categories in db' })
	}
	const users = await db.user.findMany()
	return {
		locals,
		users,
		categories
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	create: async ({ request }) => {
		const { id, name } = Object.fromEntries(
			await request.formData()
		) as {
			id: number
			name: string
		}
		if (!(id && name)) {
			return fail(400, {
				data: {
					id, name
				},
				message: 'Insufficient data supplied'
			})
		}
		const categoryExists = await db.category.findFirst({
			where: {
				id, name
			}
		})
		if (categoryExists) {
			return fail(400, {
				data: { id, name },
				message: 'Unacceptable data'
			})
		} else {
			const category = await db.category.create({
				data: {
					id, name,
				}
			})
		}
		return {
			success: true,
			message: 'category created successfully'
		}
	},
	// ------------------------------------------------
	update: async ({ request }) => {
		const input_data = Object.fromEntries(
			await request.formData()
		) as {
			id?: number,
			name?: string,
		}

		const { id, name } = input_data
		if (!(id || name)) {
			return fail(400, {
				data: { id, name },
				message: 'Insufficient data supplied'
			})
		}
		await utils.sleep(2000)
		const d = Object.fromEntries(
			Object.entries(input_data).filter(([_, value]) => value).filter(Boolean)
		)
		try {
			await db.category.update({
				where: {
					id
				},
				data: d,
			})
			return {
				id, name,
				success: "Category updated successfully",
			}
		} catch (err) {
			return fail(500, { message: 'Internal error occurred' })
		}
	},
	// ------------------------------------------------
	delete: async ({ request }) => {
		const input_data = Object.fromEntries(
			await request.formData()
		) as {
			id?: number,
			name?: string,

		}

		const { id, name } = input_data
		if (!(id || name)) {
			return fail(400, {
				data: { id, name },
				message: 'Insufficient data supplied'
			})
		}
		await utils.sleep(2000)
		const d = Object.fromEntries(
			Object.entries(input_data).filter(([_, value]) => value).filter(Boolean)
		)
		try {
			await db.category.delete({
				where: {
					id
				}
			})
			return {
				id, name,
				success: "Category deleted successfully",
			}
		} catch (err) {
			return fail(500, { message: 'Internal error occurred' })
		}
	}
} satisfies Actions
