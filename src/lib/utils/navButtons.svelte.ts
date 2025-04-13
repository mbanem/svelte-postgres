let role = $state<string>()
export const setRole = (role_: string) => {
  role = role_
  // $1.log('setRole', role)
}

// console.log('utils/navButtons.svelte.ts getNavButtons', role);
const navButtonObjects: TNavButtonObject[] = [
  { position: '0', title: 'home', condition: 'VISITOR' },
  { position: '5', title: 'counter', href: '/counter', condition: 'VISITOR' },
  { position: '10', title: 'derived', condition: 'VISITOR' },
  { position: '15', title: 'profile', condition: 'USER' },
  { position: '20', title: 'todo', condition: 'USER' },
  { position: '21', title: 'post', condition: 'USER' },
  {
    position: '25',
    title: 'scroll',
    href: '/bars/scroll',
    condition: 'VISITOR',
  },
  { position: '30', title: 'flip', condition: 'USER' },
  { position: '32', title: 'snippet', condition: 'VISITOR' },
  {
    position: '33',
    title: 'prop-class',
    href: '/prop-class',
    condition: 'VISITOR',
  },
  // { position: '35', title: 'balloon', href: '/balloon', condition: 'USER' },
  { position: '40', title: 'button', condition: 'VISITOR' },
  { position: '40', title: 'superforms', condition: 'VISITOR' },
  { position: '45', title: 'caterpillar', condition: 'ADMIN' },
  {
    position: '46',
    title: 'opposites',
    href: '/opposite-lists',
    condition: 'ADMIN',
  },
  { position: '46', title: 'cross_fade', condition: 'VISITOR' },
  { position: '47', title: 'crossfade', condition: 'VISITOR' },
  { position: '48', title: 'navbar', condition: 'VISITOR' },
  { position: '50', title: 'login', condition: 'VISITOR' },
  { position: '50', title: 'logout', condition: 'USER' },
  { position: '51', title: 'register', condition: 'VISITOR' },
]

const lastIx = navButtonObjects.length - 1

export const getNavButtons = () => {
  return navButtonObjects
}
