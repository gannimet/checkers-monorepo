import { Position, positionToIndex } from 'common/dist/board-utils';
import React from 'react';
import { SquareState } from '../game.model';
import './Board.scss';
import { BoardProps } from './Board.types';

const Board = React.memo<BoardProps>(({ boardState }) => {
  const rows = new Array(8).fill(0);
  const columns = new Array(8).fill(0);

  function getSquareStateClassName(squareState: SquareState) {
    switch (squareState) {
      case SquareState.Empty:
        return 'empty';
      case SquareState.White:
        return 'white';
      case SquareState.WhiteKing:
        return 'white-king';
      case SquareState.Black:
        return 'black';
      case SquareState.BlackKing:
        return 'black-king';
    }
  }

  function getSquareColorClassName([column, row]: Position) {
    if (column % 2 === 0) {
      return row % 2 === 0 ? 'white' : 'black';
    }

    return row % 2 === 0 ? 'black' : 'white';
  }

  return (
    <div className="board">
      {rows.map((_, rowIndex) =>
        columns
          .map((_, columnIndex) => {
            const position: Position = [columnIndex, rowIndex];
            const squareIndex = positionToIndex(position);
            const squareState = boardState[squareIndex];
            const stateClassName = getSquareStateClassName(squareState);
            const squareColorClassName = getSquareColorClassName(position);

            return (
              <div
                className={`board__cell ${squareColorClassName}`}
                key={`r${rowIndex}c${columnIndex}`}
              >
                {squareState !== SquareState.Empty && (
                  <div className={`piece ${stateClassName} king`}></div>
                )}
                {squareState === SquareState.Empty && <></>}
              </div>
            );
          })
          .flat(),
      )}
    </div>
  );
});

Board.displayName = 'Board';

export default Board;
