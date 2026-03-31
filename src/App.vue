<template>
  <div class="app-container">
    <NavBar v-if="!['/', '/login', '/register'].includes(route.path)" />
    <div class="router-wrapper">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const route = useRoute()

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
}

.router-wrapper {
  flex: 1;
  overflow-y: auto;
}
</style>
