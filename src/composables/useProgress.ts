import { computed, ref } from 'vue';

const STORAGE_KEY = 'frog-puzzle-progress';
const MAX_LEVEL = 13;

interface PersistedProgress {
  completedLevels: number[];
  highestUnlockedLevel: number;
}

function normalizeLevel(level: number) {
  return Math.min(Math.max(Math.floor(level), 1), MAX_LEVEL);
}

function sanitizeProgress(value: unknown): PersistedProgress {
  if (!value || typeof value !== 'object') {
    return {
      completedLevels: [],
      highestUnlockedLevel: 1
    };
  }

  const candidate = value as Partial<PersistedProgress>;
  const completedLevels = Array.isArray(candidate.completedLevels)
    ? [...new Set(
        candidate.completedLevels
          .filter((level) => Number.isInteger(level))
          .map((level) => normalizeLevel(level as number))
      )].sort((left, right) => left - right)
    : [];

  const highestCompletedLevel =
    completedLevels.length > 0 ? completedLevels[completedLevels.length - 1] : 0;
  const requestedHighestUnlocked =
    typeof candidate.highestUnlockedLevel === 'number'
      ? normalizeLevel(candidate.highestUnlockedLevel)
      : 1;

  return {
    completedLevels,
    highestUnlockedLevel: Math.max(
      1,
      Math.min(MAX_LEVEL, Math.max(requestedHighestUnlocked, highestCompletedLevel + 1))
    )
  };
}

function readStoredProgress() {
  if (typeof window === 'undefined') {
    return sanitizeProgress(null);
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return sanitizeProgress(null);
    }

    return sanitizeProgress(JSON.parse(rawValue));
  } catch {
    return sanitizeProgress(null);
  }
}

export function useProgress(maxLevel = MAX_LEVEL) {
  const progress = ref(readStoredProgress());

  function persist() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress.value)
    );
  }

  function markLevelCompleted(level: number) {
    const safeLevel = Math.min(normalizeLevel(level), maxLevel);
    const completedLevels = new Set(progress.value.completedLevels);

    completedLevels.add(safeLevel);

    progress.value = {
      completedLevels: [...completedLevels].sort((left, right) => left - right),
      highestUnlockedLevel: Math.min(
        maxLevel,
        Math.max(progress.value.highestUnlockedLevel, safeLevel + 1)
      )
    };

    persist();
  }

  function isLevelCompleted(level: number) {
    return progress.value.completedLevels.includes(normalizeLevel(level));
  }

  function isLevelUnlocked(level: number) {
    return normalizeLevel(level) <= progress.value.highestUnlockedLevel;
  }

  function resetProgress() {
    progress.value = {
      completedLevels: [],
      highestUnlockedLevel: 1
    };
    persist();
  }

  const hasCompletedAnyLevel = computed(
    () => progress.value.completedLevels.length > 0
  );

  return {
    progress,
    hasCompletedAnyLevel,
    markLevelCompleted,
    isLevelCompleted,
    isLevelUnlocked,
    resetProgress
  };
}
