import type { BoardCell } from '../utils/movementRules';

export interface LevelConfig {
  level: number;
  greens: number;
  browns: number;
  board: BoardCell[];
  timeLimit: number;
  minimumMoves: number;
}

export function useLevels(maxLevel = 13) {
  function getCounts(level: number) {
    const safeLevel = Math.max(1, level);
    const greens = Math.min(7, Math.ceil((safeLevel + 1) / 2));
    const browns = Math.min(7, Math.ceil(safeLevel / 2));

    return { greens, browns };
  }

  function generateLevel(level: number): LevelConfig {
    const clampedLevel = Math.min(Math.max(level, 1), maxLevel);
    const { greens, browns } = getCounts(clampedLevel);
    const board: BoardCell[] = [
      ...Array.from({ length: greens }, () => 'green' as const),
      null,
      ...Array.from({ length: browns }, () => 'brown' as const)
    ];

    return {
      level: clampedLevel,
      greens,
      browns,
      board,
      timeLimit: 18 + clampedLevel * 6,
      minimumMoves: greens * browns + greens + browns
    };
  }

  return {
    maxLevel,
    generateLevel
  };
}
