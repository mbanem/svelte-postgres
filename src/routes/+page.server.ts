import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		locals
	};
};

export const actions: Actions = {
	// ard is event, but we destructure it
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const sessionId = (data.get('sessionId') as string) ?? '';
		if (!sessionId) {
			throw redirect(303, '/');
		}

		// console.log('+page.server.ts set locals', JSON.stringify(locals));
		cookies.set('sessionId', sessionId, {
			path: '/'
		});
	}
} satisfies Actions;
