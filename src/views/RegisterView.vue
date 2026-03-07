<template>
  <div class="auth-page">
    <div class="auth-card fade-up">
      <div class="auth-header">
        <div class="logo-big"><span class="lb">[</span>SYNAPTIX<span class="lb">]</span></div>
        <p class="auth-sub">Create new node</p>
      </div>

      <div class="auth-body">
        <div class="field">
          <label>USERNAME <span class="hint">min 4 chars</span></label>
          <input
            v-model="username"
            type="text"
            placeholder="choose a username"
            autocomplete="username"
          />
        </div>

        <div class="field">
          <label>PASSWORD <span class="hint">min 8 chars</span></label>
          <input
            v-model="password"
            type="password"
            placeholder="choose a password"
            autocomplete="new-password"
          />
        </div>

        <div v-if="auth.error" class="error-msg">{{ auth.error }}</div>

        <button class="btn btn-primary w-full" @click="handleRegister" :disabled="auth.loading">
          <span v-if="auth.loading" class="spinner"></span>
          <span v-else>INITIALIZE ACCOUNT</span>
        </button>

        <div class="auth-footer">
          Already registered?
          <RouterLink to="/login">Login</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

async function handleRegister() {
  if (!username.value || !password.value) return
  const ok = await auth.register(username.value, password.value)
  if (ok) router.push('/tasks')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 5vw, 32px);
  padding-top: 102px;
  position: relative;
  overflow: hidden;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  border: 1px solid #9d88ab;
  border-radius: 8px;
  background: #6b4f7d;
  position: relative;
  z-index: 1;
}
.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: none;
  border-radius: 8px 8px 0 0;
}

.auth-header {
  padding: clamp(24px, 5vw, 40px) clamp(24px, 5vw, 40px) clamp(16px, 4vw, 24px);
  text-align: center;
  border-bottom: 1px solid #8a7498;
}
.logo-big {
  font-family: 'Luckiest Guy', cursive;
  font-size: clamp(24px, 6vw, 32px);
  font-weight: 800;
  letter-spacing: 0.2em;
  color: #e8e8f0;
  margin-bottom: 8px;
}
.lb {
  color: #0f0314;
}
.auth-sub {
  font-size: clamp(10px, 2vw, 12px);
  color: #a8a8b8;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.auth-body {
  padding: clamp(20px, 4vw, 32px) clamp(20px, 5vw, 40px) clamp(24px, 5vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
label {
  font-size: 11px;
  color: #a8a8b8;
  letter-spacing: 0.12em;
  display: flex;
  gap: 8px;
  align-items: center;
}
.hint {
  color: #a8a8b8;
  font-size: 10px;
  opacity: 0.6;
}
.w-full {
  width: 100%;
  justify-content: center;
}

.auth-footer {
  text-align: center;
  font-size: 12.5px;
  color: #a8a8b8;
}
.auth-footer a {
  color: #0f0314;
  text-decoration: none;
  margin-left: 4px;
}
.auth-footer a:hover {
  text-decoration: underline;
}
</style>
