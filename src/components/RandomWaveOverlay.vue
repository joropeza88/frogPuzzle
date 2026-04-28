<template>
  <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div
      :key="waveBurstKey"
      class="screen-wave-burst"
      :style="waveBurstStyle"
    >
      <span class="screen-wave-ring screen-wave-ring-primary"></span>
      <span class="screen-wave-ring screen-wave-ring-secondary"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const waveBurstKey = ref(0);
const waveBurstX = ref(50);
const waveBurstY = ref(50);
const waveBurstSize = ref(9.5);
let waveInterval: number | null = null;

const waveBurstStyle = computed(() => ({
  left: `${waveBurstX.value}%`,
  top: `${waveBurstY.value}%`,
  width: `${waveBurstSize.value}rem`,
  height: `${waveBurstSize.value}rem`
}));

function triggerScreenWave() {
  waveBurstX.value = 18 + Math.random() * 64;
  waveBurstY.value = 14 + Math.random() * 72;
  waveBurstSize.value = 8 + Math.random() * 4.5;
  waveBurstKey.value += 1;
}

onMounted(() => {
  triggerScreenWave();
  waveInterval = window.setInterval(triggerScreenWave, 3200);
});

onBeforeUnmount(() => {
  if (waveInterval !== null) {
    window.clearInterval(waveInterval);
    waveInterval = null;
  }
});
</script>

<style scoped>
.screen-wave-burst {
  position: absolute;
  opacity: 0;
  transform: translate(-50%, -50%);
  animation: screen-wave-fade 5.2s ease-out forwards;
}

.screen-wave-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 4px solid rgb(186 230 253 / 0.42);
  opacity: 0;
  transform: scale(0.18);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.08) inset,
    0 0 36px rgb(56 189 248 / 0.16);
}

.screen-wave-ring::after {
  content: '';
  position: absolute;
  inset: 0.8rem;
  border-radius: inherit;
  border: 2px solid rgb(255 255 255 / 0.18);
}

.screen-wave-ring-primary {
  animation: screen-wave-expand 5.2s cubic-bezier(0.12, 0.65, 0.2, 1) forwards;
}

.screen-wave-ring-secondary {
  inset: 1rem;
  border-width: 3px;
  border-color: rgb(125 211 252 / 0.34);
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
