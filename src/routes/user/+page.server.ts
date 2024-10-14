import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (async ({ url }) => {
	try {
		const id = url.searchParams.get('id') as string;
		if (!id) {
			throw redirect(303, '/');
		}
		const user = await db.user.findUnique({
			where: {
				id: url.searchParams.get('id') as string
			},
			include: {
				profile: {
					select: {
						bio: true
					}
				},
				posts: {
					select: {
						title: true,
						content: true
					}
				},
				articles: {
					select: {
						title: true,
						content: true
					}
				}
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
