<template>
  <div
    class="relative flex h-16 w-16 items-center justify-center rounded-[1.8rem] transition duration-300"
    :class="stateClasses"
  >
    <div
      class="absolute inset-0 z-10 animate-[breathe_2.4s_ease-in-out_infinite] drop-shadow-xl"
      :class="baseColorFrog"
      :style="orientationStyle"
    ></div>
    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FrogColor } from '../utils/movementRules';

const props = defineProps<{
  color: FrogColor;
  selected?: boolean;
  isJumping: { type: boolean, default: false};
  orientation?: 'default' | 'side' | 'left-corner' | 'right-corner';
  rotation?: number;
}>();

const baseColorFrog = computed(() =>
  props.color === 'green'
    ? props.isJumping
      ? "bg-[url('/images/top_frog_jump.png')] bg-cover bg-center"
      : "bg-[url('/images/top_frog.png')] bg-cover bg-center"
    : props.isJumping
      ? "bg-[url('/images/bottom_frog_jump.png')] bg-cover bg-center"
      : "bg-[url('/images/bottom_frog.png')] bg-cover bg-center"
);

const stateClasses = computed(() => ({
  'scale-105': props.selected,
  'drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]': props.selected
}));

const orientationStyle = computed(() => {
  const transforms: string[] = [];

  switch (props.orientation) {
    case 'side':
    case 'left-corner':
    case 'right-corner':
      transforms.push('scaleY(-1)');
      break;
    default:
      break;
  }

  if (typeof props.rotation === 'number') {
    transforms.push(`rotate(${props.rotation}deg)`);
  }

  return transforms.length ? { transform: `${transforms.join(' ')} !important` } : {};
});

</script>
