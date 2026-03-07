import { api } from './api'
import type { User, TokenResponse } from '@/types'

export const authService = {
  async login(username: string, password: string): Promise<TokenResponse> {
    const data: TokenResponse = await api.postForm('/v1/login', { username, password })
    localStorage.setItem('access_token', data.access_token)
    return data
  },

  async register(username: string, password: string): Promise<TokenResponse> {
    const data: TokenResponse = await api.post('/v1/register', { username, password })
    localStorage.setItem('access_token', data.access_token)
    return data
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/v1/user_delete')
    localStorage.removeItem('access_token')
  },

  async updateAccount(username: string, password: string): Promise<void> {
    await api.put('/v1/user_update', { username, password })
  },

  logout(): void {
    localStorage.removeItem('access_token')
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    try {
      return await api.get('/v1/user')
    } catch {
      localStorage.removeItem('access_token')
      return null
    }
  },
}
