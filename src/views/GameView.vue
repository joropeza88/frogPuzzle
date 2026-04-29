<template>
  <main class="app-screen relative mx-auto flex w-full max-w-md flex-col box-border overflow-hidden px-4">
    <RandomWaveOverlay />
    <FireFly />
    <!-- Fondo plantas -->
    <img
      src="/images/game_bg.png"
      class="absolute top-0 left-0 h-[110%] w-[110%] object-cover z-10 pointer-events-none opacity-35 saturate-75 blur-[1px] plants-back"
    />

    <!-- Frente plantas -->
    <img
      src="/images/game_bg.png"
      class="absolute top-0 left-0 h-[110%] w-[110%] object-cover z-10 pointer-events-none drop-shadow-md opacity-100 plants-front"
    />
    
    <GameHeader
        :level="currentLevel"
        :max-level="maxLevel"
        :formatted-time="timer.formattedTime"
        :is-urgent="isTimerUrgent"
      />
      
    <section class="flex-1 flex justify-center items-center w-full h-full"> 
      
          <GameBoard
            :board="board"
            :greens="levelConfig.greens"
            :browns="levelConfig.browns"
            :selected-index="selectedIndex"
            :valid-moves="validMoves"
            :error-index="errorIndex"
            :active-move="activeMove"
            @select="selectIndex"
          />
        
    </section>

    <GameFooter
        :status="status"
        :moves-count="movesCount"
        :can-advance="canAdvance"
        @exit="emit('exit')"
        @restart="resetLevel"
        @next="advanceWithTransition"
      />

    <div
      v-if="isLevelTransitionActive"
      class="level-transition-overlay absolute inset-0 z-40 overflow-hidden"
      :class="`level-transition-overlay--${levelTransitionPhase}`"
      aria-hidden="true"
    >
      <div class="level-transition-mist level-transition-mist-back"></div>
      <div class="level-transition-mist level-transition-mist-mid"></div>
      <div class="level-transition-mist level-transition-mist-front"></div>
      <div class="level-transition-glow"></div>
      <div class="level-transition-copy">
        <span class="level-transition-eyebrow">Pantano en movimiento</span>
        <strong class="level-transition-title">Nivel {{ transitionLevelLabel }}</strong>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import GameBoard from '../components/GameBoard.vue';
import GameFooter from '../components/GameFooter.vue';
import GameHeader from '../components/GameHeader.vue';
import RandomWaveOverlay from '../components/RandomWaveOverlay.vue';
import FireFly from '../components/FireFly.vue';
import { playBackgroundMusic } from '../composables/useBackgroundMusic';
import { playSoundEffect, preloadSoundEffect } from '../composables/useSoundEffects';
import { useGameLogic, type LossReason } from '../composables/useGameLogic';

const emit = defineEmits<{
  exit: [];
  completed: [];
}>();

onMounted(() => {
  void playBackgroundMusic();
  void preloadSoundEffect('/sounds/lose.mp3');
  void preloadSoundEffect('/sounds/victory.mp3');
  void showLevelOneInstructions();
});

const {
  board,
  currentLevel,
  maxLevel,
  selectedIndex,
  validMoves,
  status,
  lossReason,
  movesCount,
  errorIndex,
  activeMove,
  canAdvance,
  levelConfig,
  timer,
  startCurrentLevelTimer,
  selectIndex,
  resetLevel,
  nextLevel
} = useGameLogic();

let activeDialog: Promise<void> | null = null;
let dialogDelayTimeout: number | null = null;
let hasShownLevelOneInstructions = false;
let levelTransitionPromise: Promise<void> | null = null;
const isLevelTransitionActive = ref(false);
const levelTransitionPhase = ref<'enter' | 'hold' | 'leave'>('enter');
const transitionLevelLabel = ref<number | null>(null);

const LEVEL_TRANSITION_ENTER_MS = 320;
const LEVEL_TRANSITION_HOLD_MS = 820;
const LEVEL_TRANSITION_LEAVE_MS = 420;

const isTimerUrgent = computed(
  () => timer.isRunning.value && timer.secondsLeft.value <= 10
);

