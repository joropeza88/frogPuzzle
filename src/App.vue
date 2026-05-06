<template>
  <HomeView v-if="currentScreen === 'home'" @start="handleStart" />
  <LevelSelectView
    v-else-if="currentScreen === 'level-select'"
    :max-level="maxLevel"
    :highest-unlocked-level="progress.highestUnlockedLevel"
    :completed-levels="progress.completedLevels"
    @exit="currentScreen = 'home'"
    @select-level="startGameAtLevel"
  />
  <GameView
    v-else-if="currentScreen === 'game'"
    :initial-level="selectedLevel"
    @exit="currentScreen = 'home'"
    @level-completed="markLevelCompleted"
    @completed="currentScreen = 'victory'"
  />
  <VictoryView v-else @exit="currentScreen = 'home'" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';
import GameView from './views/GameView.vue';
import LevelSelectView from './views/LevelSelectView.vue';
import VictoryView from './views/VictoryView.vue';
import { useProgress } from './composables/useProgress';

const maxLevel = 13;
const currentScreen = ref<'home' | 'level-select' | 'game' | 'victory'>('home');
const selectedLevel = ref(1);
const { progress, hasCompletedAnyLevel, markLevelCompleted } = useProgress(maxLevel);

function handleStart() {
  if (hasCompletedAnyLevel.value) {
    currentScreen.value = 'level-select';
    return;
  }

  startGameAtLevel(1);
}

function startGameAtLevel(level: number) {
  selectedLevel.value = Math.min(Math.max(level, 1), progress.value.highestUnlockedLevel);
  currentScreen.value = 'game';
}
</script>
