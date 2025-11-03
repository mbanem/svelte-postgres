import { redirect } from '@sveltejs/kit'
import type {Handle} from '@sveltejs/kit'
import { db } from '$lib/server/db'

const getUniqueId = (): string => {
	// convert to a string of an integer from base 36
	return Math.random().toString(36).slice(2)
}

export const handle: Handle = (async ({ event, resolve }) => {
	// console.log('hooks')
	let session='empty session'
	try {
		// getting cookie from the browser
		session = event.cookies.get('session')
		// if (!session) {
		// 	return await resolve(event);
		// }
		
		if (!session) {
			event.locals.user = {
				id: '',
				firstName: '',
				lastName: '',
				email:'',
				password:'',
				roles: ['VISITOR']
			}
			// prohibit access to 'ADMIN', 'USER' allowed pages
			if ('|fetch|news|store|comments|'.includes(`|${event.url.pathname.slice(1)}|`)) {
				throw redirect(303, '/login')
			}
			event.url.pathname = '/'
			// console.log('hooks no session', event)
			return await resolve(event)
		}
	} catch (error) {
		console.log('event.cookies.getSession', error)
	}


	try {
		// we can now authenticate user if logged in
		const user = await db.user.findUnique({
			where: {
				userAuthToken: session
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email:true,
				role: true
			}
		})

		if (user) {
			event.locals.user = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				password:'',
				role: user.role
			}
		}else{
			event.locals.user = {
				id: '',
				firstName: '',
				lastName: '',
				email:'',
				password:'',
				role: 'VISITOR'
			}
		}
	} catch (err) {
		console.log('hook getUser', err)
	}
	console.log('hooks locals',event.locals)
	return await resolve(event)
}) satisfies Handle

export {};