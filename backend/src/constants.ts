import { BoardState, Position, positionToIndex } from 'common';

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
    [1, 6],
    [3, 6],
    [5, 6],
    [7, 6],
    [0, 7],
    [2, 7],
    [4, 7],
    [6, 7],
  ];

  const initialBlackPositions: Position[] = [
    [1, 0],
    [3, 0],
    [5, 0],
    [7, 0],
    [0, 1],
    [2, 1],
    [5, 2],
    [6, 1],
    [1, 2],
    [3, 2],
    [4, 1],
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

  return initialState;
}
