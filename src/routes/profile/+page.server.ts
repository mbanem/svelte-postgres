import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error, fail, type RequestEvent } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = (async ({ locals, cookies }) => {
	let userAuthToken = cookies.get('session') ?? '';
	if (!userAuthToken) {
		throw error(400, 'User cookie not found');
	}
	// console.log('get user vua userAuthToken', userAuthToken);
	const user = await db.user.findUnique({
		where: {
			userAuthToken: cookies.get('session')
		}
	});
	if (!user) {
		throw error(400, 'User not found');
	}

	const users = await db.user.findMany(); //{
	// 	include: {
	// 		profile: {
	// 			select: {
	// 				bio: true,
	// 				createdAt: true,
	// 				updatedAt: true
	// 			}
	// 		}
	// 	}
	// });

	let queryProfiles: QueryPosts = [];
	if (locals.user?.role === 'ADMIN') {
		queryProfiles = await db.profile.findMany({
			include: {
				user: true
			}
		});
	} else {
		queryProfiles = await db.profile.findMany({
			where: {
				userId: user.id
			},
			include: {
				user: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true
					}
				}
			}
		});
	}

	// console.log('profiles/PageServerLoad users', JSON.stringify(users, null, 2));
	return {
		user,
		users,
		queryProfiles
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
		// console.log(bio, authorId);
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
				return fail(400, { bio, user: 'User not in db' });
			}
			// console.log(JSON.stringify(user, null, 2));
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
			// console.log('include user', JSON.stringify(result, null, 2));
		} catch (err) {
			console.log('error occurred', JSON.stringify(err, null, 2));
		}
		return;
	},
	update: async ({ request }) => {
		console.log('profile/+page.server.ts update');
		const { bio, bioId, authorId } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			bio: string;
			bioId: string;
			authorId: string;
		};
		console.log(bio, bioId, authorId);
		if (bio === '' || authorId === '' || bioId === '') {
			return fail(400, { bio, bioId, message: 'Insufficient data supplied' });
		}
		console.log('bio, authorId', JSON.stringify({ bio, bioId, authorId }, null, 2));
		try {
			await db.profile.update({
				where: {
					id: bioId
				},
				data: {
					bio
				}
			});
			return {
				bio,
				success: 'Profile successfully updated'
			};
		} catch (err) {
			return fail(500, { message: 'Internal error occurred' });
		}
	}
} satisfies Actions;
