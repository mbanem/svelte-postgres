import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error, fail, type RequestEvent } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = (async ({ locals, cookies }) => {
	// locals holds logged in user details
	let userAuthToken = cookies.get('session') ?? '';
	if (!userAuthToken) {
		throw error(400, 'User cookie not found');
	}

	// console.log('locals.user', JSON.stringify(locals.user, null, 2));
	const users = await db.user.findMany();
	// 	select: {
	// 		id: true,
	// 		firstName: true,
	// 		lastName: true,
	// 		role: true,
	// 		profile: {
	// 			select: {
	// 				id: true,
	// 				bio: true,
	// 				createdAt: true,
	// 				updatedAt: true
	// 			}
	// 		}
	// 	}
	// });

	let userProfiles = [];
	if (locals.user?.role === 'ADMIN') {
		userProfiles = await db.profile.findMany({
			select: {
				id: true,
				bio: true,
				userId: true,
				createdAt: true,
				updatedAt: true,
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
	} else {
		userProfiles = await db.profile.findMany({
			where: {
				userId: locals.user.id
			},
			select: {
				id: true,
				bio: true,
				userId: true,
				createdAt: true,
				updatedAt: true,
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
	// console.log('profiles/PageServerLoad userProfiles', JSON.stringify(userProfiles, null, 2));
	return {
		users,
		userProfiles
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		// console.log('profile/+page.server.ts create');
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
			console.log(JSON.stringify(err, null, 2));
		}
		return;
	},
	update: async ({ request }) => {
		// console.log('profile/+page.server.ts update');
		const { bio, bioId, authorId } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			bio: string;
			bioId: string;
			authorId: string;
		};
		// console.log(bio, bioId, authorId);
		if (bio === '' || authorId === '' || bioId === '') {
			return fail(400, { bio, bioId, message: 'Insufficient data supplied' });
		}
		// console.log('bio, authorId', JSON.stringify({ bio, bioId, authorId }, null, 2));
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
