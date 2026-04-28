<template>
  <section>
    <div
      ref="boardRef"
      class="relative mx-auto grid w-full max-w-[24rem] grid-cols-3 grid-rows-5 justify-items-center gap-x-4 gap-y-0 py-6 float-water"
    >
    
      <div
        v-for="(cell, index) in board"
        :key="`${index}-${cell ?? 'empty'}`"
        class="relative flex h-24 w-24 items-center justify-center"
        :style="cellLayoutStyle(index)"
      >
        <div
          class="water-wave-backdrop pointer-events-none absolute left-1/2 top-1/2"
          :class="{ 'animate-wave': waveIndex === index }"
        >
          <span class="water-wave-ring water-wave-ring-primary"></span>
          <span class="water-wave-ring water-wave-ring-secondary"></span>
        </div>
        <button
          type="button"
          class="z-10 relative flex h-24 w-24 items-center justify-center rounded-full border-0 transition duration-200 bg-[url('/images/hoja.png')] bg-cover bg-center drop-shadow-xl"
          :class="cellClasses(index, cell)"
          :ref="(element) => setCellRef(element, index)"
          @click="$emit('select', index)"
        >
        <div
          v-if="originEffect?.fromIndex === index"
          class="pointer-events-none absolute inset-0 overflow-visible"
        >
          <span class="water-ripple water-ripple-origin"></span>
          <span
            v-for="particle in originSplashParticles"
            :key="`${originEffect.key}-${particle.id}`"
            class="water-particle water-particle-origin"
            :style="particle.style"
          ></span>
        </div>
        <div
          v-if="landingEffect?.toIndex === index"
          class="pointer-events-none absolute inset-0 overflow-visible"
        >
          <span class="water-ripple water-ripple-landing"></span>
          <span
            v-for="particle in landingSplashParticles"
            :key="`${landingEffect.key}-${particle.id}`"
            class="water-particle water-particle-landing"
            :style="particle.style"
          ></span>
        </div>
        <div
          v-if="validMoves.includes(index)"
          class="absolute inset-1 rounded-full border-2 border-dashed border-white animate-pulse"
        ></div>
        <div
          v-if="selectedIndex === index"
          class="absolute inset-1 rounded-full border-2 border-white/80"
        ></div>
        <FrogPiece
          v-if="cell && !isAnimatingTarget(index)"
          :color="cell"
          :orientation="getFrogOrientation(index)"
          :selected="selectedIndex === index"
        />
        </button>
      </div>

      <div v-if="jumpSprite" class="pointer-events-none absolute inset-0 z-20 overflow-visible">
        <div class="frog-hop" :style="jumpStyle">
          <FrogPiece 
            :color="jumpSprite.color" 
            :isJumping="true"
            :orientation="jumpSprite.orientation"
            :rotation="jumpSprite.rotation"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { playSoundEffect, preloadSoundEffect } from '../composables/useSoundEffects';
import FrogPiece from './FrogPiece.vue';
import type { BoardCell } from '../utils/movementRules';
import type { MoveAnimation } from '../composables/useGameLogic';

defineEmits<{
  select: [index: number];
}>();

const props = defineProps<{
  board: BoardCell[];
  greens: number;
  browns: number;
  selectedIndex: number | null;
  validMoves: number[];
  errorIndex: number | null;
  activeMove: MoveAnimation | null;
}>();

interface JumpSprite {
  key: number;
  color: NonNullable<BoardCell>;
  orientation: FrogOrientation;
  rotation?: number;
  top: number;
  left: number;
  distanceX: number;
  distanceY: number;
  jumped: boolean;
  toIndex: number;
}

interface LandingEffect {
  key: number;
  toIndex: number;
}

interface OriginEffect {
  key: number;
  fromIndex: number;
}

interface GridPosition {
  column: number;
  row: number;
}

type FrogOrientation = 'default' | 'side' | 'left-corner' | 'right-corner';

const boardRef = ref<HTMLElement | null>(null);
const cellRefs = ref<(HTMLButtonElement | null)[]>([]);
const jumpSprite = ref<JumpSprite | null>(null);
const landingEffect = ref<LandingEffect | null>(null);
const originEffect = ref<OriginEffect | null>(null);
let jumpCleanupTimeout: number | null = null;
let landingEffectTimeout: number | null = null;
let landingKickoffTimeout: number | null = null;
let originEffectTimeout: number | null = null;
const waveIndex = ref<number | null>(null);
let waveTimeout: number | null = null;

