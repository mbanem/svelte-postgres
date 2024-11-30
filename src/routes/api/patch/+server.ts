import { fail, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as utils from '$utils';

export const PATCH = async ({ url }) => {
  const id = url.searchParams.get('id') as string;
  const completed = url.searchParams.get('completed') as string;

  console.log('PATCH', id, completed);
  if (id === '') {
    return new Response(
      JSON.stringify({ message: 'fail id or completed is missing' }),
      {
        status: 400,
      },
    );
  }
  await utils.sleep(2000);
  await db.todo.update({
    where: {
      id,
    },
    data: {
      completed: completed === 'true' ? true : false,
      updatedAt: new Date(),
    },
  });
  return new Response(JSON.stringify({ message: 'success' }), { status: 204 });
};
