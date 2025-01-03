import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/admin',
    component: Admin
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
}) 