import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import bcrypt from 'bcrypt';
import { SECRET_APT_ENV } from '$env/static/private';
import { db } from '$lib/server/db';

// using intellisense to copy all TS types generated from schema.prisma
//import type { User, Post, Category, Todo, Role, Article, Profile } from '@prisma/client';

export const load: PageServerLoad = (async ({}) => {
	// todo
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		// console.log('SECRET_APT_ENV', SECRET_APT_ENV);

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
			return fail(400, {
				data: { firstName, lastName, email },
				message: 'Incorrect authentication data'
			});
		}

		// for findUnique Prisma checks whether the where part is really unique
		// so if we specify where: {firstName, lastName, email} it will complain
		// putting squiggly on the where clause, but when we include fullNameEmail
		// which schema.prisma say
		// @@unique(name: "fullNameEmail', [firstName,lastName,email")
		// it takes findUnique acceptable
		const user = await db.user.findUnique({
			where: {
				fullNameEmail: {
					firstName,
					lastName,
					email
				}
			}
		});
		if (!user) {
			return fail(400, {
				data: { firstName, lastName, email },
				message: 'User not found'
			});
		}

		const passwordOK = await bcrypt.compare(password, user.passwordHash);
		if (!passwordOK) {
			fail(400, {
				data: { firstName, lastName, email },
				message: 'Incorrect authentication data'
			});
		}

		// create new userAuthToken in case it was compromised
		const authenticatedUser = await db.user.update({
			where: {
				id: user.id
			},
			data: {
				userAuthToken: crypto.randomUUID()
			}
		});

		// cookie would be new userAuthToken
		cookies.set('session', authenticatedUser.userAuthToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.SECRET_APT_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});
		throw redirect(302, '/');
	}
} satisfies Actions;