function wait(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

async function showLevelOneInstructions() {
  if (hasShownLevelOneInstructions || currentLevel.value !== 1 || timer.isRunning.value) {
    return;
  }

  hasShownLevelOneInstructions = true;

  await Swal.fire({
    title: 'Cómo jugar',
    text: 'Toca una rana y luego una hoja marcada para moverla. Debes intercambiar de lugar las ranas verdes y cafés antes de que se acabe el tiempo.',
    width: '300px',
    buttonsStyling: false,
    customClass: {
      popup: '!bg-[#f7f1dd] !bg-[url("/images/linebg.png")] border-4 border-[#039088] shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)]',
      confirmButton: 'relative h-16 w-50 uppercase rounded-full font-black text-xl tracking-wide text-white border-4 border-[#039088] shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)] active:translate-y-[4px] active:shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)] transition-all duration-150 flex items-center justify-center bg-gradient-to-b from-emerald-400 to-[#039088]',
    },
    confirmButtonText: 'Entendido',
    allowOutsideClick: false,
    allowEscapeKey: false,
    heightAuto: false
  });

  startCurrentLevelTimer();
}

async function showWinDialog() {
  if (currentLevel.value === maxLevel) {
    emit('completed');
    return;
  }

  void playSoundEffect('/sounds/victory.mp3', {
    volume: 0.6
  });

  const result = await Swal.fire({
    title: 'Nivel completado',
    text: 'Las ranas intercambiaron sus lugares correctamente.',
    //icon: 'success',

    width: '300px',
    buttonsStyling: false,
    customClass: {
      popup: '!bg-[#f7f1dd] !bg-[url("/images/linebg.png")] border-4 border-[#039088] shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)]',
      confirmButton: 'relative h-16 w-50 uppercase rounded-full font-black text-xl tracking-wide text-white border-4 border-[#039088] shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)] active:translate-y-[4px] active:shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)] transition-all duration-150 flex items-center justify-center bg-gradient-to-b from-emerald-400 to-[#039088]',
      denyButton: 'bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-full px-4 py-2 mx-2'
    },
    confirmButtonText: 'Siguiente',
    showDenyButton: false,
    denyButtonText: 'Repetir',

    allowOutsideClick: false,
    allowEscapeKey: false,
    heightAuto: false
    
  });

  if (result.isConfirmed) {
    await advanceWithTransition();
    return;
  }

  if (result.isDenied) {
    resetLevel();
  }
}

async function showLoseDialog(reason: LossReason | null) {
  const title =
    reason === 'stuck' ? 'Ya no hay movimientos' : 'Tiempo agotado';
  const text =
    reason === 'stuck'
      ? 'Ese movimiento dejó el tablero sin jugadas posibles. Intenta otra estrategia.'
      : 'No alcanzaste a ordenar el pantano. Intenta de nuevo.';

  void playSoundEffect('/sounds/lose.mp3', {
    volume: 0.6
  });

  await Swal.fire({
    title,
    text,
    //icon: 'warning',

    width: '300px',
    buttonsStyling: false,
    customClass: {
      popup: '!bg-[#f7f1dd] !bg-[url("/images/linebg.png")] border-4 border-[#039088] shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)]',
      confirmButton: 'relative h-16 w-50 uppercase rounded-full font-black text-xl tracking-wide text-white border-4 border-[#039088] shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)] active:translate-y-[4px] active:shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)] transition-all duration-150 flex items-center justify-center bg-gradient-to-b from-emerald-400 to-[#039088]',
      denyButton: 'bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-full px-4 py-2 mx-2'
    },

    confirmButtonText: 'Reintentar',
    allowOutsideClick: false,
    allowEscapeKey: false,
    heightAuto: false,
    
  });

  resetLevel();
}

async function advanceWithTransition() {
  if (levelTransitionPromise || currentLevel.value >= maxLevel) {
    return;
  }

  const targetLevel = Math.min(currentLevel.value + 1, maxLevel);

  transitionLevelLabel.value = targetLevel;
  isLevelTransitionActive.value = true;
  levelTransitionPhase.value = 'enter';

  levelTransitionPromise = (async () => {
    await wait(LEVEL_TRANSITION_ENTER_MS);
    levelTransitionPhase.value = 'hold';
    nextLevel({ startTimer: false });
    await wait(LEVEL_TRANSITION_HOLD_MS);
    levelTransitionPhase.value = 'leave';
    startCurrentLevelTimer();
    await wait(LEVEL_TRANSITION_LEAVE_MS);
    isLevelTransitionActive.value = false;
    transitionLevelLabel.value = null;
    levelTransitionPromise = null;
  })();

  await levelTransitionPromise;
}

watch(status, (nextStatus) => {
  if (activeDialog || nextStatus === 'playing') {
    return;
  }

  if (dialogDelayTimeout !== null) {
    window.clearTimeout(dialogDelayTimeout);
  }

  const delay =
    nextStatus === 'lost' && lossReason.value === 'timeout'
      ? 0
      : 1200;

  dialogDelayTimeout = window.setTimeout(() => {
    activeDialog =
      nextStatus === 'won'
        ? showWinDialog()
        : nextStatus === 'lost'
          ? showLoseDialog(lossReason.value)
          : null;

    activeDialog?.finally(() => {
      activeDialog = null;
    });

    dialogDelayTimeout = null;
  }, delay);
});
</script>

<style scoped>
.level-transition-overlay {
  pointer-events: auto;
  background:
    radial-gradient(circle at 50% 42%, rgb(236 253 245 / 0.18), transparent 18rem),
    linear-gradient(180deg, rgb(4 24 24 / 0.1) 0%, rgb(6 45 43 / 0.44) 44%, rgb(2 15 18 / 0.84) 100%);
  backdrop-filter: blur(2px) saturate(1.05);
  opacity: 0;
  transition: opacity 260ms ease;
}

.level-transition-overlay--enter,
.level-transition-overlay--hold,
.level-transition-overlay--leave {
  opacity: 1;
}

.level-transition-mist {
  position: absolute;
  left: -10%;
  width: 120%;
  border-radius: 9999px;
  filter: blur(14px);
  transform: translateY(115%);
}

.level-transition-mist-back {
  bottom: -18%;
  height: 54%;
  background:
    radial-gradient(circle at 18% 40%, rgb(240 253 250 / 0.5), transparent 24%),
    radial-gradient(circle at 66% 34%, rgb(167 243 208 / 0.34), transparent 26%),
    linear-gradient(180deg, rgb(16 185 129 / 0.18), rgb(6 95 70 / 0.9));
  transition: transform 620ms cubic-bezier(0.2, 0.82, 0.2, 1);
}

.level-transition-mist-mid {
  bottom: -22%;
  height: 64%;
  background:
    radial-gradient(circle at 74% 24%, rgb(209 250 229 / 0.58), transparent 20%),
    radial-gradient(circle at 28% 30%, rgb(125 211 252 / 0.3), transparent 22%),
    linear-gradient(180deg, rgb(20 184 166 / 0.16), rgb(6 78 59 / 0.94));
  transition: transform 700ms cubic-bezier(0.16, 0.84, 0.18, 1);
}

.level-transition-mist-front {
  bottom: -28%;
  height: 74%;
  background:
    radial-gradient(circle at 24% 22%, rgb(255 255 255 / 0.42), transparent 18%),
    radial-gradient(circle at 78% 18%, rgb(187 247 208 / 0.32), transparent 18%),
    linear-gradient(180deg, rgb(15 118 110 / 0.2), rgb(2 44 34 / 0.98));
  box-shadow: 0 -1.4rem 3rem rgb(6 78 59 / 0.2);
  transition: transform 780ms cubic-bezier(0.16, 0.84, 0.18, 1);
}

.level-transition-overlay--enter .level-transition-mist-back,
.level-transition-overlay--hold .level-transition-mist-back {
  transform: translateY(14%);
}

.level-transition-overlay--enter .level-transition-mist-mid,
.level-transition-overlay--hold .level-transition-mist-mid {
  transform: translateY(4%);
}

.level-transition-overlay--enter .level-transition-mist-front,
.level-transition-overlay--hold .level-transition-mist-front {
  transform: translateY(-8%);
}

.level-transition-overlay--leave .level-transition-mist-back {
  transform: translateY(-120%);
}

.level-transition-overlay--leave .level-transition-mist-mid {
  transform: translateY(-130%);
}

.level-transition-overlay--leave .level-transition-mist-front {
  transform: translateY(-145%);
}

.level-transition-glow {
  position: absolute;
  inset: auto 0 16%;
  margin: 0 auto;
  width: 18rem;
  height: 18rem;
  border-radius: 9999px;
  background: radial-gradient(circle, rgb(255 255 255 / 0.18) 0%, transparent 68%);
  filter: blur(14px);
  opacity: 0;
  transform: translateY(2rem) scale(0.9);
  transition:
    opacity 220ms ease,
    transform 420ms ease;
}

.level-transition-overlay--hold .level-transition-glow,
.level-transition-overlay--leave .level-transition-glow {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.level-transition-copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding-bottom: 4rem;
  text-align: center;
  color: #f0fdf4;
  text-shadow:
    0 0 1.5rem rgb(6 78 59 / 0.45),
    0 0.2rem 0.7rem rgb(0 0 0 / 0.28);
  opacity: 0;
  transform: translateY(1.25rem) scale(0.94);
  transition:
    opacity 220ms ease,
    transform 360ms cubic-bezier(0.2, 0.82, 0.2, 1);
}

.level-transition-overlay--hold .level-transition-copy,
.level-transition-overlay--leave .level-transition-copy {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.level-transition-eyebrow {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgb(209 250 229 / 0.92);
}

.level-transition-title {
  font-size: clamp(2.3rem, 7vw, 3.4rem);
  font-weight: 900;
  letter-spacing: 0.08em;
}
</style>
