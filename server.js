import express from "express";
import { createServer as createViteServer } from 'vite'
import compression from 'compression';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1102 - base ssr app setup idk
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function CreateServer() {
	const app = express();

	// Create Vite server in middleware mode
	const vite = await createViteServer({
		server: { middlewareMode: true },
		appType: 'custom'
	})

	// Use Vite's connect instance as middleware
	app.use(vite.middlewares)
	app.use(compression())

	app.use('*', async (req, res) => {
		const url = req.originalUrl

		try {
			// Read index.html
			const index = fs.readFileSync(
				path.resolve(__dirname, 'index.html'),
				'utf-8'
			)

			// Apply Vite HTML transforms
			const template = await vite.transformIndexHtml(url, index)
			// TODO:  check if breakpoitn in server.ts hits when running


			// 3. Load the server entry. ssrLoadModule automatically transforms
			//    ESM source code to be usable in Node.js! There is no bundling
			//    required, and provides efficient invalidation similar to HMR.
			// ??? what is "module" in context of SSR 
			// ??? why does esm source code need to be transformed into "usable node js code"?
			const { render } = await vite.ssrLoadModule('/src/entry-server.ts')

			// 4. render the app HTML. This assumes entry-server.js's exported
			//     `render` function calls appropriate framework SSR APIs,
			//    e.g. vue/server-renderer.renderToString() 
			const { appHtml, preloadLinks, headTags, initialState } = await render(url)

			// Inject rendered app into the template
			const html = template
				.replace(`<!--preload-links-->`, preloadLinks)
				.replace(`<!--head-tags-->`, headTags)
				.replace(`<!--ssr-outlet-->`, appHtml)
				.replace(
					`<!--initial-state-->`,
					`<script>window.__INITIAL_STATE__=${JSON.stringify(initialState)}</script>`
				)

			// Send rendered HTML
			res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
		} catch (e) {
			// If an error is caught, let Vite fix the stack trace
			vite.ssrFixStacktrace(e)
			console.error(e)
			res.status(500).end(e.message)
		}
	})

	app.listen(3000, () => {
		console.log('Server started at http://localhost:3000')
	})



}

CreateServer();