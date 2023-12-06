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
  const result: Move[][] = [];

  if (sourcePiece === SquareState.White) {
    const topLeftIndex = sourceSquareIndex + directionDiffMap['topleft'][0];
    const topRightIndex = sourceSquareIndex + directionDiffMap['topright'][0];

    // if (
    //   isValidSquare(topLeftIndex) &&
    //   getLineDiff(sourceSquareIndex, topLeftIndex) === 1
    // ) {
    //   const topLeftOccupation = boardState[topLeftIndex];

    //   if (topLeftOccupation === SquareState.Empty) {
    //     result.push([
    //       {
    //         from: sourceSquareIndex,
    //         to: topLeftIndex,
    //         capture: null,
    //       },
    //     ]);
    //   } else if (isBlack(topLeftOccupation)) {
    //     const jumpSequences = findJumpSequences(
    //       sourcePiece,
    //       sourceSquareIndex,
    //       boardState,
    //       'topleft',
    //     );

    //     result.push(...jumpSequences);
    //   }
    // }

    if (
      isValidSquare(topRightIndex) &&
      getLineDiff(sourceSquareIndex, topRightIndex) === 1
    ) {
      const topRightOccupation = boardState[topRightIndex];

      if (topRightOccupation === SquareState.Empty) {
        result.push([
          {
            from: sourceSquareIndex,
            to: topRightIndex,
            capture: null,
          },
        ]);
      } else if (isBlack(topRightOccupation)) {
        const jumpSequences = findJumpSequences(
          sourcePiece,
          sourceSquareIndex,
          boardState,
          'topright',
        );

        result.push(...jumpSequences);
      }
    }

    return result;
  }

  if (sourcePiece === SquareState.WhiteKing) {
    return [];
  }

  if (sourcePiece === SquareState.Black) {
    return [];
  }

  if (sourcePiece === SquareState.BlackKing) {
    return [];
  }

  return [];
}

function findJumpSequences(
  sourcePiece: SquareState,
  sourceSquareIndex: number,
  boardState: BoardState,
  direction: Direction,
): Move[][] {
  console.log('-----');
  console.log('source square:', sourceSquareIndex);
  console.log('direction:', direction);
  const targetIndex = sourceSquareIndex + directionDiffMap[direction][0];

  if (
    !isValidSquare(targetIndex) ||
    !isOpponent(sourcePiece, targetIndex, boardState) ||
    getLineDiff(sourceSquareIndex, targetIndex) !== 1
  ) {
    // Next square is either out of bounds or there is no opponent piece on it
    return [];
  }

  // Look one step ahead of opponent directly in front/behind
  const jumpAheadIndex = sourceSquareIndex + directionDiffMap[direction][1];

  if (
    !isValidSquare(jumpAheadIndex) ||
    !isSquareEmpty(jumpAheadIndex, boardState) ||
    getLineDiff(sourceSquareIndex, jumpAheadIndex) !== 2
  ) {
    // Square beyond is either out of bounds or it's already occupied
    return [];
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

  const sequences = directionsToExplore
    .map((direction) => {
      console.log(
        'calling it new from index:',
        jumpAheadIndex,
        'with direction:',
        direction,
      );
      return findJumpSequences(
        sourcePiece,
        jumpAheadIndex,
        boardState,
        direction,
      );
    })
    .map((jumpSequences) => {
      if (jumpSequences.length === 0) {
        return [[jumpMove]];
      }

      return jumpSequences.map((jumpSequence) => {
        return [jumpMove].concat(jumpSequence);
      });
    })
    .flat();

  return sequences;
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
