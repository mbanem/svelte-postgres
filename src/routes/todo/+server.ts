import { db } from '$lib/server/db';
import { fail, json, type RequestHandler } from '@sveltejs/kit';

// in order to load todos we cannot use end point
// +server.ts as it can only Respond on a request;
// instead we should use +page.server.ts as it
// has +page in its name and so it has a load function
// that can deliver data: PageData to +page.svelte
// as export let data: PageData

export const PATCH = (async ({ url }) => {
	// console.log('PATCH searchParams id', JSON.stringify(url.searchParams.get('id'), null, 2));
	// PATCH searchParams id "2bf177d5-ceaa-4742-9a0d-89aed438c8c0"
	const id = url.searchParams.get('id') as string;
	try {
		const c = await db.todo.findUnique({
			where: {
				id
			},
			select: {
				completed: true
			}
		});
		if (c) {
			console.log('completed', c.completed, !c.completed);
			const todo = await db.todo.update({
				where: {
					id
				},
				data: {
					completed: !c.completed
				}
			});
			console.log(todo);
		}
	} catch (err) {
		return json({ failed: 'Internal error' });
	}
	return json({ toggled: true });
}) satisfies RequestHandler;

export const DELETE = (async ({ url }) => {
	// console.log('DELETE searchParams id', JSON.stringify(url.searchParams.get('id'), null, 2));
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
