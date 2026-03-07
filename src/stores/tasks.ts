import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksService } from '../services/tasksService'
import type { Task } from '@/types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<'all' | 'active' | 'done'>('all')

  const filtered = computed(() => {
    if (filter.value === 'active') return tasks.value.filter((t) => !t.completed)
    if (filter.value === 'done') return tasks.value.filter((t) => t.completed)
    return tasks.value
  })

  const stats = computed(() => ({
    total: tasks.value.length,
    done: tasks.value.filter((t) => t.completed).length,
    active: tasks.value.filter((t) => !t.completed).length,
  }))

  async function fetchTasks(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      tasks.value = await tasksService.getTasks()
    } catch {
      error.value = 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  async function addTask(title: string, description?: string | null): Promise<Task | undefined> {
    try {
      const task = await tasksService.createTask({
        title,
        description: description ?? null,
        completed: false,
      })
      tasks.value.unshift(task)
      return task
    } catch {
      error.value = 'Failed to create task'
    }
  }

  async function toggleTask(task: Task): Promise<void> {
    try {
      const updated = await tasksService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      })
      const idx = tasks.value.findIndex((t) => t.id === task.id)
      if (idx !== -1) tasks.value[idx] = updated
    } catch {
      error.value = 'Failed to update task'
    }
  }

  async function editTask(
    id: number,
    title: string,
    description: string | null,
    completed: boolean,
  ): Promise<void> {
    try {
      const updated = await tasksService.updateTask(id, { title, description, completed })
      const idx = tasks.value.findIndex((t) => t.id === id)
      if (idx !== -1) tasks.value[idx] = updated
    } catch {
      error.value = 'Failed to update task'
    }
  }

  async function removeTask(id: number): Promise<void> {
    try {
      await tasksService.deleteTask(id)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch {
      error.value = 'Failed to delete task'
    }
  }

  function setFilter(f: 'all' | 'active' | 'done'): void {
    filter.value = f
  }

  return {
    tasks,
    filtered,
    loading,
    error,
    filter,
    stats,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
    setFilter,
  }
})
