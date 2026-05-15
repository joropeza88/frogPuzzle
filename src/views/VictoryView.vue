<template>
  <main class="app-screen relative mx-auto flex w-full max-w-md flex-col box-border bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.36),_transparent_30%),linear-gradient(180deg,_#06281f_0%,_#0f172a_58%,_#020617_100%)] px-4 text-white">
    <div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div class="confetti-burst confetti-burst-primary">
        <span
          v-for="piece in confettiPieces"
          :key="`primary-${piece.id}`"
          class="confetti-piece"
          :style="piece.style"
        ></span>
      </div>
      <div class="confetti-burst confetti-burst-secondary">
        <span
          v-for="piece in confettiPieces"
          :key="`secondary-${piece.id}`"
          class="confetti-piece"
          :style="piece.style"
        ></span>
      </div>
    </div>
    <section class="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/8 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.36)] backdrop-blur mt-16 mb-4">
      <div class="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl"></div>
      <div class="pointer-events-none absolute bottom-12 left-0 h-28 w-28 rounded-full bg-cyan-300/12 blur-3xl"></div>

      <div class="relative space-y-6">
        <div class="inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-400/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.34em] text-emerald-100">
          Juego completado
        </div>

        <div class="space-y-4">
          <p class="text-6xl leading-none">🏆</p>
          <h1 class="max-w-xs text-5xl font-black leading-[0.92] text-white">
            El pantano quedó en orden
          </h1>
          <p class="max-w-sm text-base leading-7 text-slate-200">
            Superaste los 13 niveles y lograste intercambiar todas las ranas hasta el final. No queda ningún reto pendiente en este recorrido.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <article class="rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-4 text-center">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Niveles
            </p>
            <p class="mt-2 text-3xl font-black text-white">13/13</p>
          </article>
          <article class="rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-4 text-center">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Estado
            </p>
            <p class="mt-2 text-3xl font-black text-emerald-300">Victoria</p>
          </article>
        </div>
      </div>

      <div class="relative z-30 flex items-center justify-between gap-2">
        <button
            type="button"
            class="
            relative
            h-16 w-full
            rounded-full font-black text-xl tracking-wide text-white
            border-4 border-[#039088]
            shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)]
            active:translate-y-[4px]
            active:shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)]
            transition-all duration-150
            flex items-center justify-center 
            bg-gradient-to-b from-emerald-400 to-[#039088] my-4"
            @click="$emit('exit')"
          >
            SALIR
        </button>
        <button
          type="button"
          class="
            relative mx-auto flex h-16 w-full max-w-xs items-center justify-center gap-3
            rounded-[1.3rem] border border-white/12 bg-[linear-gradient(180deg,#1877f2_0%,#1459c6_100%)]
            px-5 font-black tracking-wide text-white
            shadow-[0_14px_26px_rgba(24,119,242,0.28),inset_0_1px_0_rgba(255,255,255,0.18)]
            transition-all duration-150
            active:translate-y-[3px] active:shadow-[0_8px_16px_rgba(24,119,242,0.24)]
          "
          @click="shareGame"
        >
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-black text-[#1877f2]">f</span>
          <span class="text-sm uppercase tracking-[0.22em]">Compartir</span>
        </button>
      </div>

    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { APPLAUSE_SOUND } from '../constants/assets';
import { stopBackgroundMusic } from '../composables/useBackgroundMusic';
import { playSoundEffect, preloadSoundEffect } from '../composables/useSoundEffects';

defineEmits<{
  exit: [];
}>();

const confettiPieces = [
  { id: 1, style: { '--confetti-x': '-7rem', '--confetti-y': '-11rem', '--confetti-rotate': '-240deg', '--confetti-delay': '0ms', '--confetti-color': '#fde047' } },
  { id: 2, style: { '--confetti-x': '-5.6rem', '--confetti-y': '-9.4rem', '--confetti-rotate': '-180deg', '--confetti-delay': '40ms', '--confetti-color': '#fb7185' } },
  { id: 3, style: { '--confetti-x': '-3.8rem', '--confetti-y': '-12rem', '--confetti-rotate': '-140deg', '--confetti-delay': '70ms', '--confetti-color': '#2dd4bf' } },
  { id: 4, style: { '--confetti-x': '-2rem', '--confetti-y': '-8.6rem', '--confetti-rotate': '-90deg', '--confetti-delay': '20ms', '--confetti-color': '#60a5fa' } },
  { id: 5, style: { '--confetti-x': '0rem', '--confetti-y': '-12.8rem', '--confetti-rotate': '0deg', '--confetti-delay': '90ms', '--confetti-color': '#f59e0b' } },
  { id: 6, style: { '--confetti-x': '2.3rem', '--confetti-y': '-8.8rem', '--confetti-rotate': '90deg', '--confetti-delay': '30ms', '--confetti-color': '#a78bfa' } },
  { id: 7, style: { '--confetti-x': '4.2rem', '--confetti-y': '-11.4rem', '--confetti-rotate': '150deg', '--confetti-delay': '65ms', '--confetti-color': '#34d399' } },
  { id: 8, style: { '--confetti-x': '6.4rem', '--confetti-y': '-9.7rem', '--confetti-rotate': '220deg', '--confetti-delay': '10ms', '--confetti-color': '#f472b6' } },
  { id: 9, style: { '--confetti-x': '7.4rem', '--confetti-y': '-12.2rem', '--confetti-rotate': '280deg', '--confetti-delay': '55ms', '--confetti-color': '#38bdf8' } },
  { id: 10, style: { '--confetti-x': '-6.2rem', '--confetti-y': '-7.2rem', '--confetti-rotate': '-310deg', '--confetti-delay': '85ms', '--confetti-color': '#f97316' } },
  { id: 11, style: { '--confetti-x': '5.1rem', '--confetti-y': '-7.4rem', '--confetti-rotate': '320deg', '--confetti-delay': '110ms', '--confetti-color': '#22c55e' } },
  { id: 12, style: { '--confetti-x': '0.8rem', '--confetti-y': '-10.2rem', '--confetti-rotate': '45deg', '--confetti-delay': '50ms', '--confetti-color': '#facc15' } }
] as const;

async function shareGame() {
  const url = 'https://frog-puzzle-chi.vercel.app/';
  const title = 'Frog Puzzle';
  const text = 'Superé los 13 niveles del pantano. ¿Puedes lograrlo tú también?';

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      return;
    } catch {
      // Si el usuario cancela o el sistema falla, intentamos el fallback web.
    }
  }

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.location.href = facebookShareUrl;
}

onMounted(() => {
  stopBackgroundMusic();
  void preloadSoundEffect(APPLAUSE_SOUND);
  void playSoundEffect(APPLAUSE_SOUND, { volume: 0.72 });
});
</script>

<style scoped>
.confetti-burst {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
}

.confetti-burst-primary {
  animation: confetti-burst-fade 1.2s ease-out forwards;
}

.confetti-burst-secondary {
  animation: confetti-burst-fade 1.2s ease-out 0.55s forwards;
  opacity: 0;
}

.confetti-piece {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.7rem;
  height: 1.2rem;
  border-radius: 0.2rem;
  background: var(--confetti-color);
  box-shadow: 0 0 10px rgb(255 255 255 / 0.16);
  opacity: 0;
  transform: translate(-50%, -50%) rotate(0deg) scale(0.4);
}

.confetti-burst-primary .confetti-piece {
  animation: confetti-pop 1.1s cubic-bezier(0.12, 0.75, 0.2, 1) forwards;
  animation-delay: var(--confetti-delay);
}

.confetti-burst-secondary .confetti-piece {
  animation: confetti-pop 1.1s cubic-bezier(0.12, 0.75, 0.2, 1) forwards;
  animation-delay: calc(0.55s + var(--confetti-delay));
}

@keyframes confetti-burst-fade {
  0%,
  100% {
    opacity: 1;
  }
}

@keyframes confetti-pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(0deg) scale(0.3);
  }

  12% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate(calc(-50% + var(--confetti-x)), calc(-50% + var(--confetti-y)))
      rotate(var(--confetti-rotate))
      scale(1);
  }
}
</style>