const originSplashParticles = [
  {
    id: 1,
    style: {
      '--particle-x': '-0.85rem',
      '--particle-y': '-0.65rem',
      '--particle-delay': '0ms',
      '--particle-size': '0.28rem'
    }
  },
  {
    id: 2,
    style: {
      '--particle-x': '0rem',
      '--particle-y': '-0.95rem',
      '--particle-delay': '20ms',
      '--particle-size': '0.22rem'
    }
  },
  {
    id: 3,
    style: {
      '--particle-x': '0.9rem',
      '--particle-y': '-0.6rem',
      '--particle-delay': '40ms',
      '--particle-size': '0.24rem'
    }
  }
] as const;

const landingSplashParticles = [
  {
    id: 1,
    style: {
      '--particle-x': '-1.75rem',
      '--particle-y': '-1.2rem',
      '--particle-delay': '0ms',
      '--particle-size': '0.5rem'
    }
  },
  {
    id: 2,
    style: {
      '--particle-x': '-0.95rem',
      '--particle-y': '-1.75rem',
      '--particle-delay': '28ms',
      '--particle-size': '0.38rem'
    }
  },
  {
    id: 3,
    style: {
      '--particle-x': '0rem',
      '--particle-y': '-2rem',
      '--particle-delay': '8ms',
      '--particle-size': '0.56rem'
    }
  },
  {
    id: 4,
    style: {
      '--particle-x': '0.95rem',
      '--particle-y': '-1.45rem',
      '--particle-delay': '42ms',
      '--particle-size': '0.42rem'
    }
  },
  {
    id: 5,
    style: {
      '--particle-x': '1.8rem',
      '--particle-y': '-1rem',
      '--particle-delay': '16ms',
      '--particle-size': '0.32rem'
    }
  },
  {
    id: 6,
    style: {
      '--particle-x': '-0.2rem',
      '--particle-y': '-1.35rem',
      '--particle-delay': '52ms',
      '--particle-size': '0.26rem'
    }
  },
  {
    id: 7,
    style: {
      '--particle-x': '1.15rem',
      '--particle-y': '-1.8rem',
      '--particle-delay': '24ms',
      '--particle-size': '0.24rem'
    }
  }
] as const;

const jumpStyle = computed(() => {
  if (!jumpSprite.value) {
    return {};
  }

  return {
    top: `${jumpSprite.value.top}px`,
    left: `${jumpSprite.value.left}px`,
    '--jump-distance-x': `${jumpSprite.value.distanceX}px`,
    '--jump-distance': `${jumpSprite.value.distanceY}px`,
    '--jump-height': `${jumpSprite.value.jumped ? 4.25 : 2.75}rem`
  };
});

void preloadSoundEffect('/sounds/splash.mp3');

function setCellRef(element: Element | null, index: number) {
  cellRefs.value[index] = element as HTMLButtonElement | null;
}

function getGridPosition(index: number): GridPosition {
  const totalCells = props.board.length;

  if (totalCells <= 5) {
    return {
      column: 2,
      row: Math.floor((5 - totalCells) / 2) + index + 1
    };
  }

  const extraGreens = Math.max(0, props.greens - 2);
  const centerStartIndex = extraGreens;
  const centerEndIndex = centerStartIndex + 5;

  if (index < centerStartIndex) {
    return {
      column: 1,
      row: centerStartIndex - index
    };
  }

  if (index < centerEndIndex) {
    return {
      column: 2,
      row: index - centerStartIndex + 1
    };
  }

  const rightColumnIndex = index - centerEndIndex;

  return {
    column: 3,
    row: 5 - rightColumnIndex
  };
}

function cellLayoutStyle(index: number) {
  const position = getGridPosition(index);

  return {
    gridColumn: `${position.column}`,
    gridRow: `${position.row}`
  };
}

function getFrogOrientation(index: number): FrogOrientation {
  const position = getGridPosition(index);

  if (position.column === 1 && position.row === 1) {
    return 'left-corner';
  }

  if (position.column === 3 && position.row === 5) {
    return 'right-corner';
  }

  if (position.column === 1 || position.column === 3) {
    return 'side';
  }

  return 'default';
}

