<template>
  <div class="page-preloader" id="page-preloader"></div>

  <main class="welcome-page">
    <div class="welcome-container">
      <header class="welcome-left">
        <img src="/Synaptix.png" alt="Synaptix Logo" style="transition-delay: 0.05s" />
        <h1 class="welcome-title animate-on-load" style="transition-delay: 0.1s">Synaptix</h1>
        <h2 class="welcome-subtitle animate-on-load" style="transition-delay: 0.2s">Tasks</h2>
      </header>

      <div class="welcome-right">
        <div class="welcome-content animate-on-load" style="transition-delay: 0.2s">
          <p class="welcome-desc">
            Organize your thoughts and manage your tasks efficiently. Stay productive with our
            intuitive task management system designed to help you achieve your goals.
          </p>

          <section class="features-section">
            <h2 class="features-title">What can you do?</h2>
            <div class="features-grid">
              <article class="feature-card animate-on-load" style="transition-delay: 0.3s">
                <div class="feature-icon">📝</div>
                <h3>Create Tasks</h3>
                <p>Organize your ideas and create tasks with ease</p>
              </article>
              <article class="feature-card animate-on-load" style="transition-delay: 0.4s">
                <div class="feature-icon">✓</div>
                <h3>Track Progress</h3>
                <p>Monitor task completion and stay on top of deadlines</p>
              </article>
              <article class="feature-card animate-on-load" style="transition-delay: 0.5s">
                <div class="feature-icon">⚡</div>
                <h3>Boost Productivity</h3>
                <p>Streamline your workflow and maximize efficiency</p>
              </article>
            </div>
          </section>

          <nav class="welcome-actions animate-on-load" style="transition-delay: 0.6s">
            <RouterLink to="/login" class="btn btn-primary">Get Started</RouterLink>
            <RouterLink to="/register" class="btn btn-secondary">Create Account</RouterLink>
          </nav>
        </div>
      </div>
    </div>
    <footer class="allfoot">
      <p class="welcome-footer animate-on-load" style="margin-top: 50px; transition-delay: 0.9s">
        Synaptix © 2026
      </p>
      <p class="welcome-footer animate-on-load" style="transition-delay: 0.95s">
        Created by <a href="https://linktr.ee/mxzy1" target="_blank">mxzy</a> &
        <a href="https://github.com/xaviq86" target="_blank">xaviq</a>
      </p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const nextTwoFrames = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )

