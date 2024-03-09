import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { fail, type RequestEvent } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = (async () => {
	const users = await db.user.findMany();
	if (!users) {
		return fail(400, { message: 'No users in db' });
	}
	// console.log('posts/PageServerLoad users', JSON.stringify(users, null, 2));
	return {
		users
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		console.log('profile/+page.server.ts create');
		const { bio, authorId } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			bio: string;
			authorId: string;
		};
		console.log(bio, authorId);
		if (!bio || !authorId) {
			return fail(400, { bio, message: 'Insufficient data supplied' });
		}
		try {
			const user = await db.user.findUnique({
				where: {
					id: authorId
				}
			});
			if (!user) {
				return fail(400, { user: 'User not in db' });
			}
			console.log(JSON.stringify(user, null, 2));
			const result = await db.profile.create({
				data: {
					bio,
					user: {
						connect: { id: user?.id }
					}
				},
				include: {
					user: true
				}
			});
			console.log('include user', JSON.stringify(result, null, 2));
		} catch (err) {
			console.log('error occurred', JSON.stringify(err, null, 2));
		}
		return;
	}
} satisfies Actions;
