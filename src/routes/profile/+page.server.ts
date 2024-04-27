import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error, fail, type RequestEvent } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import * as utils from '$lib/utils';

export const load: PageServerLoad = (async ({ locals, cookies }) => {
	// locals holds logged in user details
	let userAuthToken = cookies.get('session') ?? '';
	if (!userAuthToken) {
		throw error(400, 'User cookie not found');
	}

	const users = (await db.user.findMany({
		select: {
			id: true,
			firstName: true,
			lastName: true,
			role: true
		}
	})) as Partial<User>[];

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
		// though for USER it is unique we use userProfiles as in case for ADMIN
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
	return {
		users,
		userProfiles
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		const { bio, authorId } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			bio: string;
			authorId: string;
		};
		if (!bio || !authorId) {
			return fail(400, { bio, message: 'Insufficient data supplied' });
		}
		await utils.sleep(2000);
		try {
			const user = await db.user.findUnique({
				where: {
					id: authorId
				}
			});
			if (!user) {
				return fail(400, { bio, user: 'User not in db' });
			}
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
		} catch (err) {
			console.log(err);
		}
		return {
			bio,
			success: 'Profile created'
		};
	},
	update: async ({ request }) => {
		const { bio, bioId, authorId } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			bio: string;
			bioId: string;
			authorId: string;
		};
		if (bio === '' || authorId === '' || bioId === '') {
			return fail(400, { bio, bioId, message: 'Insufficient data supplied' });
		}
		await utils.sleep(2000);
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
				success: 'Profile updated'
			};
		} catch (err) {
			return fail(500, { message: 'Internal error occurred' });
		}
	},
	delete: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('authorId') as string;
		try {
			await db.profile.delete({
				where: {
					userId: id
				}
			});
		} catch (err) {
			return fail(400, {
				data: { authorId: id },
				message: 'internal error occurred'
			});
		}
		return {
			success: true,
			message: 'Profile successfully deleted'
		};
	}
} satisfies Actions;
