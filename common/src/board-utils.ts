export type Position = [number, number]; // [column, row]

export function indexToPosition(i: number): Position {
  const row = Math.round(i / 8);
  const column = i % 8;

  return [row, column];
}

export function positionToIndex([column, row]: Position) {
  return row * 8 + column;
}
