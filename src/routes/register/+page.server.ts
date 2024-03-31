import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({}) => {
	// todo
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async ({ request }) => {
		const { firstName, lastName, email, password } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			firstName: string;
			lastName: string;
			email: string;
			password: string;
		};
		// console.log('entered data', firstName, lastName, email, password);
		if (firstName === '' || lastName === '' || email === '') {
			return fail(400, {
				data: { firstName, lastName, email },
				message: 'Insufficient data supplied'
			});
		}

		const existingUser = await db.user.findFirst({
			where: {
				firstName,
				lastName,
				email
			}
		});
		if (existingUser) {
			// console.log('existingUser', JSON.stringify(existingUser));
			return fail(400, { data: { firstName, lastName, email }, message: 'Unacceptable data' });
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
			});
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
