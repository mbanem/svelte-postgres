import type { RequestHandler } from '@sveltejs/kit';
import { SECRET_API_KEY } from '$env/static/private';

// using Postman we set url http://localhost:5173/api/posts
// for Authorization tab
// Type    API Ley from drop down  and  key  Authorization, value Bane and addTo Headers from drop down
// selecting queryParams instead of Headers got return Invalid credentials
export const GET: RequestHandler = async ({ request, url }) => {
  const authHeader = request.headers.get('Authorization');
  const limit = Number(url.searchParams.get('limit') ?? '2');
  const skip = Number(url.searchParams.get('skip') ?? '0');
  // console.log(SECRET_API_KEY);
  const data = await (
    await fetch(`https://dummyjson.com/posts/?limit=${limit}&skip=${skip}`)
  ).json();

  if (authHeader !== 'Bane') {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401,
    });
  }
  return new Response(JSON.stringify(data), {
    status: 201,
  });
};

export const POST = async ({ request }) => {
  const body = await request.json();
  return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
};
