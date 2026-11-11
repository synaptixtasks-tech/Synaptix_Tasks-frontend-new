import type { Task, TaskCreate, TaskUpdate } from '@/types'
import { api } from './api'

export const tasksService = {
  getTasks(): Promise<Task[]> {
    return api.get<Task[]>('/v1/tasks')
  },

  getTask(taskId: string): Promise<Task> {
    return api.get<Task>(`/v1/tasks/${taskId}`)
  },

  createTask(task: TaskCreate): Promise<Task> {
    return api.post<Task>('/v1/tasks', task)
  },

  updateTask(taskId: string, task: TaskUpdate): Promise<Task> {
    return api.put<Task>(`/v1/tasks/${taskId}`, task)
  },

  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/v1/tasks/${taskId}`)
  },
}
