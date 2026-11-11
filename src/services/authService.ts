import { api } from './api'
import type { User, TokenResponse } from '@/types'

export const authService = {
  async login(username: string, password: string): Promise<TokenResponse> {
    const data = await api.post<TokenResponse>('/v1/auth/login', { username, password })
    localStorage.setItem('access_token', data.accessToken)
    return data
  },

  async register(username: string, password: string): Promise<TokenResponse> {
    const data = await api.post<TokenResponse>('/v1/auth/register', { username, password })
    localStorage.setItem('access_token', data.accessToken)
    return data
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/v1/user')
    localStorage.removeItem('access_token')
  },

  async updateAccount(username: string, password: string): Promise<void> {
    await api.put('/v1/user', { username, password })
  },

  // Backend nie ma endpointu logout (JWT bez stanu) — sesja kończy się lokalnie
  async logout(): Promise<void> {
    localStorage.removeItem('access_token')
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    try {
      return await api.get<User>('/v1/user')
    } catch {
      localStorage.removeItem('access_token')
      return null
    }
  },
}
