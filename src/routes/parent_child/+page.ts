import type { PageLoad } from './$types';
export const load: PageLoad = (async ({ data }) => {
	return {
		data,
		visitor: {
			firstName: 'Filip',
			lastName: 'Isakovic',
			city: 'San Diego'
		}
	};
}) satisfies PageLoad;
