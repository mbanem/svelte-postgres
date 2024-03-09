import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/db';

export const actions: Actions = {
	login: async ({ request }) => {
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

		if (!(firstName && lastName && email)) {
			return fail(400, { data: { firstName, lastName, email } });
		}

		const user = await db.user.findUnique({
			where: {
				firstName,
				lastName,
				email
			}
		});
		throw redirect(303, '/');
	}
} satisfies Actions;
