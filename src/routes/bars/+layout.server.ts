import type { LayoutServerLoad } from './$types'
import { notifications } from '$lib/notifications'
export const load = (async ({ locals }) => {
	return {
		locals,
		notifications
	}
}) satisfies LayoutServerLoad
