<template>
  <main class="tasks-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left animate-on-load" style="transition-delay: 0s">
        <h1 class="page-title"><span class="title-acc">//</span> TASKS</h1>
        <p class="page-meta" v-if="auth.user">
          user: <span>{{ auth.user.username }}</span>
        </p>
      </div>
      <aside class="stats-row animate-on-load" style="transition-delay: 0.05s">
        <div class="stat">
          <span class="stat-num">{{ stats.total }}</span>
          <span class="stat-label">total</span>
        </div>
        <hr class="stat-divider" />
        <div class="stat">
          <span class="stat-num accent">{{ stats.active }}</span>
          <span class="stat-label">active</span>
        </div>
        <hr class="stat-divider" />
        <div class="stat">
          <span class="stat-num muted">{{ stats.done }}</span>
          <span class="stat-label">done</span>
        </div>
      </aside>
    </header>

    <!-- Add Task -->
    <section
      class="add-task-section animate-on-load"
      style="transition-delay: 0.1s"
      aria-label="Add new task"
    >
      <div class="add-task-form" :class="{ expanded: isAdding }">
        <div class="add-row">
          <input
            v-model="newTitle"
            placeholder="+ add new task..."
            @focus="isAdding = true"
            @keyup.enter="submitTask"
            class="add-input"
          />
          <button
            v-if="isAdding"
            class="btn btn-primary btn-sm"
            @click="submitTask"
            :disabled="!newTitle.trim() || isAddingTask"
          >
            Add
          </button>
          <button v-if="isAdding" class="btn btn-sm" @click="cancelAdd">Cancel</button>
        </div>
        <div v-if="isAdding" class="desc-row">
          <textarea v-model="newDesc" placeholder="Description (optional)" rows="2" />
        </div>
      </div>
    </section>

    <!-- Filters -->
    <nav class="filters animate-on-load" style="transition-delay: 0.15s" aria-label="Task filters">
      <button
        v-for="f in filters"
        :key="f.value"
        class="filter-btn"
        :class="{ active: filter === f.value }"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </nav>

    <!-- Task List -->
    <section
      class="task-list animate-on-load"
      style="transition-delay: 0.2s"
      aria-label="Task list"
    >
      <p v-if="loading" class="empty-state"></p>

      <div v-else-if="filteredTasks.length === 0" class="empty-state">
        <span class="empty-icon">[ ]</span>
        <p>No tasks found.</p>
        <span v-if="filter !== 'all'">Try a different filter.</span>
      </div>

      <TransitionGroup
        name="task"
        tag="ul"
        class="task-list-inner"
        @enter="onEnter"
        @leave="onLeave"
      >
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @toggle="handleToggle(task)"
          @delete="handleDelete(task.id)"
          @edit="(data) => handleEdit(task.id, data.title, data.description, task.completed)"
        />
      </TransitionGroup>
    </section>

    <!-- Error -->
    <output v-if="error" class="error-msg" style="max-width: 700px; margin: 0 auto 1rem">
      {{ error }}
    </output>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTasks } from '../composables/useTasks'
import TaskCard from '../components/TaskCard.vue'
import type { Task } from '../types'

const auth = useAuthStore()
const { tasks, loading, error, addTask, updateTask, toggleTask, deleteTask, mutations } = useTasks()

watch(loading, (newVal) => {
  if (!newVal) {
    // Usuń i dodaj klasę żeby animacja się wykonała
    document.querySelectorAll('.animate-on-load').forEach((el) => {
      el.classList.remove('visible')
    })
    setTimeout(() => {
      document.querySelectorAll('.animate-on-load').forEach((el) => {
        el.classList.add('visible')
      })
    }, 1)
  }
})

const newTitle = ref('')
const newDesc = ref('')
const isAdding = ref(false)
const filter = ref<'all' | 'active' | 'done'>('all')

// Computed
const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((t) => !t.completed)
  if (filter.value === 'done') return tasks.value.filter((t) => t.completed)
  return tasks.value
})

const stats = computed(() => ({
  total: tasks.value.length,
  done: tasks.value.filter((t) => t.completed).length,
  active: tasks.value.filter((t) => !t.completed).length,
}))

const isAddingTask = computed(() => mutations.add.isPending.value)

// Handlers
async function submitTask() {
  if (!newTitle.value.trim()) return
  await addTask(newTitle.value.trim(), newDesc.value.trim() || null)
  newTitle.value = ''
  newDesc.value = ''
  isAdding.value = false
}

function cancelAdd() {
  newTitle.value = ''
  newDesc.value = ''
  isAdding.value = false
}

async function handleToggle(task: Task) {
  await toggleTask(task)
}

async function handleDelete(id: number) {
  await deleteTask(id)
}

async function handleEdit(
  id: number,
  title: string,
  description: string | null,
  completed: boolean,
) {
  await updateTask(id, title, description, completed)
}

// Animation
function onEnter(el: Element, done: () => void) {
  const index = [...(el.parentNode?.children ?? [])].indexOf(el as HTMLElement)
  ;(el as HTMLElement).style.transitionDelay = `${index * 0.05}s`
  el.addEventListener('transitionend', done, { once: true })
}

