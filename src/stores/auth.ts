import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/authService'
import { ApiError } from '../services/api'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function login(username: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await authService.login(username, password)
      token.value = localStorage.getItem('access_token')
      await fetchUser()
      return true
    } catch (e: unknown) {
      console.error('Login error:', e)
      if (e instanceof ApiError) {
        error.value = e.status === 401 ? 'Invalid username or password' : e.message
      } else {
        error.value = 'Cannot connect to server.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(username: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await authService.register(username, password)
      token.value = localStorage.getItem('access_token')
      await fetchUser()
      return true
    } catch (e: unknown) {
      console.error('Register error:', e)
      if (e instanceof ApiError) {
        if (e.status === 409) {
          error.value = 'Username already exists'
        } else if (e.status === 400) {
          error.value = 'Username min 4 chars, password min 8 chars'
        } else {
          error.value = e.message
        }
      } else {
        error.value = 'Cannot connect to server.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(): Promise<void> {
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      user.value = currentUser
      token.value = localStorage.getItem('access_token')
    } else {
      await logout()
    }
  }

  async function logout(): Promise<void> {
    await authService.logout()
    token.value = null
    user.value = null
  }

  return { token, user, loading, error, login, register, fetchUser, logout }
})
