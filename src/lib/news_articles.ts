// import json from './arts.json'	//should turn tsconfig.json into mor js oriented
import type { NewsArticle } from '$types/common'
// for +page.server.ts to send data to sibling +page.svelte
// as expected data and as we had to assert json data to
// Record<string, NewsArticles>, which needs a new variable
// and we want to send variable data then the original
// json variable should have different name -- jsonData here
export const data: NewsArticle[] = [
	// string key we use as ix index below
	{
		// object of type NewsArticles for the string key ix we named it as content below
		title: 'Einstein is Right Time is Relative',
		slug: 'first',
		content:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque sunt id similique ducimus commodi velit perspiciatis architecto ea reprehenderit voluptates.'
	},
	{
		title: 'Effective Routing Techniques',
		slug: 'second',
		content: 'Effective-routing-techniques by Filip Isakovic'
	},
	{
		title: 'Formatting Page Using SCSS',
		slug: 'third',
		content: 'Creating and using mixins and variables. Preparing the Reset class'
	}
]
// this was used as testing place for finding a way to loop over json structure

// this approach is used when we are not interested in string key indices
// and it does  not involve inner loop
// export const test = () => {
// 	for (let v of Object.values(data)) {
// 		console.log(v.title, v.slug, v.content)
// 	}
// }

// this is based on indices that forces an inner loop
// export const test = () => {
// 	for (let ix in data) {
// 		// need  to assert type before assignment
// 		const dd = data[ix] as NewsArticles
// 		// we cannot use data[ix] here for dd
// 		for (let key in dd as NewsArticles) {
// 			console.log(key, dd[key as keyof NewsArticles])
// 		}
// 		// without nesting loops we need access via data[ix]?.title
// 		// console.log(data[ix]?.title, data[ix]?.slug, data[ix]?.content)
// 	}
// }
