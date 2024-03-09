import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	register: async ({ request }) => {
		// const data = await request.formData();
		// const firstName = data.get('firstName') as string;
		// const lastName = data.get('lastName') as string;
		// const email = data.get('email') as string;
		// const password = data.get('password') as string;
		const { firstName, lastName, email, password } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			firstName: string;
			lastName: string;
			email: string;
			password: string;
		};
		console.log(firstName, lastName, email, password);
		if (!(firstName && lastName && email)) {
			return fail(400, { data: { firstName, lastName, email } });
		}

		const user = await db.user.create({
			data: {
				firstName,
				lastName,
				email,
				passwordHash: await bcrypt.hash(password, 10),
				userAuthToken: crypto.randomUUID(),
				roleId: 1
			}
		});
		throw redirect(303, '/');
	}
} satisfies Actions;
