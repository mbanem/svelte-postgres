import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = (async ({}) => {
	const users = await db.user.findMany();
	// console.log(JSON.stringify(users, null, 2));
	if (!users) {
		return fail(400, { message: 'No users in db' });
	}
	return {
		users
	};
}) satisfies PageServerLoad;
