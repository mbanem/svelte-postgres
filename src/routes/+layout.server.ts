import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// console.log('+layout.server.td load', JSON.stringify(locals, null, 2));
	return {
		locals
	};
}) satisfies LayoutServerLoad;
