/*
 Having the +page in its name thr +page.server.ts is able to fetch
 data from the local database and from an external public API
*/
import type { PageServerLoad } from './$types';
type Todo = {
    id: string | null;
    name: string;
    done: boolean;
}
export const load = (async ({fetch}) => {
	const userTodos:Todo[] = [
		{
			id: 'garage-roof',
			name: 'Mount garage roof',
			done: true,
		},
		{
			id: 'garage-concrete',
			name: 'Put concrete around and for entry',
			done: true,
		},
		{
			id: 'garage-electric',
			name: 'Make project for electrifying garage and basement',
			done: false,
		},
	];

	// ANOTHER WAY TO DO IT
	const res = await fetch('/data-fetching/api');
	const categories = (await res.json()) as Todo[]
	console.log('categories', categories)
	const data = {
			userTodos
	};
	// console.log('from page.server.ts', data);

	const randomStrings = getRandomStrings();

	return { userTodos, randomStrings };
}) satisfies PageServerLoad;

async function getRandomStrings(count: number = 5): Promise<string[]> {
	await delay(5000);

	const randomStrings: string[] = [];
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const stringLength = 10;

	for (let i = 0; i < count; i++) {
		let result = '';
		for (let j = 0; j < stringLength; j++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		randomStrings.push(result);
	}

	return randomStrings;
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}