import { db } from '$lib/server/db'
import bcrypt from 'bcrypt'
import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = (async ({}) => {
	// todo
}) satisfies PageServerLoad

export const actions: Actions = {
	register: async ({ request }) => {
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
				data: { firstName, lastName, email },
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
					userAuthToken: crypto.randomUUID()
					// role: 'USER'		// default by Prisma schema
				}
			})
		}

		throw redirect(303, '/')
	}
} satisfies Actions

import { db } from '$lib/server/db'
import bcrypt from 'bcrypt'
import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'
import { page } from '$app/stores'

export const load: PageServerLoad = (async ({ url }) => {
	console.log('register load +page.server.ts', url)
	const data = {
		firstName: url.searchParams.get('firstName'),
		lastName: url.searchParams.get('lastName'),
		email: url.searchParams.get('email'),
		password: url.searchParams.get('password')
	}
	return data
}) satisfies PageServerLoad

export const actions: Actions = {
	register: async ({ request }) => {
		const { firstName, lastName, email, password } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			firstName: string
			lastName: string
			email: string
			password: string
		}
		console.log('register', firstName, lastName, email, password)

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
					userAuthToken: crypto.randomUUID()
				}
			})
		}
		throw redirect(303, '/')
	}
} satisfies Actions
