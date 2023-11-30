export enum SquareState {
  Empty = 0,
  White = 1,
  WhiteKing = 11,
  Black = 2,
  BlackKing = 22,
}

export type BoardState = SquareState[];
