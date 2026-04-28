<template>
  <main class="app-screen relative mx-auto flex w-full max-w-md flex-col box-border bg-[url('/images/home_screen.png')] bg-cover bg-center px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
    <RainOverlay />
    <div class="frog-screen-wrap absolute left-1/2 top-1/2 -translate-y-1/3 -translate-x-1/2 w-[75%]">
      <span class="frog-screen-wave frog-screen-wave-primary"></span>
      <span class="frog-screen-wave frog-screen-wave-secondary"></span>
      <img src="/public/images/frog_screen.png" class="drop-shadow-xl float-water"/>
    </div>
    <section
      class="relative flex flex-1 flex-col items-center justify-between overflow-hidden transition-opacity duration-300"
      :class="isLoading ? 'opacity-0' : 'opacity-100'"
    >
      <div class="mt-6 inline-flex w-fit rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.2)]">
        Frog Puzzle
      </div>

      <button
          type="button"
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
          :disabled="isLoading"
          @click="handleStart"
        >
          {{ isLoading ? 'CARGADO...' : 'JUGAR' }}
      </button>

    </section>

    <div
      v-if="isLoading"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-slate-950/82 backdrop-blur-sm"
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
  playBackgroundMusic,
  preloadBackgroundMusic
} from '../composables/useBackgroundMusic';
import {
  preloadSoundEffect,
  resumeSoundEffects
} from '../composables/useSoundEffects';

const emit = defineEmits<{
  start: [];
}>();

const assetsToPreload = [
  '/images/bottom_frog_jump.png',
  '/images/bottom_frog.png',
  '/images/game_bg.png',
  '/images/hoja.png',
  '/images/home_screen.png',
  '/images/frog_screen.png',
  '/images/linebg.png',
  '/images/out.png',
  '/images/top_frog_jump.png',
  '/images/top_frog.png',
  '/sounds/jump.mp3',
  '/sounds/music.mp3',
  '/sounds/splash.mp3',
  '/icon.svg'
];

const isLoading = ref(true);
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
  if (src === '/sounds/music.mp3') {
    return preloadBackgroundMusic();
  }

  if (src === '/sounds/jump.mp3' || src === '/sounds/splash.mp3') {
    return preloadSoundEffect(src);
  }

  return src.endsWith('.mp3') || src.endsWith('.wav')
    ? preloadAudio(src)
    : preloadImage(src);
}

async function handleStart() {
  await resumeSoundEffects();
  await playBackgroundMusic();
  emit('start');
}

onMounted(async () => {
  await Promise.all(
    assetsToPreload.map(async (asset) => {
      await preloadAsset(asset);
      loadedAssets.value += 1;
    })
  );

  void playBackgroundMusic();

  window.setTimeout(() => {
    isLoading.value = false;
  }, 180);
});
</script>

<style scoped>
.frog-screen-wrap {
  pointer-events: none;
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
    0 0 34px rgb(56 189 248 / 0.16);
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
