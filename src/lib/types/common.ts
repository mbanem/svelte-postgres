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
