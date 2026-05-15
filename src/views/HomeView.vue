<template>
  <main
    class="app-screen relative mx-auto flex w-full max-w-md flex-col box-border bg-cover bg-center px-4"
    :style="homeBackgroundStyle"
  >
    <RainOverlay />
    <div class="frog-screen-wrap absolute left-1/2 top-1/2 -translate-y-1/3 -translate-x-1/2 w-[75%]">
      <span class="frog-screen-wave frog-screen-wave-primary"></span>
      <span class="frog-screen-wave frog-screen-wave-secondary"></span>
      <img :src="FROG_SCREEN_IMAGE" class="frog-screen-image float-water"/>
    </div>
    <section
      class="relative flex flex-1 flex-col items-center justify-between overflow-hidden transition-opacity duration-300"
      :class="isLoading ? 'opacity-0' : 'opacity-100'"
    >
      <div class="mt-16 inline-flex w-fit rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.2)]">
        Frog Puzzle
      </div>

      <button
          type="button"
          :class="isStarting ? 'translate-y-[4px] shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)]' : ''"
          class="
          relative
          h-16 w-30 z-[1000]
          rounded-full font-black text-xl tracking-wide text-white
          border-4 border-[#039088]
          shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)]
          active:translate-y-[4px]
          active:shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)]
          transition-all duration-150
          flex items-center justify-center 
          bg-gradient-to-b from-emerald-400 to-[#039088] mb-10"
          :disabled="isLoading || isStarting"
          @click="handleStart"
        >
          {{ isLoading ? 'CARGADO...' : 'JUGAR' }}
      </button>

    </section>

    <div
      v-if="isLoading"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[rgba(2,6,23,0.84)]"
    >
      <div class="h-16 w-16 rounded-full border-4 border-white/20 border-t-emerald-400 animate-spin"></div>
      <div class="space-y-2 text-center text-white">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
          Preparando pantano
        </p>
        <p class="text-2xl font-black">{{ progress }}%</p>
        <p class="text-sm text-white/80">
          Cargando imágenes y sonidos...
        </p>
      </div>
    </div>


  </main>
</template>

<script setup lang="ts">
import RainOverlay from '../components/RainOverlay.vue';
import { computed, onMounted, ref } from 'vue';
import {
  preloadBackgroundMusic,
  stopBackgroundMusic
} from '../composables/useBackgroundMusic';
import {
  playSoundEffect,
  preloadSoundEffect,
  resumeSoundEffects
} from '../composables/useSoundEffects';
import {
  APP_ICON,
  APPLAUSE_SOUND,
  BOTTOM_FROG_IMAGE,
  BOTTOM_FROG_JUMP_IMAGE,
  BUTTON_PRESS_SOUND,
  CLOCK_SOUND,
  EXIT_IMAGE,
  FROG_SCREEN_IMAGE,
  GAME_BG_IMAGE,
  HOME_SCREEN_IMAGE,
  JUMP_SOUND,
  LINE_BG_IMAGE,
  LILY_PAD_IMAGE,
  LOSE_SOUND,
  MUSIC_SOUND,
  SPLASH_SOUND,
  TOP_FROG_IMAGE,
  TOP_FROG_JUMP_IMAGE,
  VICTORY_SOUND
} from '../constants/assets';
import { waitForAnimationFrameDelay } from '../utils/animationFrame';

const emit = defineEmits<{
  start: [];
}>();

const assetsToPreload = [
  BOTTOM_FROG_JUMP_IMAGE,
  BOTTOM_FROG_IMAGE,
  GAME_BG_IMAGE,
  LILY_PAD_IMAGE,
  HOME_SCREEN_IMAGE,
  FROG_SCREEN_IMAGE,
  LINE_BG_IMAGE,
  EXIT_IMAGE,
  TOP_FROG_JUMP_IMAGE,
  TOP_FROG_IMAGE,
  APPLAUSE_SOUND,
  BUTTON_PRESS_SOUND,
  CLOCK_SOUND,
  LOSE_SOUND,
  VICTORY_SOUND,
  JUMP_SOUND,
  MUSIC_SOUND,
  SPLASH_SOUND,
  APP_ICON
];

const homeBackgroundStyle = {
  backgroundImage: `url(${HOME_SCREEN_IMAGE})`
};

const isLoading = ref(true);
const isStarting = ref(false);
const loadedAssets = ref(0);

const progress = computed(() =>
  Math.round((loadedAssets.value / assetsToPreload.length) * 100)
);

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

function preloadAudio(src: string) {
  return new Promise<void>((resolve) => {
    const audio = new Audio();
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      audio.oncanplaythrough = null;
      audio.onerror = null;
      resolve();
    };

    audio.preload = 'auto';
    audio.oncanplaythrough = finish;
    audio.onerror = finish;
    audio.src = src;
    audio.load();

    window.setTimeout(finish, 2400);
  });
}

function preloadAsset(src: string) {
  if (src === MUSIC_SOUND) {
    return preloadBackgroundMusic();
  }

  if (
    src === APPLAUSE_SOUND ||
    src === BUTTON_PRESS_SOUND ||
    src === CLOCK_SOUND ||
    src === JUMP_SOUND ||
    src === LOSE_SOUND ||
    src === SPLASH_SOUND
  ) {
    return preloadSoundEffect(src);
  }

  return src.endsWith('.mp3') || src.endsWith('.wav')
    ? preloadAudio(src)
    : preloadImage(src);
}

async function handleStart() {
  if (isLoading.value || isStarting.value) {
    return;
  }

  isStarting.value = true;
  await resumeSoundEffects();
  void playSoundEffect(BUTTON_PRESS_SOUND, { volume: 0.7 });
  await waitForAnimationFrameDelay(160);
  emit('start');
}

onMounted(async () => {
  stopBackgroundMusic();

  await Promise.all(
    assetsToPreload.map(async (asset) => {
      await preloadAsset(asset);
      loadedAssets.value += 1;
    })
  );

  await waitForAnimationFrameDelay(180);
  isLoading.value = false;
});
</script>

<style scoped>
.frog-screen-wrap {
  pointer-events: none;
}

.frog-screen-image {
  opacity: 0.98;
  transform: translateZ(0);
}

.frog-screen-wave {
  position: absolute;
  left: 50%;
  top: 54%;
  width: 72%;
  aspect-ratio: 1 / 1;
  border-radius: 9999px;
  border: 3px solid rgb(186 230 253 / 0.5);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.35);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.08) inset,
    0 0 22px rgb(56 189 248 / 0.12);
  animation: frog-screen-wave 3.6s ease-out infinite;
}

.frog-screen-wave::after {
  content: '';
  position: absolute;
  inset: 0.8rem;
  border-radius: inherit;
  border: 2px solid rgb(255 255 255 / 0.28);
}

.frog-screen-wave-secondary {
  animation-delay: 1.8s;
}

@keyframes frog-screen-wave {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.35);
  }

  12% {
    opacity: 0.7;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
  }
}
</style>
