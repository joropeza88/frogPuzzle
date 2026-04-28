<template>
  <div class="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
    <span
      v-for="drop in drops"
      :key="drop.id"
      class="rain-drop"
      :style="drop.style"
    />
  </div>
</template>

<script setup lang="ts">
const drops = Array.from({ length: 80 }, (_, index) => ({
  id: index,
  style: {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 1.8}s`,
    animationDuration: `${0.65 + Math.random() * 0.75}s`,
    opacity: `${0.25 + Math.random() * 0.45}`,
    height: `${14 + Math.random() * 28}px`
  }
}));
</script>

<style scoped>
.rain-drop {
  position: absolute;
  top: -3rem;
  width: 2px;
  border-radius: 9999px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.85)
  );
  animation-name: rain-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  filter: blur(0.2px);
}

@keyframes rain-fall {
  0% {
    transform: translate3d(0, -10vh, 0);
  }

  100% {
    transform: translate3d(-18px, 115vh, 0);
  }
}
</style>