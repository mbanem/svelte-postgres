
export type TNotification = {
	count: number
	items: { type: 'news' | 'message'; content: string }[]
}
export type NewsArticle = {
	title: string
	slug: string
	content: string
}
export type NewsArticles = NewsArticle[]
export type ImageURL = { url: string }

export type TPoint = {
	x:number
	y:number
}
export type THoveringElement = HTMLElement|HTMLButton|HTMLDivElement|HTMLSelectElement|HTMLInputElement|HTMLAnchorElement
export type TTooltipPosition = 'top-left'|'top-middle'|'bottom-left'|'bottom-middle'|'bottom-right'| TPoint