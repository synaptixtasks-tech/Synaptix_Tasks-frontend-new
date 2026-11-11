import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { tasksService } from '../services/tasksService'
import type { Task, TaskCreate, TaskUpdate } from '../types'

const TASKS_KEY = ['tasks']

// crypto.randomUUID() istnieje tylko w secure context (HTTPS/localhost)
function temporaryId(): string {
  return crypto.randomUUID?.() ?? `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useTasks() {
  const queryClient = useQueryClient()

  // Query - pobieranie zadań
  const {
    data: tasks,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: TASKS_KEY,
    queryFn: () => tasksService.getTasks(),
    notifyOnChangeProps: 'all',
  })

  // Mutation - dodawanie zadania (optimistic)
  const addTaskMutation = useMutation({
    mutationFn: (newTask: TaskCreate) => tasksService.createTask(newTask),
    onMutate: async (newTask) => {
      // Anuluj wszelkie wychodzące refetch
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })

      // Zapisz poprzedni stan
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_KEY)

      // Optimistycznie dodaj nowe zadanie
      const now = new Date().toISOString()
      const optimisticTask: Task = {
        id: temporaryId(), // Tymczasowe ID — po refetchu zastąpi je ID z serwera
        title: newTask.title,
        description: newTask.description ?? null,
        completed: false,
        dateCreated: now,
        updatedAt: now,
        isDeleted: false,
        userId: '',
      }

      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) => {
        if (!old) return [optimisticTask]
        return [optimisticTask, ...old]
      })

      return { previousTasks }
    },
    onError: (_err, _newTask, context) => {
      // Przywróć poprzedni stan w przypadku błędu
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(TASKS_KEY, context.previousTasks)
      }
    },
    onSettled: () => {
      // Odśwież dane po zakończeniu
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })

  // Mutation - aktualizacja zadania (optimistic)
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: TaskUpdate }) =>
      tasksService.updateTask(id, task),
    onMutate: async ({ id, task }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_KEY)

      // Optimistycznie zaktualizuj zadanie
      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) => {
        if (!old) return old
        return old.map((t) => (t.id === id ? { ...t, ...task } : t))
      })

      return { previousTasks }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(TASKS_KEY, context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })

  // Mutation - przełączanie statusu zadania (optimistic)
  const toggleTaskMutation = useMutation({
    mutationFn: (task: Task) =>
      tasksService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      }),
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_KEY)

      // Optimistycznie przełącz status
      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) => {
        if (!old) return old
        return old.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      })

      return { previousTasks }
    },
    onError: (_err, _task, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(TASKS_KEY, context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })

  // Mutation - usuwanie zadania (optimistic)
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasksService.deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_KEY)

      // Optimistycznie usuń zadanie
      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) => {
        if (!old) return old
        return old.filter((t) => t.id !== id)
      })

      return { previousTasks }
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(TASKS_KEY, context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })

  // Pomocnicze funkcje
  async function addTask(title: string, description?: string | null) {
    await addTaskMutation.mutateAsync({
      title,
      description: description ?? null,
      completed: false,
    })
  }

  async function updateTask(
    id: string,
    title: string,
    description: string | null,
    completed: boolean,
  ) {
    await updateTaskMutation.mutateAsync({
      id,
      task: { title, description, completed },
    })
  }

  async function toggleTask(task: Task) {
    await toggleTaskMutation.mutateAsync(task)
  }

  async function deleteTask(id: string) {
    await deleteTaskMutation.mutateAsync(id)
  }

  // Computed values
  const tasksList = computed(() => tasks.value ?? [])
  const isLoadingTasks = computed(() => isLoading.value)
  const errorMessage = computed(() => error.value?.message ?? null)

  return {
    // State
    tasks: tasksList,
    loading: isLoadingTasks,
    error: errorMessage,
    isError,

    // Mutations
    addTask,
    updateTask,
    toggleTask,
    deleteTask,

    // Dla dostępu do stanu mutacji (np. isPending)
    mutations: {
      add: addTaskMutation,
      update: updateTaskMutation,
      toggle: toggleTaskMutation,
      delete: deleteTaskMutation,
    },
  }
}
