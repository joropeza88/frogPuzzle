<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden z-40">
    <span
      v-for="bug in bugs"
      :key="bug.id"
      class="firefly"
      :style="bug.style"
    >
      <span class="glow"></span>
    </span>
  </div>
</template>

<script setup lang="ts">
const bugs = Array.from({ length: 5 }, (_, index) => ({
  id: index,
  style: {
    left: `${10 + Math.random() * 80}%`,
    top: `${10 + Math.random() * 80}%`,
    animationDuration: `${12 + Math.random() * 8}s`,
    animationDelay: `${Math.random() * 6}s`,
    '--size': `${6 + Math.random() * 4}px`,
    '--glow': `${12 + Math.random() * 10}px`,
    '--dx1': `${-80 + Math.random() * 160}px`,
    '--dy1': `${-60 + Math.random() * 120}px`,
    '--dx2': `${-120 + Math.random() * 240}px`,
    '--dy2': `${-100 + Math.random() * 200}px`
  }
}));
</script>

<style scoped>
.firefly {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 9999px;
  background: radial-gradient(circle, #fff7b8 0%, #f6e86e 45%, #d6b800 100%);
  animation: wander linear infinite;
  will-change: transform, opacity;
}

.glow {
  position: absolute;
  inset: 50%;
  width: var(--glow);
  height: var(--glow);
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(255, 248, 180, 0.7) 0%,
    rgba(255, 235, 120, 0.28) 45%,
    transparent 72%
  );
  animation: blink 2.4s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(0.7);
  }

  35% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.15);
  }

  60% {
    opacity: 0.45;
    transform: translate(-50%, -50%) scale(0.9);
  }
}

@keyframes wander {
  0% {
    transform: translate3d(0, 0, 0);
  }

  25% {
    transform: translate3d(var(--dx1), var(--dy1), 0);
  }

  50% {
    transform: translate3d(calc(var(--dx1) * -0.35), calc(var(--dy1) * 0.5), 0);
  }

  75% {
    transform: translate3d(var(--dx2), var(--dy2), 0);
  }

  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>