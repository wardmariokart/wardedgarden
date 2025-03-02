import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'
import { createRouter } from './router'

export async function render(url, manifest): Promise<Record<string, any>> {
	const { app, router } = createApp()

	// Set server-side router location
	router.push(url)
	await router.isReady()

	// Pass router's matched components to store actions
	const matchedComponents = router.currentRoute.value.matched
	// Execute asyncData hooks (if you're using them)

	// Render the app as a string
	const appHtml = await renderToString(app)


	// Get initial state to hydrate client-side store
	const initialState = {};

	return {
		appHtml,
		preloadLinks: '', // Would normally be generated based on used components
		headTags: '', // For meta tags, titles
		initialState
	}
}