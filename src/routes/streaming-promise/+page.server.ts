import type { PageServerLoad } from './$types';

// always error on the first object property, here id
type TCategory = {
	id:number;
	name:string;
}
let categories:TCategory = []
export const load = (async ({fetch}) => {
	// NOTE: while fakeFetch can return a Promise that is not
	// the case with fetch('/streaming-promise/api')
	const res = await fetch('/data-fetching/api');
	const cats = (await res.json()) as TCategory[]
	// console.log('categories from /streaming-promise/api', categories)
	// await delay(2000)
	// const cats = fakeFetch(fetch)
	const categories = fakeFetch(cats)
	const regular = {message:'No await and no promise, just a string'}
	// console.log(regular,categories)
	return { regular, categories}
}) satisfies PageServerLoad;

const fakeFetch = async (categories) => {
	// const res = await fetch('/data-fetching/api');
	// const categories = (await res.json()) as TCategory[]
	// console.log('categories', categories)
	await delay(4000)
	return categories 
	// return {
	// 	categories: [
	// 		{id:1,name:'TypeScript'},
	// 		{id:2, name:'SvelteKit'},
	// 		{id:3, name:'SCSS'},
	// 		{id:4, name:'Prisma ORM'}
	// 	]
	// }
}
const delay = (ms:number): Promise<void> => {
	return new Promise((resolve)=> setTimeout(resolve, ms))	
}