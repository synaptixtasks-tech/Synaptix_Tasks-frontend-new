<template>
  <nav class="navbar animate-on-load">
    <RouterLink to="/" class="logo">
      <span class="logo-text"><img src="/Synaptix.png" alt="" /></span>
    </RouterLink>

    <div class="nav-links" v-if="!isAuthPage">
      <!-- Authenticated user nav -->
      <template v-if="auth.token">
        <RouterLink to="/tasks" class="nav-link" :class="{ active: $route.path === '/tasks' }">
          Tasks
        </RouterLink>
        <RouterLink to="/profile" class="nav-link" :class="{ active: $route.path === '/profile' }">
          Profile
        </RouterLink>
        <button class="btn btn-sm btn-ghost" @click="handleLogout">Logout</button>
      </template>

      <!-- Unauthenticated user nav -->
      <!-- <template v-else>
        <RouterLink to="/login" class="btn btn-sm btn-primary">Login</RouterLink>
        <RouterLink to="/register" class="btn btn-sm btn-secondary">Register</RouterLink>
      </template> -->
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const showNavbar = ref(false)

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

const isWelcomePage = computed(() => {
  return route.path === '/'
})

onMounted(() => {
  if (isWelcomePage.value) {
    setTimeout(() => {
      showNavbar.value = true
    }, 1000)
  } else {
    showNavbar.value = true
  }
})

function handleLogout() {
  auth.logout()
  router.push('/login')
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
  transform: translateY(-100%);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.animate-on-load.visible {
  opacity: 1;
  transform: translateY(0);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 3, 20, 1);
  backdrop-filter: blur(35px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  border: none;
  z-index: 100;
  opacity: 1;
  padding: 0 clamp(12px, 3vw, 20px);
  min-height: 70px;
}

.logo {
  text-decoration: none;
  font-family: 'Luckiest Guy', cursive;
  font-size: clamp(14px, 3vw, 17px);
  font-weight: 800;
  letter-spacing: 0.15em;
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.logo-bracket {
  color: #8c64a5;
}
.logo-text {
  color: #e8e8f0;
  width: clamp(50px, 10vw, 70px);
  height: clamp(50px, 10vw, 70px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(4px, 1vw, 8px);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-link {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(15px, 2vw, 12.5px);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #c8c8d8;
  text-decoration: none;
  padding: clamp(4px, 1vw, 6px) clamp(8px, 2vw, 13px);
  border-radius: 4px;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.active {
  color: #8c64a5;
  background: rgba(127, 255, 110, 0.06);
}

@media (max-width: 640px) {
  .nav-link {
    padding: 4px 8px;
  }
}
</style>
