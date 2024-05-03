import type { PageLoad } from './$types';
export const load: PageLoad = (async ({ data }) => {
	// console.log('/box/+page.ts data', data);
	return {
		data,
		visitor: {
			firstName: 'Filip',
			lastName: 'Isakovic',
			city: 'San Diego'
		}
	};
}) satisfies PageLoad;
