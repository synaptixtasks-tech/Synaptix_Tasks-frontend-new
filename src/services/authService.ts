import { api } from './api'

export const authService = {
  async login(username: string, password: string) {
    const data = await api.post('/v1/login', { username, password })
    localStorage.setItem('access_token', data.access_token)
    return data
  },
  async register(username: string, password: string) {
    const data = await api.post('/v1/register', { username, password })
    localStorage.setItem('access_token', data.access_token)
    return data
  },
  async deleteAccount() {
    await api.delete('/v1/user_delete')
    localStorage.removeItem('access_token')
  },
  async updateAccount(username: string, password: string) {
    await api.put('/v1/user_update', { username, password })
  },
  async logout() {
    localStorage.removeItem('access_token')
  },
  async getCurrentUser() {
    const token = localStorage.getItem('access_token')
    const user = token ? await api.get('/v1/user') : null
    return user
  },
}
