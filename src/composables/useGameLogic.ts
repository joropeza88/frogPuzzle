import { computed, ref } from 'vue';
import { useLevels } from './useLevels';
import { useTimer } from './useTimer';
import {
  checkWinCondition,
  getValidMoves,
  hasAnyValidMove,
  moveFrog,
  type BoardCell,
  type FrogColor
} from '../utils/movementRules';

export type GameStatus = 'playing' | 'won' | 'lost';
export type LossReason = 'timeout' | 'stuck';
export interface MoveAnimation {
  key: number;
  fromIndex: number;
  toIndex: number;
  color: FrogColor;
  jumped: boolean;
}

export function useGameLogic() {
  const levels = useLevels();
  const jumpAudio =
    typeof Audio === 'undefined' ? null : new Audio('sounds/jump.wav');
  const currentLevel = ref(1);
  const board = ref<BoardCell[]>([]);
  const selectedIndex = ref<number | null>(null);
  const validMoves = ref<number[]>([]);
  const status = ref<GameStatus>('playing');
  const lossReason = ref<LossReason | null>(null);
  const movesCount = ref(0);
  const errorIndex = ref<number | null>(null);
  const activeMove = ref<MoveAnimation | null>(null);
  let errorTimeout: number | null = null;
  let moveAnimationTimeout: number | null = null;
  let moveAnimationKey = 0;

  const levelConfig = computed(() => levels.generateLevel(currentLevel.value));
  const timer = useTimer(() => {
    if (status.value === 'playing') {
      status.value = 'lost';
      lossReason.value = 'timeout';
      selectedIndex.value = null;
      validMoves.value = [];
    }
  });

  if (jumpAudio) {
    jumpAudio.preload = 'auto';
    jumpAudio.volume = 0.45;
  }

  function clearError() {
    if (errorTimeout !== null) {
      window.clearTimeout(errorTimeout);
      errorTimeout = null;
    }

    errorIndex.value = null;
  }

  function flashError(index: number) {
    clearError();
    errorIndex.value = index;
    errorTimeout = window.setTimeout(() => {
      errorIndex.value = null;
      errorTimeout = null;
    }, 360);
  }

  function clearMoveAnimation() {
    if (moveAnimationTimeout !== null) {
      window.clearTimeout(moveAnimationTimeout);
      moveAnimationTimeout = null;
    }

    activeMove.value = null;
  }

  function playJumpSound() {
    if (!jumpAudio) {
      return;
    }

    jumpAudio.currentTime = 0;
    void jumpAudio.play().catch(() => {
      // Ignora bloqueos del navegador si el audio aún no puede reproducirse.
    });
  }

  function queueMoveAnimation(fromIndex: number, toIndex: number, color: FrogColor) {
    clearMoveAnimation();
    moveAnimationKey += 1;
    activeMove.value = {
      key: moveAnimationKey,
      fromIndex,
      toIndex,
      color,
      jumped: Math.abs(toIndex - fromIndex) === 2
    };
    playJumpSound();
    moveAnimationTimeout = window.setTimeout(() => {
      activeMove.value = null;
      moveAnimationTimeout = null;
    }, 520);
  }

  function loadLevel(level: number) {
    currentLevel.value = Math.min(Math.max(level, 1), levels.maxLevel);
    const nextConfig = levels.generateLevel(currentLevel.value);

    board.value = [...nextConfig.board];
    status.value = 'playing';
    lossReason.value = null;
    selectedIndex.value = null;
    validMoves.value = [];
    movesCount.value = 0;
    clearError();
    clearMoveAnimation();
    timer.reset(nextConfig.timeLimit);
    timer.start();
  }

  function selectIndex(index: number) {
    if (status.value !== 'playing') {
      return;
    }

    const frog = board.value[index];

    if (selectedIndex.value !== null && validMoves.value.includes(index)) {
      const fromIndex = selectedIndex.value;
      const movingColor = board.value[fromIndex];
      const nextBoard = moveFrog(board.value, fromIndex, index);

      if (nextBoard === board.value) {
        flashError(index);
        return;
      }

      if (!movingColor) {
        flashError(index);
        return;
      }

      board.value = nextBoard;
      queueMoveAnimation(fromIndex, index, movingColor);
      selectedIndex.value = null;
      validMoves.value = [];
      movesCount.value += 1;

      if (
        checkWinCondition(board.value, levelConfig.value.greens, levelConfig.value.browns)
      ) {
        status.value = 'won';
        lossReason.value = null;
        timer.stop();
        return;
      }

      if (!hasAnyValidMove(board.value)) {
        status.value = 'lost';
        lossReason.value = 'stuck';
        timer.stop();
      }

      return;
    }

    if (!frog) {
      selectedIndex.value = null;
      validMoves.value = [];
      flashError(index);
      return;
    }

    const moves = getValidMoves(board.value, index);
    selectedIndex.value = index;
    validMoves.value = moves;

    if (moves.length === 0) {
      flashError(index);
    }
  }

  function resetLevel() {
    loadLevel(currentLevel.value);
  }

  function nextLevel() {
    if (currentLevel.value >= levels.maxLevel) {
      loadLevel(levels.maxLevel);
      return;
    }

    loadLevel(currentLevel.value + 1);
  }

  const canAdvance = computed(
    () => status.value === 'won' && currentLevel.value < levels.maxLevel
  );

  loadLevel(1);

  return {
    board,
    currentLevel,
    maxLevel: levels.maxLevel,
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
  };
}