onMounted(async () => {
  const preloader = document.getElementById('page-preloader') as HTMLElement | null
  const img = document.querySelector('.welcome-left img') as HTMLElement | null
  const welcomeLeft = document.querySelector('.welcome-left') as HTMLElement | null

  if (!preloader || !img || !welcomeLeft) return

  preloader.appendChild(img)
  img.style.cssText = `
    opacity: 1;
    transform: none;
    max-height: 100px;
    border-radius: 40px;
    transition: none;
    position: relative;
  `

  await wait(600)

  const fromRect = img.getBoundingClientRect()

  welcomeLeft.setAttribute('style', 'transform: none !important; transition: none !important;')
  welcomeLeft.prepend(img)
  img.style.cssText = ''

  void welcomeLeft.offsetHeight

  const toRect = img.getBoundingClientRect()

  welcomeLeft.removeAttribute('style')

  const dx = fromRect.left - toRect.left + (fromRect.width - toRect.width) / 2
  const dy = fromRect.top - toRect.top + (fromRect.height - toRect.height) / 2
  const scaleX = fromRect.width / toRect.width
  const scaleY = fromRect.height / toRect.height

  img.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`
  img.style.transition = 'none'
  img.style.opacity = '1'

  preloader.classList.add('done')
  await wait(400)
  preloader.remove()

  await wait(100)
  await nextTwoFrames()

  img.style.transition = 'transform 0.8s ease, opacity 0.6s ease'
  img.style.transform = ''
  img.style.opacity = ''

  await wait(550)
  document.querySelectorAll('.animate-on-load').forEach((el) => el.classList.add('visible'))

  await wait(800)
  img.style.cssText = ''
})
</script>

<style scoped>
.page-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0f0314;
  color: #6b4f7d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  z-index: 9999;
  opacity: 1;
  visibility: visible;
  transition:
    background-color 0.4s ease,
    visibility 0s ease 0.4s;
}

.done {
  background-color: transparent;
  visibility: hidden;
  pointer-events: none;
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

.welcome-page {
  min-height: 100vh;
  background: linear-gradient(
    -230deg,
    transparent 0%,
    transparent 50%,
    #0f0314 50.1%,
    #0f0314 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.welcome-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  width: 100%;
  max-width: 80%;
  align-items: center;
  justify-content: center;
}

.welcome-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.welcome-left img {
  position: relative;
  top: auto;
  left: auto;
  transform: none;
  max-height: 250px;
  z-index: 1;
  border-radius: 40px;
  margin-bottom: 1.5%;
}

.welcome-title {
  font-size: clamp(32px, 18vw, 190px);
  font-weight: 900;
  color: #e8e8f0;
  font-family: 'Luckiest Guy', cursive;
  margin: 0;
  line-height: 1;
  mix-blend-mode: difference;
}

.welcome-subtitle {
  color: #d4d4e0;
  font-size: clamp(24px, 8vw, 60px);
  font-weight: 600;
  margin: 0;
  line-height: 0;
  margin-top: -5px;
  font-family: 'Poppins', sans-serif;
}

.welcome-right {
  color: #c8c8d8;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transform: translate(11%, 22%);
}

.welcome-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.welcome-content.visible {
  transform: translateY(0) !important;
}

.welcome-desc {
  font-size: 18px;
  line-height: 1.8;
  color: #d4d4e0;
  margin: 0;
  max-width: none;
}

.features-section {
  margin: 20px 0;
}

.features-title {
  font-size: 24px;
  font-weight: 600;
  color: #e8e8f0;
  margin: 0 0 20px 0;
  font-family: 'Poppins', sans-serif;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition:
    opacity 0.6s ease,
    transform 0.6s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  background: rgba(107, 79, 125, 0.15);
  box-shadow: 0 8px 24px rgba(107, 79, 125, 0.2);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #e8e8f0;
  margin: 0 0 8px 0;
}

.feature-card p {
  font-size: 14px;
  color: #b8b8c8;
  margin: 0;
  line-height: 1.5;
}

.welcome-actions {
  display: flex;
  gap: 16px;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 20px;
}

.btn {
  padding: 14px 36px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background: #6b4f7d;
  color: white;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background: #8c64a5;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px #6b4f7d;
}

.btn-secondary {
  background: transparent;
  color: #6b4f7d;
  border: 2px solid #6b4f7d;
}

.btn-secondary:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px #b772e2;
}

.allfoot {
  transform: translateY(80px);
  text-align: center;
}

.welcome-footer {
  font-size: 14px;
  color: #a8a8b8;
  margin-top: 10px;
  margin-bottom: 0;
}

a {
  color: #fff;
  text-decoration: underline;
}

@media (max-width: 1350px) {
  .welcome-container {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: -40px 20px;
  }

  .welcome-left {
    transform: rotate(0deg);
  }

  .welcome-left.visible {
    transform: rotate(0deg) !important;
  }

  .welcome-right {
    transform: none;
  }

  .welcome-left img {
    max-height: 375px;
    margin-bottom: 20px;
  }

  .welcome-title {
    font-size: clamp(28px, 10vw, 80px);
    margin-right: 0;
    line-height: 0.95;
  }

  .welcome-subtitle {
    font-size: clamp(24px, 8vw, 40px);
  }

  .welcome-desc {
    font-size: 22px;
  }

  .allfoot {
    transform: none;
  }
}

@media (max-width: 768px) {
  .welcome-page {
    padding: 20px 0px;
    min-height: auto;
  }

  .welcome-container {
    gap: 30px;
  }

  .welcome-left {
    transform: rotate(0deg);
  }

  .welcome-left.visible {
    transform: rotate(0deg) !important;
  }

  .welcome-right {
    transform: none;
  }

  .welcome-left img {
    max-height: 350px;
    margin-bottom: 10px;
  }

  .welcome-title {
    font-size: 60px;
    line-height: 1.3;
  }

  .welcome-desc {
    font-size: 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .features-title {
    font-size: 205x;
  }

  .welcome-actions {
    justify-content: center;
    gap: 12px;
  }

  .feature-icon {
    font-size: 34px;
  }

  .feature-card h3 {
    font-size: 18px;
  }

  .feature-card p {
    font-size: 16px;
  }

  .btn {
    width: 100%;
    padding: 12px 24px;
    font-size: 18px;
  }

  .allfoot {
    transform: none;
  }
}

@media (max-width: 480px) {
  .welcome-page {
    padding: 24px -10px;
  }

  .welcome-left {
    transform: rotate(0deg);
  }

  .welcome-left.visible {
    transform: rotate(0deg) !important;
  }

  .welcome-right {
    transform: none;
  }

  .welcome-left img {
    max-height: 70vw;
    margin-bottom: 5px;
  }

  .welcome-title {
    font-size: 12vw;
    line-height: 1.3;
  }

  .welcome-subtitle {
    font-size: clamp(30px, 40px);
  }

  .welcome-desc {
    font-size: 4.5vw;
  }

  .features-title {
    font-size: 22px;
  }

  .feature-card {
    padding: 16px;
  }

  .feature-card h3 {
    font-size: 18px;
  }

  .feature-card p {
    font-size: 16px;
  }

  .feature-icon {
    font-size: 30px;
  }

  .btn {
    font-size: 17px;
  }

  .allfoot {
    transform: none;
  }
}
</style>
