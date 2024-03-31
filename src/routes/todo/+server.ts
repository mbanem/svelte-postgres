import { db } from '$lib/server/db';
import { fail, json, type RequestHandler } from '@sveltejs/kit';

// in order to load todos we cannot use end point
// +server.ts as it can only Respond on a request;
// instead we should use this +page.server.ts as it
// has +page in its name and so it has a load function
// that can deliver data: PageData to +page.svelte

export const PATCH = (async ({ url }) => {
	console.log('PATCH searchParams id', JSON.stringify(url.searchParams.get('id'), null, 2));

	return json({ toggled: true });
}) satisfies RequestHandler;

export const DELETE = (async ({ url }) => {
	console.log('DELETE searchParams id', JSON.stringify(url.searchParams.get('id'), null, 2));
	try {
		await db.todo.delete({
			where: {
				id: url.searchParams.get('id') as string
			}
		});
	} catch (err) {
		return json({ deleted: false });
	}
	return json({ deleted: true });
}) satisfies RequestHandler;
