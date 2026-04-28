<template>
  <HomeView v-if="currentScreen === 'home'" @start="currentScreen = 'game'" />
  <GameView
    v-else-if="currentScreen === 'game'"
    @exit="currentScreen = 'home'"
    @completed="currentScreen = 'victory'"
  />
  <VictoryView v-else @exit="currentScreen = 'home'" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';
import GameView from './views/GameView.vue';
import VictoryView from './views/VictoryView.vue';

const currentScreen = ref<'home' | 'game' | 'victory'>('home');
</script>
