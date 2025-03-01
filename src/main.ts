import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'

// Export a factory function for creating new app, router and store instances
export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  const store = createStore()

  app.use(router)
  app.use(store)

  return { app, router, store }
}


// TODO which formatter is actually being used by vscode on save? why is it not adding ";"? 