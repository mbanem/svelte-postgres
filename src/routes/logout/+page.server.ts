import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

// import type { PageServerLoad } from './$types'

// export const load: PageServerLoad = (async ({ cookies, locals }) => {
// 	cookies.set('session', '', {
// 		path: '/',
// 		expires: new Date(0)
// 	})

// 	locals.user = { id: '', first_name: '', last_name: '', role: 'VISITOR' }
// 	// throw redirect(302, '/')
// }) satisfies PageServerLoad

// When we include a default action -- that action could be
// called from any page in the app providing in has a
// form in which the action attribute  points to route folder
// holding the default action (among others).
// To avoid confusion we do not implement default action in
// a route with strange name, but we dedicated separate logout
// route named according the action for it
// <form method='POST' action='/logout' -- not '?/logout' as
// that will ask form a sibling +page.server.ts
export const actions: Actions = {
	logout: async ({ cookies, locals }) => {
		cookies.set('session', '', {
			path: '/',
			expires: new Date(0)
		})
		// locals.user = {
		// 	id: '',
		// 	first_name: '',
		// 	last_name: '',
		// 	role: 'VISITOR'
		// }
		// await fetch('/')
		throw redirect(302, '/')
	}
} satisfies Actions
