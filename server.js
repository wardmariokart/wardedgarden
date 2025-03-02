// ??? why is this whole file not .ts? 

import express from "express";
import fs from 'node:fs/promises';

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173

// in production, use pre-built (once)
let templateHtml = isProduction
	? await fs.readFile('./dist/client/index.html', 'utf-8')
	: ''

async function CreateServer() {
	const app = express();

	// TODO remove jsdoc when switching over to .ts file
	/** @type {import('vite').ViteDevServer | undefined} */
	let vite
	if (!isProduction) {
		const { createServer: createViteServer } = await import('vite');
		vite = await createViteServer({
			server: { middlewareMode: true },
			appType: 'custom'
		})
		app.use(vite.middlewares)
	} else {
		const compression = (await import('compression')).default; // ??? why is this with .default and import('vite') is not?
		const sirv = (await import('sirv')).default
		app.use(compression())
		app.use("/", sirv('./dist/client', { extensions: [] }))
	}

	app.use('*', async (req, res) => {
		try {
			const url = req.originalUrl
			let template;
			let render;
			if (!isProduction) {
				// Read index.html
				template = await fs.readFile('./index.html', 'utf-8');

				// ??? what does "vite.transformIndexHtml" do? 
				// 	TODO log result and input for vite.transformIndexHtml
				// TODO:  check if breakpoitn in server.ts hits when running

				template = await vite.transformIndexHtml(url, template);
				// Load the server entry. ssrLoadModule automatically transforms
				//	ESM source code to be usable in Node.js! There is no bundling
				//	required, and provides efficient invalidation similar to HMR.
				//	??? what is "module" in context of SSR
				//	??? why does esm source code need to be transformed into "usable node js code"?
				render = (await vite.ssrLoadModule('/src/entry-server.ts')).render // ??? why is there not './' required here?
			} else {
				// ??? explain why "template" is used and not tempaltehtml directly?
				template = templateHtml
				// ??? what actually gets imported here? why is it an import and not "ssrLoadModule"?
				//	a: vite.ssrLoadModule is prepared in advance
				// TODO log the result of vite.ssrLoadModule 
				render = (await import('./dist/server/entry-server.js')).render;
			}
			// 4. render the app HTML. This assumes entry-server.js's exported
			//     `render` function calls appropriate framework SSR APIs,
			//    e.g. vue/server-renderer.renderToString() 
			// const { appHtml, preloadLinks, headTags, initialState } = await render(url)
			const rendered = await render(url);



			// Inject rendered app into the template
			const html = template
				.replace(`<!--preload-links-->`, rendered.preloadLinks) // ??? what are preloadlinks meant for?
				.replace(`<!--head-tags-->`, rendered.headTags)
				.replace(`<!--ssr-outlet-->`, rendered.appHtml)
				.replace(
					`<!--initial-state-->`,
					`<script>window.__INITIAL_STATE__=${JSON.stringify(rendered.initialState)}</script>`
				)

			// Send rendered HTML
			res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
		} catch (e) {
			vite?.ssrFixStacktrace(e)
			console.error(e)
			res.status(500).end(e.message)
		}
	})

	app.listen(port, () => {
		console.log(`Server started at http://localhost:${port}`)
	})



}

CreateServer();