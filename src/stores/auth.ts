import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/authService'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function login(username: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      console.log('Attempting login with username:', username)
      await authService.login(username, password)
      await fetchUser()
      return true
    } catch (e: unknown) {
      const errorMsg = (e as { message: string }).message || 'Login failed'
      console.error('Login error:', errorMsg)
      if (errorMsg.includes('401')) {
        error.value = 'Invalid username or password'
      } else if (errorMsg.includes('Failed to connect') || errorMsg.includes('fetch')) {
        error.value = 'Cannot connect to server.'
      } else {
        error.value = errorMsg
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
      console.log('Attempting register with username:', username)
      await authService.register(username, password)
      await fetchUser()
      return true
    } catch (e: unknown) {
      const errorMsg = (e as { message: string }).message || 'Registration failed'
      console.error('Register error:', errorMsg)
      if (errorMsg.includes('422')) {
        error.value = 'Username min 4 chars, password min 8 chars'
      } else if (errorMsg.includes('already exists') || errorMsg.includes('409')) {
        error.value = 'Username already exists'
      } else if (errorMsg.includes('Failed to connect') || errorMsg.includes('fetch')) {
        error.value = 'Cannot connect to server.'
      } else {
        error.value = errorMsg
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(): Promise<void> {
    const CurrentUser = await authService.getCurrentUser()
    if (CurrentUser) {
      user.value = CurrentUser
    } else {
      logout()
    }
  }

  async function logout(): Promise<void> {
    await authService.logout()
    token.value = null
    user.value = null
  }

  return { token, user, loading, error, login, register, fetchUser, logout }
})
