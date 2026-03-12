<template>
  <main class="profile-page">
    <header class="page-header animate-on-load" style="transition-delay: 0s">
      <h1 class="page-title"><span class="title-acc">//</span> PROFILE</h1>
    </header>

    <section class="cards-grid">
      <!-- User Info Card -->
      <article class="card animate-on-load" style="transition-delay: 0.1s">
        <h2 class="card-label">USER NODE</h2>
        <span class="username">{{ auth.user?.username || '...' }}</span>

        <dl class="user-stats">
          <div class="us-item">
            <dd class="us-val">{{ tasksStore.stats.total }}</dd>
            <dt class="us-key">tasks</dt>
          </div>
          <div class="us-item">
            <dd class="us-val accent">{{ tasksStore.stats.active }}</dd>
            <dt class="us-key">active</dt>
          </div>
          <div class="us-item">
            <dd class="us-val muted">{{ tasksStore.stats.done }}</dd>
            <dt class="us-key">done</dt>
          </div>
        </dl>
      </article>

      <!-- Update Credentials -->
      <article class="card animate-on-load" style="transition-delay: 0.2s">
        <h2 class="card-label">UPDATE CREDENTIALS</h2>

        <div class="field">
          <label for="new-username">NEW USERNAME</label>
          <input id="new-username" v-model="newUsername" type="text" placeholder="username" />
        </div>
        <div class="field">
          <label for="new-password">NEW PASSWORD</label>
          <input id="new-password" v-model="newPassword" type="password" placeholder="password" />
        </div>

        <output v-if="updateError" class="error-msg" role="alert">{{ updateError }}</output>
        <output v-if="updateSuccess" class="success-msg" role="status">Credentials updated.</output>

        <button class="btn btn-primary btn-sm upgb" @click="handleUpdate" :disabled="updateLoading">
          <span v-if="updateLoading" class="spinner" aria-hidden="true"></span>
          <span v-else>Update</span>
        </button>
      </article>

      <!-- Danger Zone -->
      <article class="card danger-card animate-on-load" style="transition-delay: 0.3s">
        <h2 class="card-label danger">DANGER ZONE</h2>
        <p class="danger-text">
          Permanently delete your account and all associated tasks. This action cannot be undone.
        </p>

        <div v-if="!confirmDelete">
          <button class="btn btn-danger btn-sm" @click="confirmDelete = true">
            Delete Account
          </button>
        </div>
        <div v-else class="confirm-row" role="group" aria-label="Confirm account deletion">
          <strong class="confirm-text">Are you sure?</strong>
          <button class="btn btn-danger btn-sm" @click="handleDelete">Yes, delete</button>
          <button class="btn btn-sm" @click="confirmDelete = false">Cancel</button>
        </div>
      </article>
    </section>
  </main>
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
}, 5)
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
  font-size: 40px;
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
  font-size: 12px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #a8a8b8;
  padding-bottom: 13px;
  border-bottom: 1px solid #8a7498;
  margin: 0;
}
.card-label.danger {
  color: #ff6eab;
}

.username {
  font-family: 'Luckiest Guy', cursive;
  font-size: 25.6px;
  font-weight: 700;
  color: #e8e8f0;
}

.user-stats {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(20px, 5vw, 32px);
  margin: 0;
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
  margin: 0;
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
  display: block;
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
  font-weight: normal;
}

/* @media (max-width: 768px) {
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
} */

@media (max-width: 480px) {
  .profile-page {
    padding: clamp(16px, 3vw, 20px) clamp(12px, 3vw, 16px);
    padding-top: 90px;
  }

  .page-title {
    font-size: 35px;
  }

  .cards-grid {
    gap: 12px;
  }

  .card {
    padding: 16px;
    gap: 12px;
  }

  /* .user-id {
    gap: 8px;
  }

  .uid-name {
    font-size: clamp(20px, 5vw, 25px);
  }

  .user-stats {
    gap: 16px;
    width: 100%;
  }

  .us-item {
    text-align: center;
  }

  .us-val {
    font-size: clamp(18px, 4vw, 24px);
  }

  .field {
    gap: 4px;
  } */

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
