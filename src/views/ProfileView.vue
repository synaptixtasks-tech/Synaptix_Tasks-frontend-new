<template>
  <div class="profile-page">
    <div class="page-header animate-on-load" style="transition-delay: 0s">
      <h1 class="page-title"><span class="title-acc">//</span> PROFILE</h1>
    </div>

    <div class="cards-grid">
      <!-- User Info Card -->
      <div class="card animate-on-load" style="transition-delay: 0.1s">
        <div class="card-label">USER NODE</div>
        <div class="user-id">
          <span class="uid-hash">#{{ auth.user?.id?.toString().padStart(4, '0') || '---' }}</span>
          <span class="uid-name">{{ auth.user?.username || '...' }}</span>
        </div>

        <div class="user-stats">
          <div class="us-item">
            <span class="us-val">{{ tasksStore.stats.total }}</span>
            <span class="us-key">tasks</span>
          </div>
          <div class="us-item">
            <span class="us-val accent">{{ tasksStore.stats.active }}</span>
            <span class="us-key">active</span>
          </div>
          <div class="us-item">
            <span class="us-val muted">{{ tasksStore.stats.done }}</span>
            <span class="us-key">done</span>
          </div>
        </div>
      </div>

      <!-- Update Credentials -->
      <div class="card animate-on-load" style="transition-delay: 0.2s">
        <div class="card-label">UPDATE CREDENTIALS</div>

        <div class="field">
          <label>NEW USERNAME</label>
          <input v-model="newUsername" type="text" placeholder="username" />
        </div>
        <div class="field">
          <label>NEW PASSWORD</label>
          <input v-model="newPassword" type="password" placeholder="password" />
        </div>

        <div v-if="updateError" class="error-msg">{{ updateError }}</div>
        <div v-if="updateSuccess" class="success-msg">Credentials updated.</div>

        <button class="btn btn-primary btn-sm" @click="handleUpdate" :disabled="updateLoading">
          <span v-if="updateLoading" class="spinner"></span>
          <span v-else>Update</span>
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="card danger-card animate-on-load" style="transition-delay: 0.3s">
        <div class="card-label danger">DANGER ZONE</div>
        <p class="danger-text">
          Permanently delete your account and all associated tasks. This action cannot be undone.
        </p>

        <div v-if="!confirmDelete">
          <button class="btn btn-danger btn-sm" @click="confirmDelete = true">
            Delete Account
          </button>
        </div>
        <div v-else class="confirm-row">
          <span class="confirm-text">Are you sure?</span>
          <button class="btn btn-danger btn-sm" @click="handleDelete">Yes, delete</button>
          <button class="btn btn-sm" @click="confirmDelete = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTasksStore } from '../stores/tasks'
import { authService } from '../services/authService'

const auth = useAuthStore()
const tasksStore = useTasksStore()
const router = useRouter()

const newUsername = ref('')
const newPassword = ref('')
const updateLoading = ref(false)
const updateError = ref<string | null>(null)
const updateSuccess = ref(false)
const confirmDelete = ref(false)

onMounted(() => {
  if (tasksStore.tasks.length === 0) tasksStore.fetchTasks()
})

async function handleUpdate() {
  if (!newUsername.value || !newPassword.value) {
    updateError.value = 'Both fields required'
    return
  }
  updateLoading.value = true
  updateError.value = null
  updateSuccess.value = false
  try {
    await authService.updateAccount(newUsername.value, newPassword.value)
    await auth.fetchUser()
    updateSuccess.value = true
    newUsername.value = ''
    newPassword.value = ''
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e))
    updateError.value = error.message || 'Update failed'
    console.error('Update error:', error)
  } finally {
    updateLoading.value = false
  }
}

async function handleDelete() {
  try {
    await authService.deleteAccount()
    auth.logout()
    router.push('/login')
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e))
    updateError.value = error.message || 'Delete failed'
    console.error('Delete error:', error)
    confirmDelete.value = false
  }
}

setTimeout(() => {
  document.querySelectorAll('.animate-on-load').forEach((el) => {
    el.classList.add('visible')
  })
}, 50)
</script>

