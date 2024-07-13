import { Move, Position, SquareState } from 'common';

export function getSquareStateClassName(squareState: SquareState) {
  switch (squareState) {
    case SquareState.Empty:
      return 'empty';
    case SquareState.White:
    case SquareState.WhiteKing:
      return 'white';
    case SquareState.Black:
    case SquareState.BlackKing:
      return 'black';
  }
}

export function getSquareColorClassName([column, row]: Position) {
  if (column % 2 === 0) {
    return row % 2 === 0 ? 'white' : 'black';
  }

  return row % 2 === 0 ? 'black' : 'white';
}

export function getHighlightedSquareIndicesForPossibleMoves(
  moves: Move[][],
): number[] {
  return Array.from(
    new Set(
      moves
        .map((moveSequence) => {
          return moveSequence.map((move) => move.to);
        })
        .flat(),
    ),
  );
}
