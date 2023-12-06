export type Position = [number, number]; // [column, row]

export function indexToPosition(i: number): Position {
  const row = Math.round(i >> 3);
  const column = i % 8;

  return [row, column];
}

export function positionToIndex([column, row]: Position) {
  return (row << 3) + column;
}

export function isValidSquare(squareIndex: number) {
  return squareIndex >= 0 && squareIndex < 64;
}

export function getLineDiff(sourceIndex: number, targetIndex: number) {
  return Math.abs((sourceIndex >> 3) - (targetIndex >> 3));
}

export enum SquareState {
  Empty = 0,
  White = 1,
  WhiteKing = 11,
  Black = 2,
  BlackKing = 22,
}

export type BoardState = SquareState[];
