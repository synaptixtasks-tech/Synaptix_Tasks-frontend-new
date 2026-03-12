import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import WelcomeView from '@/views/WelcomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TasksView from '@/views/TasksView.vue'
import ProfileView from '@/views/ProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  { path: '/', component: WelcomeView, meta: { requiresGuest: true } },
  { path: '/login', component: LoginView, meta: { requiresGuest: true } },
  { path: '/register', component: RegisterView, meta: { requiresGuest: true } },
  { path: '/tasks', component: TasksView, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
]

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

let userChecked = false

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()

  // Try to restore user session if not checked yet
  if (!userChecked) {
    userChecked = true
    await authStore.fetchUser()
  }

  const isAuthenticated = !!authStore.user

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/tasks')
  } else {
    next()
  }
})

export default router
