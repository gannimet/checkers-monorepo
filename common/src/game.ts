import { BoardState, SquareState, getLineDiff, isValidSquare } from './board';

export type Move = {
  from: number;
  to: number;
  capture: number | null;
};

type Direction = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

type DirectionDiffMap = {
  [D in Direction]: [number, number];
};

const directionDiffMap: DirectionDiffMap = {
  topleft: [-9, -18],
  topright: [-7, -14],
  bottomleft: [7, 14],
  bottomright: [9, 18],
};

export function getValidMovesFromPosition(
  sourceSquareIndex: number,
  boardState: BoardState,
): Move[][] {
  const sourcePiece = boardState[sourceSquareIndex];

  const directionsToExplore: Direction[] = isKing(sourcePiece)
    ? ['topleft', 'topright', 'bottomleft', 'bottomright']
    : ['topleft', 'topright'];

  return directionsToExplore
    .map((direction) => {
      const squareAheadIndex =
        sourceSquareIndex + directionDiffMap[direction][0];

      if (
        isValidSquare(squareAheadIndex) &&
        getLineDiff(sourceSquareIndex, squareAheadIndex) === 1
      ) {
        const squareAheadOccupation = boardState[squareAheadIndex];

        if (squareAheadOccupation === SquareState.Empty) {
          // Normal move is possible
          return [
            [
              {
                from: sourceSquareIndex,
                to: squareAheadIndex,
                capture: null,
              },
            ],
          ];
        } else if (isOpponentPiece(sourcePiece, squareAheadOccupation)) {
          // Opponent piece ahead, explore jump possibilities
          return findJumpSequences(
            sourcePiece,
            sourceSquareIndex,
            boardState,
            direction,
            [],
          );
        }
      }

      return [];
    })
    .filter((jumpSequence) => jumpSequence.length > 1)
    .flat();
}

function findJumpSequences(
  sourcePiece: SquareState,
  sourceSquareIndex: number,
  boardState: BoardState,
  direction: Direction,
  visitedSquareIndices: number[],
): Move[][] {
  const targetIndex = sourceSquareIndex + directionDiffMap[direction][0];

  if (
    !isValidSquare(targetIndex) ||
    !isOpponent(sourcePiece, targetIndex, boardState) ||
    getLineDiff(sourceSquareIndex, targetIndex) !== 1
  ) {
    // Next square is either out of bounds or there is no opponent piece on it
    return [[]];
  }

  // Look one step ahead of opponent directly in front/behind
  const jumpAheadIndex = sourceSquareIndex + directionDiffMap[direction][1];

  if (
    !isValidSquare(jumpAheadIndex) ||
    !isSquareEmpty(jumpAheadIndex, boardState) ||
    getLineDiff(sourceSquareIndex, jumpAheadIndex) !== 2 ||
    visitedSquareIndices.includes(jumpAheadIndex)
  ) {
    /*
     * Square beyond is either:
     *  - out of bounds
     *  - already occupied
     *  - already visited in the current jump sequence
     */
    return [[]];
  }

  // Square beyond direct opponent is free - jump possible!
  const jumpMove: Move = {
    from: sourceSquareIndex,
    to: jumpAheadIndex,
    capture: targetIndex,
  };

  // Explore possible jumps from this new square
  const directionsToExplore: Direction[] = isKing(sourcePiece)
    ? ['topleft', 'topright', 'bottomleft', 'bottomright']
    : ['topleft', 'topright']; // TODO be careful when investigating the board from Black's POV

  return [
    [[]],
    ...directionsToExplore
      .map((direction) =>
        findJumpSequences(sourcePiece, jumpAheadIndex, boardState, direction, [
          ...visitedSquareIndices,
          sourceSquareIndex,
        ]),
      )
      .filter((jss) => !(jss.length === 1 && jss[0].length === 0)),
  ]
    .map((jumpSequences) => {
      return jumpSequences.map((jumpSequence) => [jumpMove, ...jumpSequence]);
    })
    .flat();
}

function isOpponent(
  sourcePiece: SquareState,
  targetIndex: number,
  boardState: BoardState,
): boolean {
  if (isValidSquare(targetIndex)) {
    if (isWhite(sourcePiece)) {
      return isBlack(boardState[targetIndex]);
    }

    if (isBlack(sourcePiece)) {
      return isWhite(boardState[targetIndex]);
    }
  }

  return false;
}

export function isSquareEmpty(index: number, boardState: BoardState) {
  return boardState[index] === SquareState.Empty;
}

export function isWhite(piece: SquareState) {
  return piece === SquareState.White || piece === SquareState.WhiteKing;
}

export function isBlack(piece: SquareState) {
  return piece === SquareState.Black || piece === SquareState.BlackKing;
}

export function isKing(piece: SquareState) {
  return piece === SquareState.BlackKing || piece == SquareState.WhiteKing;
}

export function isOpponentPiece(
  sourcePiece: SquareState,
  otherPiece: SquareState,
) {
  return isWhite(sourcePiece) ? isBlack(otherPiece) : isWhite(otherPiece);
}
