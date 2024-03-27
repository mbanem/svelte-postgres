import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';

const getUniqueId = (): string => {
	// convert to a string of an integer from base 36
	return Math.random().toString(36).slice(2);
};

export const handle: Handle = (async ({ event, resolve }) => {
	// getting cookie from the browser
	const session = event.cookies.get('session') as string;
	if (!session) {
		return await resolve(event);
	}

	// we can now authenticate user if logged in
	const user = await db.user.findUnique({
		where: {
			userAuthToken: session
		},
		select: {
			firstName: true,
			lastName: true,
			role: true
		}
	});
	if (user) {
		event.locals.user = {
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role as Role
		};
	}

	return await resolve(event);
}) satisfies Handle;
