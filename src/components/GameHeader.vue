<template>
  <header class="pointer-events-none w-full flex items-center justify-between absolute top-10 left-0 p-4 z-10">
    
    <button
    class="
      relative
      h-16 w-40
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
    <!-- estrella 
    <div
      class="
        absolute -left-3 top-1/2 -translate-y-1/2
        h-16 w-16
        rounded-full
        bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-500
        shadow-[0_4px_8px_rgba(0,0,0,0.18)]
        flex items-center justify-center
        text-3xl
      "
    >
      ★
    </div> -->

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
      NIVEL
    </div>

    <!-- símbolo + -->
    <span class="relative z-10 text-xl font-black text-[#fff3fb]">{{ level }}</span>
  </button>
    

  <button
      class="
        relative
        h-16 w-30
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
      <span class="font-black text-xl tracking-wide text-[#6f4a2f]">{{ formattedTime }}</span>
  </button>
    
  </header>
</template>

<script setup lang="ts">
defineProps<{
  level: number;
  maxLevel: number;
  formattedTime: string;
}>();
</script>
