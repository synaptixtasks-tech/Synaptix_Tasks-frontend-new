<template>
  <main class="auth-page animate-on-load">
    <article class="auth-card fade-up">
      <header class="auth-header">
        <div class="logo-big"><span class="lb">[</span>SYNAPTIX Tasks<span class="lb">]</span></div>
        <p class="auth-sub">LOGIN</p>
      </header>

      <section class="auth-body animate-on-load" style="animation-delay: 0.3s">
        <form @submit.prevent="handleLogin" novalidate>
          <fieldset>
            <div class="field">
              <label for="username">USERNAME</label>
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="enter username"
                @keyup.enter="handleLogin"
                autocomplete="username"
              />
            </div>

            <div class="field">
              <label for="password">PASSWORD</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="enter password"
                  @keyup.enter="handleLogin"
                  autocomplete="current-password"
                />
                <button
                  class="eye-btn"
                  @click="showPassword = !showPassword"
                  type="button"
                  tabindex="-1"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <svg
                    v-if="!showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>
              </div>
            </div>
          </fieldset>

          <output v-if="auth.error" class="error-msg" role="alert">{{ auth.error }}</output>

          <button class="btn btn-primary logre w-full" type="submit" :disabled="auth.loading">
            <span v-if="auth.loading">CONNECTING...</span>
            <span v-else>ACCESS SYSTEM</span>
          </button>
        </form>

        <footer class="auth-footer">
          No account yet?
          <RouterLink to="/register">Register</RouterLink>
        </footer>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) return
  const ok = await auth.login(username.value, password.value)
  if (ok) router.push('/tasks')
}

setTimeout(() => {
  document.querySelectorAll('.animate-on-load').forEach((el) => {
    el.classList.add('visible')
  })
}, 50)
</script>

<style scoped>
* {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

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
  max-width: 480px;
  border-radius: 8px;
  background: rgba(15, 3, 20, 0.5);
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
  position: relative;
}

.logo-big::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    hsl(274deg 81% 22%) 0%,
    hsl(302deg 99% 19%) 13%,
    hsl(319deg 94% 24%) 27%,
    hsl(341deg 68% 37%) 42%,
    hsl(14deg 61% 49%) 60%,
    hsl(41deg 87% 45%) 100%
  );
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

form {
  display: flex;
  flex-direction: column;
  gap: 19px;
}

fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input:focus,
textarea:focus {
  border: 1px solid #8a7498;
  color: #fff;
  transform: scale(1.05);
}

label {
  font-size: 11px;
  color: #a8a8b8;
  letter-spacing: 0.12em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding-right: 42px;
}

.eye-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a8a8b8;
  transition: all 0.2s ease;
  outline: none;
}

.eye-btn:hover {
  color: #e8e8f0;
}

.eye-btn svg {
  width: 17px;
  height: 17px;
}

output.error-msg {
  display: block;
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
  color: #fff;
  text-decoration: none;
  margin-left: 4px;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
