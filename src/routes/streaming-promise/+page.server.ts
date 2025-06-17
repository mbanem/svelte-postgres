import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db'
// import { sleep } from '$utils';
// import { json } from '@sveltejs/kit';

export const load = (async () => {
	const users = db.user.findMany();

	console.log('user', users)

	const streamed = fakeFetch();
	const normal = { message: 'No delay -- shown at once' };

	return {
		normal,
		streamed // Prisma Promise can be streamed
	};
}) satisfies PageServerLoad;

const fakeFetch = async () => {
	await delay(1000);
	const streamed =  db.user.findMany();
	return streamed;
}

const delay = (ms:number): Promise<void> => {
	return new Promise((resolve)=> setTimeout(resolve, ms))	
}