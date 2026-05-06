<template>
  <main class="app-screen relative mx-auto flex w-full max-w-md flex-col box-border overflow-hidden px-4">
    <RandomWaveOverlay />
    <FireFly />

    <img
      src="/images/game_bg.webp"
      class="absolute top-0 left-0 h-[110%] w-[110%] object-cover z-10 pointer-events-none opacity-24 plants-back"
    />
    <img
      src="/images/game_bg.webp"
      class="absolute top-0 left-0 h-[110%] w-[110%] object-cover z-10 pointer-events-none opacity-92 plants-front"
    />
    <div class="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(15,118,110,0.06),rgba(15,23,42,0.16))]"></div>

    <section class="relative z-20 flex flex-1 items-center justify-center py-16">
      <div class="grid w-full grid-cols-3 gap-3">
        <button
          v-for="level in levels"
          :key="level.level"
          type="button"
          :disabled="level.locked"
          :class="level.locked ? 'level-card-locked' : level.completed ? 'level-card-completed' : 'level-card-open'"
          class="level-card"
          @click="emit('select-level', level.level)"
        >
          <span class="text-2xl font-black leading-none">{{ level.level }}</span>
          <span class="text-[0.62rem] font-black uppercase tracking-[0.22em]">
            {{ level.locked ? 'Bloqueado' : level.completed ? 'Cursado' : 'Abierto' }}
          </span>
        </button>
      </div>
    </section>

    <footer class="relative z-20 flex justify-start pb-10">
      <button
        type="button"
        :class="isExitPressed ? 'translate-y-[4px] shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)]' : ''"
        :disabled="isExitPressed"
        class="
          relative
          h-16 w-16
          rounded-full
          bg-[#f7f1dd]
          border-4 border-[#039088]
          shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)]
          active:translate-y-[4px]
          active:shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)]
          transition-all duration-150
          flex items-center justify-center
        "
        @click="handleExit"
      >
        <img src="/images/out.webp" alt="Salir" class="w-8 h-8" />
      </button>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import FireFly from '../components/FireFly.vue';
import RandomWaveOverlay from '../components/RandomWaveOverlay.vue';
import {
  playSoundEffect,
  preloadSoundEffect,
  resumeSoundEffects
} from '../composables/useSoundEffects';
import { waitForAnimationFrameDelay } from '../utils/animationFrame';

const props = defineProps<{
  maxLevel: number;
  highestUnlockedLevel: number;
  completedLevels: number[];
}>();

const emit = defineEmits<{
  exit: [];
  'select-level': [level: number];
}>();

const isExitPressed = ref(false);

void preloadSoundEffect('/sounds/button-press.mp3');

const levels = computed(() =>
  Array.from({ length: props.maxLevel }, (_, index) => {
    const level = index + 1;
    const completed = props.completedLevels.includes(level);
    const locked = level > props.highestUnlockedLevel;

    return {
      level,
      completed,
      locked
    };
  })
);

async function handleExit() {
  if (isExitPressed.value) {
    return;
  }

  isExitPressed.value = true;
  await resumeSoundEffects();
  void playSoundEffect('/sounds/button-press.mp3', { volume: 0.7 });
  await waitForAnimationFrameDelay(160);
  emit('exit');
}
</script>

<style scoped>
.level-card {
  min-height: 5.8rem;
  border-radius: 1.55rem;
  border: 4px solid #039088;
  box-shadow: 0 4px 0 #005f5a, 0 14px 18px rgb(0 0 0 / 0.18);
  transition:
    transform 150ms ease,
    box-shadow 150ms ease,
    opacity 150ms ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
}

.level-card-open {
  background: linear-gradient(180deg, #fde68a 0%, #f59e0b 100%);
  color: #4a2d0d;
}

.level-card-completed {
  background: linear-gradient(180deg, #4ade80 0%, #039088 100%);
  color: white;
}

.level-card-locked {
  background: linear-gradient(180deg, rgb(51 65 85 / 0.88), rgb(15 23 42 / 0.96));
  border-color: #475569;
  box-shadow: 0 4px 0 #1e293b, 0 14px 18px rgb(0 0 0 / 0.18);
  color: rgb(203 213 225 / 0.8);
  opacity: 0.72;
}

.level-card:not(:disabled):active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #005f5a, 0 8px 12px rgb(0 0 0 / 0.14);
}
</style>
