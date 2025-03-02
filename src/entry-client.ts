import "./style.css"
import { createApp } from './main'
import { createRouter } from './router'

const { app, router } = createApp()

// Initialize store with data from server
// ??? what "window" actuall is? node specific? global variable ? how is that stored? how does node define this variable? where???????????

// Wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
	console.log("mount app :)")
	app.mount('#app')
})


// TODO css for this page is "jumping" in. it takes a split second to style the page which is very ugly 