function getJumpRotation(fromIndex: number, toIndex: number) {
  const fromPosition = getGridPosition(fromIndex);
  const toPosition = getGridPosition(toIndex);
  const isHorizontalOrDiagonal =
    fromPosition.column !== toPosition.column;

  return isHorizontalOrDiagonal ? 270 : undefined;
}

function isAnimatingTarget(index: number) {
  return jumpSprite.value?.toIndex === index;
}

function playSplashSound() {
  void playSoundEffect('/sounds/splash.mp3', {
    volume: 0.38,
    offset: 0.08
  }).catch(() => {
    // Ignora bloqueos del navegador si el audio aún no puede reproducirse.
  });
}

watch(
  () => props.activeMove?.key,
  async (moveKey) => {
    if (!moveKey || !props.activeMove) {
      return;
    }

    await nextTick();

    const boardElement = boardRef.value;
    const fromCell = cellRefs.value[props.activeMove.fromIndex];
    const toCell = cellRefs.value[props.activeMove.toIndex];

    if (!boardElement || !fromCell || !toCell) {
      return;
    }

    const boardRect = boardElement.getBoundingClientRect();
    const fromRect = fromCell.getBoundingClientRect();
    const toRect = toCell.getBoundingClientRect();

    jumpSprite.value = {
      key: props.activeMove.key,
      color: props.activeMove.color,
      orientation: getFrogOrientation(props.activeMove.fromIndex),
      rotation: getJumpRotation(props.activeMove.fromIndex, props.activeMove.toIndex),
      top: fromRect.top - boardRect.top + (fromRect.height - 64) / 2,
      left: fromRect.left - boardRect.left + (fromRect.width - 64) / 2,
      distanceX: toRect.left - fromRect.left,
      distanceY: toRect.top - fromRect.top,
      jumped: props.activeMove.jumped,
      toIndex: props.activeMove.toIndex
    };

    if (jumpCleanupTimeout !== null) {
      window.clearTimeout(jumpCleanupTimeout);
    }

    if (landingKickoffTimeout !== null) {
      window.clearTimeout(landingKickoffTimeout);
    }

    if (landingEffectTimeout !== null) {
      window.clearTimeout(landingEffectTimeout);
    }

    if (originEffectTimeout !== null) {
      window.clearTimeout(originEffectTimeout);
    }

    landingEffect.value = null;
    originEffect.value = {
      key: props.activeMove.key,
      fromIndex: props.activeMove.fromIndex
    };

    triggerWave(props.activeMove.fromIndex);

    originEffectTimeout = window.setTimeout(() => {
      originEffect.value = null;
      originEffectTimeout = null;
    }, 280);

    landingKickoffTimeout = window.setTimeout(() => {
      playSplashSound();
      triggerWave(props.activeMove!.toIndex);
      landingEffect.value = {
        key: props.activeMove!.key,
        toIndex: props.activeMove!.toIndex
      };
      landingKickoffTimeout = null;
    }, 360);

    landingEffectTimeout = window.setTimeout(() => {
      landingEffect.value = null;
      landingEffectTimeout = null;
    }, 760);

    jumpCleanupTimeout = window.setTimeout(() => {
      jumpSprite.value = null;
      jumpCleanupTimeout = null;
    }, 520);
  }
);

function cellClasses(index: number, cell: BoardCell) {
  return {
    'leaf-liftoff': originEffect.value?.fromIndex === index,
    'leaf-impact': landingEffect.value?.toIndex === index,
    'scale-[1.02] shadow-[0_14px_24px_rgba(20,184,166,0.18)]':
      props.validMoves.includes(index) || props.selectedIndex === index,
    'animate-pulse':
      props.errorIndex === index
  };
}

function triggerWave(index: number) {
  waveIndex.value = index;

  if (waveTimeout !== null) {
    clearTimeout(waveTimeout);
  }

  waveTimeout = window.setTimeout(() => {
    waveIndex.value = null;
    waveTimeout = null;
  }, 650);
}

</script>

<style scoped>
.frog-hop {
  position: absolute;
  animation: frog-hop 520ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  will-change: transform;
}

.leaf-impact {
  animation: leaf-impact 360ms cubic-bezier(0.22, 0.7, 0.2, 1) forwards;
  transform-origin: center;
}

.leaf-liftoff {
  animation: leaf-liftoff 260ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
  transform-origin: center;
}

.water-wave-backdrop {
  width: 9.5rem;
  height: 9.5rem;
  opacity: 0;
  transform: translate(-50%, -50%);
}

