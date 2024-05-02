import type { PageLoad } from './$types';
// as the top in load hierarchy +layout.server/ts sends some data
// we could get that data from the $app/stores and pipe it to
// the final destination, which is the +page.svelte
export const load: PageLoad = (async ({ data }) => {
	console.log('data', data);
	return {
		data: { data, message: 'from +page.svelte' },
		visitor: {
			firstName: 'Filip',
			lastName: 'Isakovic',
			city: 'San Diego'
		}
	};
}) satisfies PageLoad;
