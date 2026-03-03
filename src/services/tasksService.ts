import type { TaskCreate } from '@/types'
import { api } from './api'

export const tasksService = {
  async getTasks() {
    return await api.get('/v1/user/task_list') // backend zwraca listę tasków użytkownika - same id tasków
  },
  async getTask(taskId: number) {
    return await api.get(`/v1/user/task?task_id=${taskId}`) // backend zwraca szczegóły taska o podanym id
  },
  async createTask(task: TaskCreate) {
    return await api.post('/v1/user/task_create', task)
  },
  async updateTask(taskId: number, task: TaskCreate) {
    return await api.put(`/v1/user/task_update?task_id=${taskId}`, task)
  },
  async deleteTask(taskId: number) {
    return await api.delete(`/v1/user/task_delete?task_id=${taskId}`)
  },
}
