<template>
  <footer class="space-y-3 absolute w-full bottom-6 left-0 p-4 z-10">
    <div class="flex gap-3 w-full items-center">
    
        <button
          type="button"
          :class="isExitPressed ? 'translate-y-[4px] shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)]' : ''"
          :disabled="isExitPressed"
          @click="handleExit"
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
        >
          
          <img src="/images/out.webp" alt="Salir" class="w-8 h-8"/>
        </button>
        
        <button
          class="
            relative
            h-16 w-40
            ml-auto
            rounded-full
            bg-[#039088]
            shadow-[0_5px_0_#005f5a,0_10px_14px_rgba(0,0,0,0.18)]
            active:translate-y-[3px]
            active:shadow-[0_2px_0_#005f5a,0_6px_10px_rgba(0,0,0,0.14)]
            transition-all duration-150
            flex items-center justify-end
            pr-5
          "
        >
          
          <!-- panel interior -->
          <div
            class="
              absolute left-2 right-16 top-1/2 -translate-y-1/2
              h-11
              rounded-full
              bg-[#f8f0dd]
              shadow-inner
              flex items-center justify-center
              font-black text-xl tracking-wide text-[#6f4a2f]
            "
          >
            SALTOS
          </div>

          <!-- símbolo + -->
          <span class="relative z-10 text-xl font-black text-[#fff3fb]">{{ movesCount }}</span>
        </button>
        
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  playSoundEffect,
  preloadSoundEffect,
  resumeSoundEffects
} from '../composables/useSoundEffects';
import { waitForAnimationFrameDelay } from '../utils/animationFrame';

const props = defineProps<{
  movesCount: number;
}>();

const emit = defineEmits<{
  exit: [];
}>();

const isExitPressed = ref(false);

void preloadSoundEffect('/sounds/button-press.mp3');

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
