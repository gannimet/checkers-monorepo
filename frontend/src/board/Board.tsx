import {
  BoardState,
  Move,
  Position,
  SquareState,
  getValidMovesFromPosition,
  isBlack,
  isKing,
  isWhite,
  positionToIndex,
} from 'common';
import React, { useCallback, useMemo, useState } from 'react';
import './Board.scss';
import {
  getHighlightedSquareIndicesForPossibleMoves,
  getSquareColorClassName,
  getSquareStateClassName,
} from './Board.utils';

type BoardProps = {
  boardState: BoardState;
  localPlayerColor: SquareState.White | SquareState.Black;
  currentTurnColor: SquareState.White | SquareState.Black;
  onAbortBtnClick: () => void;
  onMoveSelected: (moveSequence: Move[]) => void;
};

const Board = React.memo<BoardProps>(
  ({
    boardState,
    localPlayerColor,
    currentTurnColor,
    onAbortBtnClick,
    onMoveSelected,
  }) => {
    const rows = new Array(8).fill(0);
    const columns = new Array(8).fill(0);
    const [validMoves, setValidMoves] = useState<Move[][]>([]);
    const [isMovePreviewActive, setIsMovePreviewActive] = useState(false);

    const highlightedSquareIndices = useMemo(() => {
      return getHighlightedSquareIndicesForPossibleMoves(validMoves);
    }, [validMoves]);

    const onCellClick = useCallback(
      (sourceIndex: number) => {
        if (isMovePreviewActive) {
          const selectedMoveSequence = validMoves.find((moveSequence) => {
            return (
              moveSequence.length > 0 &&
              moveSequence[moveSequence.length - 1].to === sourceIndex
            );
          });

          if (selectedMoveSequence) {
            onMoveSelected(selectedMoveSequence);
          }

          setIsMovePreviewActive(false);
          setValidMoves([]);
        } else {
          const clickedPiece = boardState[sourceIndex];
          const isClickedPiecePlayerColor =
            localPlayerColor === SquareState.White
              ? isWhite(clickedPiece)
              : isBlack(clickedPiece);
          const isLocalPlayersTurn = localPlayerColor === currentTurnColor;

          if (!isLocalPlayersTurn || !isClickedPiecePlayerColor) {
            setValidMoves([]);
            setIsMovePreviewActive(false);
            return;
          }

          const possibleMoves = getValidMovesFromPosition(
            sourceIndex,
            boardState,
          );
          setValidMoves(possibleMoves);

          if (possibleMoves.length > 0) {
            setIsMovePreviewActive(true);
          }
        }
      },
      [boardState, isMovePreviewActive],
    );

    return (
      <>
        <h3>
          You play {localPlayerColor === SquareState.White ? 'white' : 'black'}
        </h3>
        <div className="board">
          {rows.map((_, rowIndex) =>
            columns
              .map((_, columnIndex) => {
                const position: Position = [columnIndex, rowIndex];
                const squareIndex = positionToIndex(position);
                const squareState = boardState[squareIndex];
                const stateClassName = getSquareStateClassName(squareState);
                const squareColorClassName = getSquareColorClassName(position);
                const kingClassName = isKing(squareState) ? 'king' : '';
                const validMoveClass = highlightedSquareIndices.includes(
                  squareIndex,
                )
                  ? 'valid-move'
                  : '';

                return (
                  <div
                    className={`board__cell ${squareColorClassName} ${validMoveClass}`}
                    key={`r${rowIndex}c${columnIndex}`}
                    onClick={() => onCellClick(squareIndex)}
                  >
                    {squareState !== SquareState.Empty && (
                      <div
                        className={`piece ${stateClassName} ${kingClassName}`}
                      ></div>
                    )}
                    {squareState === SquareState.Empty && <></>}
                  </div>
                );
              })
              .flat(),
          )}
        </div>
        <div>
          <button onClick={() => onAbortBtnClick()}>Abort game</button>
        </div>
      </>
    );
  },
);

Board.displayName = 'Board';

export default Board;
