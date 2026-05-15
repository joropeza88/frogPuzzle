<template>
  <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div
      v-for="burst in bursts"
      :key="burst.id"
      class="screen-wave-burst"
      :class="{ 'screen-wave-burst-active': burst.isActive }"
      :style="burst.style"
    >
      <span class="screen-wave-ring screen-wave-ring-primary"></span>
      <span class="screen-wave-ring screen-wave-ring-secondary"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type WaveBurst = {
  id: number;
  isActive: boolean;
  style: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
};

const bursts = ref<WaveBurst[]>([
  createBurst(0),
  createBurst(1),
  createBurst(2)
]);

let loopFrameId = 0;
let nextBurstAt = 0;
let nextBurstIndex = 0;

function randomBurstStyle() {
  const size = 8 + Math.random() * 4.5;

  return {
    left: `${18 + Math.random() * 64}%`,
    top: `${14 + Math.random() * 72}%`,
    width: `${size}rem`,
    height: `${size}rem`
  };
}

function createBurst(id: number): WaveBurst {
  return {
    id,
    isActive: false,
    style: randomBurstStyle()
  };
}

function triggerBurst() {
  const burst = bursts.value[nextBurstIndex];

  burst.isActive = false;
  burst.style = randomBurstStyle();

  window.requestAnimationFrame(() => {
    burst.isActive = true;
  });

  nextBurstIndex = (nextBurstIndex + 1) % bursts.value.length;
}

function animationLoop(now: number) {
  if (!nextBurstAt) {
    nextBurstAt = now;
  }

  if (now >= nextBurstAt) {
    triggerBurst();
    nextBurstAt = now + 2600 + Math.random() * 1100;
  }

  loopFrameId = window.requestAnimationFrame(animationLoop);
}

onMounted(() => {
  triggerBurst();
  loopFrameId = window.requestAnimationFrame(animationLoop);
});

onBeforeUnmount(() => {
  if (loopFrameId) {
    window.cancelAnimationFrame(loopFrameId);
    loopFrameId = 0;
  }
});
</script>

<style scoped>
.screen-wave-burst {
  position: absolute;
  opacity: 0;
  transform: translate(-50%, -50%);
}

.screen-wave-burst-active {
  animation: screen-wave-fade 5.2s ease-out forwards;
}

.screen-wave-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 4px solid rgb(186 230 253 / 0.42);
  opacity: 0;
  transform: scale(0.18);
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.08) inset;
}

.screen-wave-ring::after {
  content: '';
  position: absolute;
  inset: 0.8rem;
  border-radius: inherit;
  border: 2px solid rgb(255 255 255 / 0.18);
}

.screen-wave-burst-active .screen-wave-ring-primary {
  animation: screen-wave-expand 5.2s cubic-bezier(0.12, 0.65, 0.2, 1) forwards;
}

.screen-wave-ring-secondary {
  inset: 1rem;
  border-width: 3px;
  border-color: rgb(125 211 252 / 0.34);
}

.screen-wave-burst-active .screen-wave-ring-secondary {
  animation: screen-wave-expand-secondary 5.2s cubic-bezier(0.12, 0.65, 0.2, 1) forwards;
}

@keyframes screen-wave-fade {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

@keyframes screen-wave-expand {
  0% {
    opacity: 0;
    transform: scale(0.12);
  }

  8% {
    opacity: 0.72;
  }

  100% {
    opacity: 0;
    transform: scale(1.32);
  }
}

@keyframes screen-wave-expand-secondary {
  0%,
  10% {
    opacity: 0;
    transform: scale(0.18);
  }

  22% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
    transform: scale(1.4);
  }
}
</style>