<style scoped>
.animate-on-load {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.animate-on-load.visible {
  opacity: 1;
  transform: translateY(0);
}

.profile-page {
  max-width: 760px;
  margin: 0 auto;
  padding: clamp(20px, 4vw, 40px) clamp(16px, 5vw, 24px);
  padding-top: 110px;
}

.page-header {
  margin-bottom: 10px;
}
.page-title {
  font-family: 'Luckiest Guy', cursive;
  font-size: clamp(28px, 7vw, 35px);
  font-weight: 800;
  letter-spacing: 0.1em;
}
.title-acc {
  color: #0f0314;
  margin-right: 0.3em;
}

.cards-grid {
  display: grid;
  gap: 19px;
}

.card {
  border-radius: 4px;
  background: rgba(15, 3, 20, 0.5);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-label {
  font-size: 10.4px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #a8a8b8;
  padding-bottom: 13px;
  border-bottom: 1px solid #8a7498;
}
.card-label.danger {
  color: #ff6eab;
}

/* User ID */
.user-id {
  display: flex;
  align-items: baseline;
  gap: 13px;
}
.uid-hash {
  font-family: 'Poppins', sans-serif;
  font-size: 11.5px;
  color: #a8a8b8;
  background: #7d5f8f;
  padding: 3px 10px;
  border-radius: 2px;
  border: 1px solid #8a7498;
}
.uid-name {
  font-family: 'Luckiest Guy', cursive;
  font-size: 25.6px;
  font-weight: 700;
  color: #e8e8f0;
}

.user-stats {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(20px, 5vw, 32px);
}
.us-item {
  display: flex;
  flex-direction: column;
}
.us-val {
  font-family: 'Luckiest Guy', cursive;
  font-size: 28.8px;
  font-weight: 800;
  line-height: 1;
}
.us-val.accent {
  color: #8c64a5;
}
.us-val.muted {
  color: #a8a8b8;
}
.us-key {
  font-size: 10.4px;
  color: #a8a8b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 2px;
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
label {
  font-size: 11px;
  color: #a8a8b8;
  letter-spacing: 0.12em;
}

/* Success */
.success-msg {
  font-size: 12.5px;
  color: #0f0314;
  padding: 10px 16px;
  border: 1px solid rgba(127, 255, 110, 0.25);
  border-radius: 4px;
  background: rgba(127, 255, 110, 0.05);
}

/* Danger */
.danger-card {
  border-color: rgba(255, 110, 171, 0.2);
}
.danger-text {
  font-size: 13px;
  color: #c8c8d8;
  line-height: 1.7;
}
.confirm-row {
  display: flex;
  align-items: center;
  gap: 13px;
}
.confirm-text {
  font-size: 12.5px;
  color: #ff6eab;
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 100px;
  }

  .page-title {
    font-size: clamp(24px, 6vw, 28px);
  }

  .cards-grid {
    gap: 16px;
  }

  .card {
    padding: 20px;
  }

  .user-stats {
    gap: clamp(16px, 4vw, 24px);
  }

  .us-val {
    font-size: clamp(20px, 5vw, 28px);
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: clamp(16px, 3vw, 20px) clamp(12px, 3vw, 16px);
    padding-top: 90px;
  }

  .page-title {
    font-size: clamp(22px, 5vw, 24px);
  }

  .cards-grid {
    gap: 12px;
  }

  .card {
    padding: 16px;
    gap: 12px;
  }

  .card-label {
    font-size: 9px;
    padding-bottom: 10px;
  }

  .user-id {
    flex-direction: column;
    gap: 8px;
  }

  .uid-name {
    font-size: clamp(20px, 5vw, 25px);
  }

  .user-stats {
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .us-item {
    width: 100%;
    text-align: center;
  }

  .us-val {
    font-size: clamp(18px, 4vw, 24px);
  }

  .field {
    gap: 4px;
  }

  .button {
    width: 100%;
  }

  .confirm-row {
    flex-direction: column;
    gap: 8px;
  }

  .btn-sm {
    width: 100%;
  }
}
</style>
