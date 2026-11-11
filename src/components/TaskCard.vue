<template>
  <li class="task-card" :class="{ done: task.completed, editing: isEditing }">
    <!-- View Mode -->
    <template v-if="!isEditing">
      <div class="task-left">
        <button class="check-btn" @click="$emit('toggle')" :aria-pressed="task.completed" :title="task.completed ? 'Mark active' : 'Mark done'">
          <span class="check-inner" :class="{ checked: task.completed }">
            <svg v-if="task.completed" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <polyline points="2,6 5,9 10,3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>

        <article class="task-content">
          <strong class="task-title" :class="{ striked: task.completed }">{{ task.title }}</strong>
          <p v-if="task.description" class="task-desc">{{ task.description }}</p>
          <footer class="task-meta">
            <span class="tag" :class="task.completed ? 'tag-done' : 'tag-active'">
              {{ task.completed ? 'done' : 'active' }}
            </span>
            <time class="task-date" :datetime="task.dateCreated ?? ''">{{ formatDate(task.dateCreated) }}</time>
          </footer>
        </article>
      </div>

      <menu class="task-actions">
        <li>
          <button class="action-btn edit" @click="startEdit" title="Edit">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </li>
        <li>
          <button class="action-btn del" @click="$emit('delete')" title="Delete">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 4h10M6 4V3h4v1M5 4v9h6V4H5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </li>
      </menu>
    </template>

    <!-- Edit Mode -->
    <template v-else>
      <div class="edit-form">
        <input v-model="editTitle" aria-label="Edytuj tytuł zadania" placeholder="Task title" ref="titleInput" />
        <textarea v-model="editDesc" aria-label="Edytuj opis zadania" placeholder="Description (optional)" rows="2" />
        <div class="edit-actions">
          <button class="btn btn-primary btn-sm" @click="saveEdit">Save</button>
          <button class="btn btn-sm" @click="cancelEdit">Cancel</button>
        </div>
      </div>
    </template>
  </li>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['toggle', 'delete', 'edit'])

const isEditing = ref(false)
const editTitle = ref('')
const editDesc = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

function startEdit() {
  editTitle.value = props.task.title
  editDesc.value = props.task.description || ''
  isEditing.value = true
  nextTick(() => titleInput.value?.focus())
}

function cancelEdit() {
  isEditing.value = false
}

function saveEdit() {
  if (!editTitle.value.trim()) return
  emit('edit', { title: editTitle.value.trim(), description: editDesc.value.trim() || null })
  isEditing.value = false
}

function formatDate(d: string | null | undefined) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<style scoped>
.task-card {
  border-radius: 4px;
  padding: 16px 19px;
  background: rgba(15, 3, 20, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  transition: none;
}
.task-card:hover {
  background: rgba(15, 3, 20, 0.85);
}
.task-card.done {
  opacity: 0.55;
}

.task-card:last-child {
  margin-bottom: 17px;
}

.task-left {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.check-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  margin-top: 2px;
}

.check-inner {
  width: 18px;
  height: 18px;
  border: 1.5px solid #9d88ab;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #523a5c;
}
.check-inner:hover {
  border-color: #8c64a5;
}
.check-inner.checked {
  background: #8c64a5;
}
.check-inner svg {
  width: 10px;
  height: 10px;
}

.task-content {
  flex: 1;
  min-width: 0;
}
.task-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  color: #e8e8f0;
  font-weight: 500;
  white-space: normal;
  word-break: break-word;
  overflow: hidden;
  margin: 0;
}
.task-title.striked {
  text-decoration: line-through;
  color: #a8a8b8;
}

.task-desc {
  font-size: 14px;
  color: #c8c8d8;
  margin-top: 4px;
  margin-bottom: 0;
  overflow: hidden;
  word-break: break-word;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 8px;
}

.task-date {
  font-size: 10.5px;
  color: #a8a8b8;
}

.task-actions {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.action-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px;
  color: #a8a8b8;
  display: flex;
  align-items: center;
}
.action-btn svg {
  width: 14px;
  height: 14px;
}
.action-btn.edit:hover {
  color: #fff;
  border-color: #ccc;
  background: rgba(79, 255, 223, 0.05);
}
.action-btn.del:hover {
  color: #ff6eab;
  border-color: rgba(255, 110, 171, 0.3);
  background: rgba(255, 110, 171, 0.05);
}

.edit-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.edit-actions {
  display: flex;
  gap: 8px;
}

.edit,
.del {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .edit,
  .del {
    transform: scale(1.5);
  }

  .task-card:hover {
    background: rgba(15, 3, 20, 0.5);
  }
}
</style>
