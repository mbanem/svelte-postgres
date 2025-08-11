
import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const values = {
      firstName: String(data.get('firstName')),
      lastName: String(data.get('lastName')),
      email: String(data.get('email'))
    };
    
    try {
      await db.user.create({ data: values });
      return { success: true };
    } catch (error) {
      return fail(500, { error: 'Failed to create record' });
    }
  },

  update: async ({ request }) => {
    const data = await request.formData();
    const id = String(data.get('id'));
    const values = {
      firstName: String(data.get('firstName')),
      lastName: String(data.get('lastName')),
      email: String(data.get('email'))
    };

    try {
      await db.user.update({ where: { id }, data: values });
      return { success: true };
    } catch (error) {
      return fail(500, { error: 'Failed to update record' });
    }
  },

  delete: async ({ request }) => {
    const data = await request.formData();
    const id = String(data.get('id'));

    try {
      await db.user.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      return fail(500, { error: 'Failed to delete record' });
    }
  }
};
  