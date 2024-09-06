import { db } from '$server/db'

import type { PageServerLoad } from './$types'

export const load = (async ({}) => {
	const users = (await db.user.findMany()) as User[]
	console.log('news/slug/+page.server.ts load users', users)

	return {
		users
	}
}) satisfies PageServerLoad
