<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="content fade-up">
        <div class="error-code">404</div>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist</p>
        <RouterLink to="/" class="btn btn-primary">Go Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.not-found-container {
  position: relative;
  z-index: 10;
}

.content {
  text-align: center;
}

.error-code {
  font-size: 10rem;
  font-weight: 700;
  color: #0f0314;
  margin-bottom: 0;
  transform: translateY(25px);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #e8e8f0;
}

p {
  font-size: 1.1rem;
  color: #c8c8d8;
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  animation: fadeUp 0.6s ease 0.1s both;
}
</style>
