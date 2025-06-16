import type { PageServerLoad } from './$types';


export const load = (async ({ parent }) => {
    // this file is down the Data Tree and parent root +layout.server.ts.
    // from its load function parent returns { fakeLayoutData }.
    // This function accepts a ({ parent }) callback argument and so can
    // call await parent() to get what parent returned from its load function
    //  const { fakeLayoutData } = await parent();
    
	const { fakeLayoutData } = await parent();

	const fakeLayoutDataLength = fakeLayoutData.length;

	return { fakeLayoutDataLength };
}) satisfies PageServerLoad;