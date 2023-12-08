import { BoardState, Position, SquareState, positionToIndex } from 'common';

export function getInitialBoardState(): BoardState {
  /**
   * 0 - empty
   * 1 - white
   * 11 - white king
   * 2 - black
   * 22 - black king
   */
  const initialState = new Array(64).fill(0);

  const initialWhitePositions: Position[] = [
    [0, 5],
    [2, 5],
    [4, 5],
    [6, 5],
    [6, 3],
    [3, 6],
    [5, 6],
    [7, 6],
    [0, 7],
    [2, 7],
    [4, 7],
    [6, 7],
  ];

  const initialBlackPositions: Position[] = [
    [3, 4],
    [3, 0],
    [5, 0],
    [7, 0],
    [0, 3],
    [2, 1],
    [5, 2],
    [6, 1],
    [1, 2],
    [3, 2],
    [5, 4],
    [7, 2],
  ];

  initialWhitePositions.forEach((position) => {
    const index = positionToIndex(position);

    initialState[index] = 1;
  });

  initialBlackPositions.forEach((position) => {
    const index = positionToIndex(position);

    initialState[index] = 2;
  });

  initialState[44] = SquareState.WhiteKing;

  return initialState;
}
