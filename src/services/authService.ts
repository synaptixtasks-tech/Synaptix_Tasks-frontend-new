import { api } from './api'
import type { User, TokenResponse } from '@/types'

export const authService = {
  async login(username: string, password: string): Promise<TokenResponse> {
    const data: TokenResponse = await api.postForm('/v1/login', { username, password })
    return data
  },

  async register(username: string, password: string): Promise<TokenResponse> {
    const data: TokenResponse = await api.post('/v1/register', { username, password })
    return data
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/v1/user_delete')
  },

  async updateAccount(username: string, password: string): Promise<void> {
    await api.put('/v1/user_update', { username, password })
  },

  async logout(): Promise<void> {
    await api.post('/v1/logout', {})
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await api.get('/v1/user')
    } catch {
      return null
    }
  },
}
