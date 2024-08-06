let role = $state<string>()
export const setRole = (role_: string) => {
	role = role_
	console.log('setRole', role)
}

// console.log('utils/navButtons.svelte.ts getNavButtons', role);
const navButtonObjects = [
	{ position: '0', title: 'home', condition: 'VISITOR' },
	{ position: '5', title: 'counter', href: '/counter', condition: 'VISITOR' },
	{ position: '10', title: 'derived', condition: 'VISITOR' },
	{ position: '15', title: 'profile', condition: 'USER' },
	{ position: '20', title: 'todo', condition: 'USER' },
	{ position: '21', title: 'post', condition: 'USER' },
	{ position: '25', title: 'scroll', condition: 'VISITOR' },
	{ position: '30', title: 'flip', condition: 'USER' },
	{ position: '31', title: 'chip', condition: 'VISITOR' },
	{ position: '32', title: 'snippet', condition: 'VISITOR' },
	{ position: '33', title: 'render', condition: 'VISITOR' },
	{ position: '35', title: 'balloon', href: '/balloon', condition: 'USER' },
	{ position: '40', title: 'button', condition: 'VISITOR' },
	{ position: '45', title: 'caterpillar', condition: 'ADMIN' },
	{ position: '46', title: 'opposites', href: '/opposite-lists', condition: 'ADMIN' },
	{ position: '46', title: 'crossfade', condition: 'VISITOR' },
	{ position: '50', title: 'login', condition: 'VISITOR' },
	{ position: '50', title: 'logout', condition: 'USER' },
	{ position: '51', title: 'register', condition: 'VISITOR' }
]

const lastIx = navButtonObjects.length - 1

export const getNavButtons = () => {
	// if (role === 'VISITOR') {
	// 	console.log('getNavButtons', 'visitor');
	// 	navButtonObjects[lastIx].title = 'login';
	// 	navButtonObjects[lastIx].condition = 'VISITOR';
	// } else {
	// 	console.log('getNavButtons', 'user');
	// 	navButtonObjects[lastIx].title = 'logout';
	// 	navButtonObjects[lastIx].condition = 'USER';
	// }
	return navButtonObjects
}
