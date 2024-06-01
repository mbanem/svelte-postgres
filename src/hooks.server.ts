import { redirect, type Handle } from '@sveltejs/kit'
import { db } from '$lib/server/db'

const getUniqueId = (): string => {
	// convert to a string of an integer from base 36
	return Math.random().toString(36).slice(2)
}

export const handle: Handle = (async ({ event, resolve }) => {
	// getting cookie from the browser
	const session = event.cookies.get('session') as string
	// if (!session) {
	// 	return await resolve(event);
	// }
	if (!session) {
		event.locals.user = {
			id: '',
			firstName: '',
			lastName: '',
			role: 'UNKNOWN'
		}
		// prohibit access to admin-only and logged-in-only allowed pages
		if ('|fetch|news|store|comments|'.includes(`|${event.url.pathname.slice(1)}|`)) {
			throw redirect(303, '/login')
		}
		event.url.pathname = '/'
		return await resolve(event)
	}

	// we can now authenticate user if logged in
	const user = await db.user.findUnique({
		where: {
			userAuthToken: session
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			role: true
		}
	})
	if (user) {
		event.locals.user = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role
		}
	}

	return await resolve(event)
}) satisfies Handle
