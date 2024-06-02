import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		greeting:'Hello World!'
	};
}) satisfies PageServerLoad;
