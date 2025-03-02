// ???: whata is "_createRouter" ? 
import { createRouter as _createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
// Import your other views

// Based on environment, use different history implementations
export function createRouter() {
  return _createRouter({
    // ??? research "https://router.vuejs.org/"
    // ??? what is import.meta.env
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      { path: '/', component: Home },
      // Add your other routes
    ]
  })
}