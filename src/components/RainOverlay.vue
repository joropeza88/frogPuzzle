<template>
  <div class="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
    <div
      v-for="drop in drops"
      :key="drop.id"
      class="drizzle-wrap"
      :style="drop.style"
    >
      <span class="drizzle-drop"></span>
      <span class="drizzle-ripple"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
const drops = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  style: {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2.5}s`,
    animationDuration: `${1.8 + Math.random() * 1.6}s`,
    '--drift': `${-6 + Math.random() * 12}px`,
    '--ripple-size': `${18 + Math.random() * 14}px`
  }
}));
</script>

<style scoped>
.drizzle-wrap {
  position: absolute;
  top: -3rem;
  width: 1px;
  height: 100vh;
  animation-name: drizzle-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.drizzle-drop {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 16px;
  transform: translateX(-50%);
  border-radius: 9999px;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0.9)
  );
  box-shadow: 0 0 6px rgba(255,255,255,0.35);
}

.drizzle-ripple {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: var(--ripple-size);
  height: calc(var(--ripple-size) * 0.42);
  transform: translate(-50%, 0) scale(0.2);
  border: 1.5px solid rgba(255,255,255,0.55);
  border-radius: 9999px;
  opacity: 0;
  filter: blur(0.3px);
  animation: drizzle-ripple 3s linear infinite;
}

@keyframes drizzle-fall {
  0% {
    transform: translate3d(0, -12vh, 0);
  }

  82% {
    transform: translate3d(var(--drift), 92vh, 0);
  }

  100% {
    transform: translate3d(var(--drift), 110vh, 0);
  }
}

@keyframes drizzle-ripple {
  0%, 78% {
    opacity: 0;
    transform: translate(-50%, 0) scale(0.2);
  }

  82% {
    opacity: 0.65;
    transform: translate(-50%, 0) scale(0.45);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, 0) scale(1);
  }
}
</style>