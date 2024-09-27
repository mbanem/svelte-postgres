import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		locals
	};
};

export const actions: Actions = {
	// arg is an event, but we destructure it to get cookies and request
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const sessionId = (data.get('sessionId') as string) ?? '';
		if (!sessionId) {
			throw redirect(303, '/');
		}

		cookies.set('sessionId', sessionId, {
			path: '/'
		});
	}
} satisfies Actions;
