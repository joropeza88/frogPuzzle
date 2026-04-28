export type FrogColor = 'green' | 'brown';
export type BoardCell = FrogColor | null;

const DIRECTION: Record<FrogColor, number> = {
  green: 1,
  brown: -1
};

export function getFrogAt(board: BoardCell[], index: number): FrogColor | null {
  return board[index] ?? null;
}

export function getValidMoves(board: BoardCell[], index: number): number[] {
  const frog = getFrogAt(board, index);

  if (!frog) {
    return [];
  }

  const direction = DIRECTION[frog];
  const adjacentIndex = index + direction;
  const jumpIndex = index + direction * 2;
  const moves: number[] = [];

  if (board[adjacentIndex] === null) {
    moves.push(adjacentIndex);
  }

  if (
    board[adjacentIndex] !== undefined &&
    board[adjacentIndex] !== null &&
    board[jumpIndex] === null
  ) {
    moves.push(jumpIndex);
  }

  return moves;
}

export function isMoveValid(board: BoardCell[], fromIndex: number, toIndex: number): boolean {
  return getValidMoves(board, fromIndex).includes(toIndex);
}

export function moveFrog(board: BoardCell[], fromIndex: number, toIndex: number): BoardCell[] {
  if (!isMoveValid(board, fromIndex, toIndex)) {
    return board;
  }

  const nextBoard = [...board];
  nextBoard[toIndex] = nextBoard[fromIndex];
  nextBoard[fromIndex] = null;
  return nextBoard;
}

export function hasAnyValidMove(board: BoardCell[]): boolean {
  return board.some((cell, index) => cell !== null && getValidMoves(board, index).length > 0);
}

export function checkWinCondition(board: BoardCell[], greens: number, browns: number): boolean {
  const expected: BoardCell[] = [
    ...Array.from({ length: browns }, () => 'brown' as const),
    null,
    ...Array.from({ length: greens }, () => 'green' as const)
  ];

  return expected.length === board.length && expected.every((cell, index) => board[index] === cell);
}
