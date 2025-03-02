import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'

// Export a factory function for creating new app, router and store instances
export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()

  app.use(router)

  return { app, router }
}
// TODO this file is not used right now. 

// TODO which formatter is actually being used by vscode on save? why is it not adding ";"? 