function onLeave(el: Element, done: () => void) {
  ;(el as HTMLElement).style.transitionDelay = '0s'
  done()
}

const filters: Array<{ value: 'all' | 'active' | 'done'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
]

onMounted(() => {
  if (!loading.value) {
    setTimeout(() => {
      document.querySelectorAll('.animate-on-load').forEach((el) => {
        el.classList.add('visible')
      })
    })
  }
})
</script>

<style scoped>
.animate-on-load {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.animate-on-load.visible {
  opacity: 1;
  transform: translateY(0);
}

.tasks-page {
  max-width: 800px;
  margin: 0 auto;
  padding: clamp(20px, 4vw, 40px) clamp(16px, 5vw, 24px);
  padding-top: 110px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: clamp(12px, 3vw, 16px);
}

.page-title {
  font-family: 'Luckiest Guy', cursive;
  font-size: clamp(28px, 7vw, 35px);
  font-weight: 800;
  letter-spacing: 0.1em;
  line-height: 1;
  margin-bottom: 6px;
}
.title-acc {
  color: rgba(15, 3, 20, 1);
  margin-right: 0.3em;
}

.page-meta {
  font-size: 11.5px;
  color: #a8a8b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.page-meta span {
  color: #c8c8d8;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(8px, 2vw, 16px);
  border-radius: 4px;
  padding: clamp(8px, 2vw, 11px) clamp(12px, 3vw, 19px);
  background: rgba(15, 3, 20, 0.6);
}

.stat {
  text-align: center;
}
.stat-num {
  display: block;
  font-family: 'Luckiest Guy', cursive;
  font-size: clamp(16px, 5vw, 24px);
  font-weight: 800;
  line-height: 1;
}
.stat-num.accent {
  color: #8c64a5;
}
.stat-num.muted {
  color: #a8a8b8;
}
.stat-label {
  font-size: 10.4px;
  color: #a8a8b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(15, 3, 20, 0.5);
  border: none;
  margin: 0;
}

/* Add task */
.add-task-section {
  margin-bottom: 24px;
}
.add-task-form {
  border-radius: 4px;
  background: rgba(15, 3, 20, 0.7);
  overflow: hidden;
  max-height: 60px;
  transition:
    max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.2s ease;
}
.add-task-form.expanded {
  max-height: 200px;
  border-color: #9d88ab;
}
.add-row {
  display: flex;
  gap: 10px;
  padding: 10px;
  align-items: center;
}

.add-input {
  border: none;
  background: transparent;
  font-size: 14px;
  flex: 1;
  padding: 6px 10px;
  transition: all 0.15s;
}
.add-input:focus {
  outline: none;
}

.desc-row {
  padding: 0 10px 10px;
  border-top: 1px solid #8a7498;
  animation: slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.desc-row textarea {
  border: none;
  border-radius: 0;
  background: transparent;
  padding: 10px;
  font-size: 13px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Filters */
.filters {
  display: flex;
  gap: 6px;
  margin-bottom: 19px;
}

.filter-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 6px 14px;
  border: 1px solid #8a7498;
  border-radius: 4px;
  background: transparent;
  color: #a8a8b8;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.25s ease,
    background 0.25s ease,
    transform 0.15s ease;
}
.filter-btn:hover {
  color: #e8e8f0;
  border-color: #9d88ab;
}
.filter-btn:active {
  transform: scale(0.97);
}
.filter-btn.active {
  color: #000;
  border-color: transparent;
  background: #fff;
}

/* Task list */
.task-list {
  min-height: 200px;
}
.task-list-inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 64px 32px;
  color: #a8a8b8;
  font-size: 13px;
}
.empty-icon {
  font-family: 'Luckiest Guy', cursive;
  font-size: 40px;
  font-weight: 800;
  color: #a8a8b8;
  opacity: 0.3;
  letter-spacing: 0.3em;
}

/* TransitionGroup */
.task-enter-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.task-leave-active {
  transition: none;
  transition-delay: 0s !important;
  position: absolute;
  width: 100%;
}
.task-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.task-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.task-move {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 768px) {
  .tasks-page {
    padding-top: 100px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .stats-row {
    justify-content: center;
    width: 100%;
  }

  .stat-divider {
    width: 30px;
    height: 1px;
  }

  .add-input {
    font-size: 13px;
  }

  .filter-btn {
    font-size: 15px;
    padding: 5px 12px;
  }
}

@media (max-width: 480px) {
  .tasks-page {
    padding: clamp(16px, 3vw, 20px) clamp(12px, 3vw, 16px);
    padding-top: 90px;
  }

  .page-title {
    font-size: clamp(24px, 6vw, 28px);
  }

  .page-header {
    margin-bottom: 20px;
  }

  .stats-row {
    gap: 35px;
    padding: 8px 12px;
  }

  .stat-divider {
    display: none;
  }

  .add-task-form {
    border-radius: 4px;
  }

  .add-row {
    flex-direction: column;
    gap: 8px;
  }

  .btn-sm {
    width: 100%;
  }

  .filters {
    overflow-x: auto;
    gap: 4px;
    padding-bottom: 8px;
  }
}
</style>
