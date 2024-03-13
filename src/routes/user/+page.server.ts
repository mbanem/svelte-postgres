import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = (async ({ url }) => {
	console.log('user/+page.server.ts url', JSON.stringify(url, null, 2));
	try {
		const user = await db.user.findUnique({
			where: {
				id: url.searchParams.get('id') as string
			}
		});
		if (!user) {
			return fail(400, { message: 'User not found' });
		}

		return {
			user
		};
	} catch (err) {
		console.log(err);
	}
}) satisfies PageServerLoad;
