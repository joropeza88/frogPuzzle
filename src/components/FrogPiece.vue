<template>
  <div
    class="relative flex h-16 w-16 items-center justify-center rounded-[1.8rem] transition duration-300"
    :class="stateClasses"
  >
    <div
      class="absolute inset-0 z-10 animate-[breathe_2.4s_ease-in-out_infinite] bg-cover bg-center"
      :style="[frogImageStyle, orientationStyle]"
    ></div>
    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  BOTTOM_FROG_IMAGE,
  BOTTOM_FROG_JUMP_IMAGE,
  TOP_FROG_IMAGE,
  TOP_FROG_JUMP_IMAGE
} from '../constants/assets';
import type { FrogColor } from '../utils/movementRules';

const props = defineProps<{
  color: FrogColor;
  selected?: boolean;
  isJumping?: boolean;
  orientation?: 'default' | 'side' | 'left-corner' | 'right-corner';
  rotation?: number;
}>();

const frogImageStyle = computed(() => ({
  backgroundImage: `url(${props.color === 'green'
    ? props.isJumping
      ? TOP_FROG_JUMP_IMAGE
      : TOP_FROG_IMAGE
    : props.isJumping
      ? BOTTOM_FROG_JUMP_IMAGE
      : BOTTOM_FROG_IMAGE})`
}));

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