.water-wave-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 3px solid rgb(255 255 255 / 0.55);
  opacity: 0;
  transform: scale(0.18);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.08) inset,
    0 0 28px rgb(125 211 252 / 0.16);
}

.water-wave-ring-secondary {
  inset: 0.75rem;
  border-width: 2px;
  border-color: rgb(186 230 253 / 0.6);
}

.water-particle {
  position: absolute;
  left: 50%;
  top: 52%;
  width: var(--particle-size);
  height: calc(var(--particle-size) * 1.5);
  border-radius: 9999px;
  background:
    radial-gradient(circle at 30% 30%, rgb(255 255 255 / 0.95), transparent 45%),
    linear-gradient(180deg, rgb(186 230 253 / 0.95), rgb(56 189 248 / 0.55));
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.45);
  animation: water-splash 420ms ease-out forwards;
  animation-delay: var(--particle-delay);
  box-shadow: 0 0 10px rgb(125 211 252 / 0.3);
}

.water-ripple {
  position: absolute;
  left: 50%;
  top: 54%;
  width: 2.8rem;
  height: 2.8rem;
  border: 2px solid rgb(255 255 255 / 0.7);
  border-radius: 9999px;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.35);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.08) inset,
    0 0 18px rgb(255 255 255 / 0.08);
}

.water-ripple::after {
  content: '';
  position: absolute;
  inset: 0.3rem;
  border: 1px solid rgb(255 255 255 / 0.45);
  border-radius: inherit;
  opacity: 0.9;
}

.water-ripple-origin {
  animation: water-ripple-origin 320ms ease-out forwards;
}

.water-ripple-landing {
  width: 3.4rem;
  height: 3.4rem;
  border-color: rgb(255 255 255 / 0.82);
  animation: water-ripple-landing 520ms cubic-bezier(0.16, 0.7, 0.2, 1) forwards;
}

.water-particle-origin {
  animation-duration: 300ms;
  opacity: 0;
  filter: saturate(0.9);
}

.water-particle-landing {
  animation-duration: 480ms;
  box-shadow: 0 0 14px rgb(125 211 252 / 0.38);
}

.animate-wave {
  animation: water-wave-fade 760ms linear forwards;
}

.animate-wave .water-wave-ring-primary {
  animation: water-wave-ring-primary 760ms cubic-bezier(0.12, 0.65, 0.2, 1) forwards;
}

.animate-wave .water-wave-ring-secondary {
  animation: water-wave-ring-secondary 760ms cubic-bezier(0.12, 0.65, 0.2, 1) forwards;
}

@keyframes frog-hop {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  45% {
    transform: translate3d(
        calc(var(--jump-distance-x) / 2),
        calc((var(--jump-distance) / 2) - var(--jump-height)),
        0
      )
      scale(1.06);
  }

  100% {
    transform: translate3d(
        var(--jump-distance-x),
        var(--jump-distance),
        0
      )
      scale(1);
  }
}

@keyframes leaf-impact {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }

  35% {
    transform: scale(0.94);
    filter: brightness(0.92);
  }

  65% {
    transform: scale(1.03);
    filter: brightness(1.04);
  }

  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

@keyframes leaf-liftoff {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }

  35% {
    transform: scale(0.97);
    filter: brightness(0.97);
  }

  68% {
    transform: scale(1.015);
    filter: brightness(1.02);
  }

  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

@keyframes water-splash {
  0% {
    opacity: 0;
    transform: translate(-50%, -35%) scale(0.35);
  }

  30% {
    opacity: 0.95;
  }

  100% {
    opacity: 0;
    transform: translate(
        calc(-50% + var(--particle-x)),
        calc(-50% + var(--particle-y))
      )
      scale(1);
  }
}

@keyframes water-ripple-origin {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }

  20% {
    opacity: 0.65;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

@keyframes water-ripple-landing {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.25);
  }

  18% {
    opacity: 0.9;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.45);
  }
}

@keyframes water-wave-fade {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

@keyframes water-wave-ring-primary {
  0% {
    opacity: 0;
    transform: scale(0.18);
  }

  14% {
    opacity: 0.72;
  }

  100% {
    opacity: 0;
    transform: scale(1.08);
  }
}

@keyframes water-wave-ring-secondary {
  0%,
  16% {
    opacity: 0;
    transform: scale(0.32);
  }

  34% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
    transform: scale(1.16);
  }
}
</style>
