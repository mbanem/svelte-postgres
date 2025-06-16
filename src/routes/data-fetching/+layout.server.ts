import type { LayoutServerLoad } from './$types';

export const load = (async () => {
    const fakeLayoutData = [1, 2, 3, 4, 5];
    // down the Data Tree +page.server.ts can accept  in its load 
    // function async ({ parent }) argument and call
    // const { fakeLayoutData } = await parent(); to get what
    // parent +page.server.ts returns from its load function
    return { fakeLayoutData };
}) satisfies LayoutServerLoad;