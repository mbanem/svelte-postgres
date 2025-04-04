import type { LayoutServerLoad } from './$types'
// https://github.com/mbanem/svelte-postgres.git
export const load = (async ({ locals }) => {
	// console.log('locals',locals)
	return {
		locals
	}
}) satisfies LayoutServerLoad
