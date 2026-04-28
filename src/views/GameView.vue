<template>
  <main class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col box-border overflow-hidden px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
    <RandomWaveOverlay />
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
        @next="nextLevel"
      />
  </main>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import GameBoard from '../components/GameBoard.vue';
import GameFooter from '../components/GameFooter.vue';
import GameHeader from '../components/GameHeader.vue';
import RandomWaveOverlay from '../components/RandomWaveOverlay.vue';
import { playBackgroundMusic } from '../composables/useBackgroundMusic';
import { useGameLogic, type LossReason } from '../composables/useGameLogic';

const emit = defineEmits<{
  exit: [];
  completed: [];
}>();

onMounted(() => {
  void playBackgroundMusic();
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
  selectIndex,
  resetLevel,
  nextLevel
} = useGameLogic();

let activeDialog: Promise<void> | null = null;
let dialogDelayTimeout: number | null = null;

async function showWinDialog() {
  if (currentLevel.value === maxLevel) {
    emit('completed');
    return;
  }

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
    nextLevel();
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

watch(status, (nextStatus) => {
  if (activeDialog || nextStatus === 'playing') {
    return;
  }

  if (dialogDelayTimeout !== null) {
    window.clearTimeout(dialogDelayTimeout);
  }

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
  }, 1200);
});
</script>
