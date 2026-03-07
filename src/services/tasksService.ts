import type { Task, TaskCreate } from '@/types'
import { api } from './api'

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    return await api.get('/v1/user/task_list')
  },

  async getTask(taskId: number): Promise<Task> {
    return await api.get(`/v1/user/task?task_id=${taskId}`)
  },

  async createTask(task: TaskCreate): Promise<Task> {
    return await api.post('/v1/user/task_create', task)
  },

  async updateTask(taskId: number, task: TaskCreate): Promise<Task> {
    return await api.put(`/v1/user/task_update?task_id=${taskId}`, task)
  },

  async deleteTask(taskId: number): Promise<void> {
    return await api.delete(`/v1/user/task_delete?task_id=${taskId}`)
  },
}
