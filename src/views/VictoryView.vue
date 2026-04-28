<template>
  <main class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col box-border bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.36),_transparent_30%),linear-gradient(180deg,_#06281f_0%,_#0f172a_58%,_#020617_100%)] px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-white">
    <section class="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/8 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.36)] backdrop-blur my-6">
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

      <button
          type="button"
          class="
          relative
          h-16 w-40 mx-auto
          rounded-full font-black text-xl tracking-wide text-white
          border-4 border-[#039088]
          shadow-[0_4px_0_#005f5a,0_14px_18px_rgba(0,0,0,0.18)]
          active:translate-y-[4px]
          active:shadow-[0_2px_0_#005f5a,0_8px_12px_rgba(0,0,0,0.14)]
          transition-all duration-150
          flex items-center justify-center 
          bg-gradient-to-b from-emerald-400 to-[#039088] mb-10"
          @click="$emit('exit')"
        >
          SALIR
      </button>

    </section>
  </main>
</template>

<script setup lang="ts">
defineEmits<{
  exit: [];
}>();
</script>
