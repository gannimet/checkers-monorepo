import { BoardState, GameId, Move, PlayerId, SquareState } from 'common';
import { useCallback, useMemo, useRef, useState } from 'react';
import './App.scss';
import AbortedScreen from './aborted-screen/AbortedScreen';
import Board from './board/Board';
import IdleScreen from './idle-screen/IdleScreen';
import OverScreen from './over-screen/OverScreen';
import WaitingForOpponentScreen from './waiting-for-opponent-screen/WaitingForOpponentScreen';
import { SocketCallbackConfig } from './websocket/checkers-socket-messages.model';
import useCheckersSocket from './websocket/use-checkers-socket';

const defaultBoardState: BoardState = new Array<SquareState>(64).fill(
  SquareState.Empty,
);

enum GameState {
  Idle,
  WaitingForOpponent,
  Running,
  Over,
  Aborted,
}

function App() {
  const [boardState, setBoardState] = useState<BoardState>(defaultBoardState);
  const [playerId, setPlayerId] = useState<PlayerId>();
  const [gameId, setGameId] = useState<GameId>();
  const [gameState, setGameState] = useState(GameState.Idle);
  const [winnerId, setWinnerId] = useState<PlayerId>();
  const [pieceColor, setPieceColor] = useState<
    SquareState.White | SquareState.Black
  >();
  const [currentTurn, setCurrentTurn] = useState<PlayerId>();

  const isGameReady = useMemo(() => {
    return (
      gameState === GameState.Running &&
      !!gameId &&
      !!playerId &&
      pieceColor != null
    );
  }, [gameState, gameId, playerId, pieceColor]);

  const opponentPieceColor = useMemo(() => {
    return pieceColor === SquareState.White
      ? SquareState.Black
      : SquareState.White;
  }, [pieceColor]);

  const currentTurnColor = useMemo(() => {
    if (currentTurn === playerId) {
      // Local player has current turn, return his color
      return pieceColor;
    }

    // Opponent has current turn, return opposite of local player color
    return opponentPieceColor;
  }, [currentTurn, playerId, opponentPieceColor]);

  const socketConfig = useRef<SocketCallbackConfig>({
    onConnected: () => {
      console.log('Connection established');
    },
    onPlayerConfirm: (message) => {
      setPlayerId(message.playerId);
      setGameState(GameState.WaitingForOpponent);
    },
    onGameStarted: (message) => {
      setBoardState(message.boardState);
      setGameId(message.gameId);
      setPieceColor(message.color);
      setCurrentTurn(message.firstTurn);
      setGameState(GameState.Running);
    },
    onTurnPlayed: (message) => {
      setCurrentTurn(message.nextTurn);
      setBoardState(message.boardState);
    },
    onGameAborted: () => {
      setGameState(GameState.Aborted);
    },
    onGameOver: (message) => {
      setGameState(GameState.Over);
      setWinnerId(message.winner);
    },
  });

  const socket = useCheckersSocket(socketConfig.current);

  const onPlayBtnClick = useCallback(() => {
    socket.applyForGame();
  }, [socket]);

  const onMoveSelected = useCallback(
    (moveSequence: Move[]) => {
      if (gameId && playerId) {
        socket.playTurn(gameId, playerId, moveSequence);
      }
    },
    [socket, gameId, playerId],
  );

  const onAbortBtnClick = useCallback(() => {
    if (gameId && playerId) {
      socket.abortGame(gameId, playerId);
    }
  }, [socket, gameId, playerId]);

  return (
    <>
      {gameState === GameState.Idle && (
        <IdleScreen onPlayBtnClick={() => onPlayBtnClick()}></IdleScreen>
      )}

      {gameState === GameState.WaitingForOpponent && (
        <WaitingForOpponentScreen></WaitingForOpponentScreen>
      )}

      {isGameReady && (
        <Board
          boardState={boardState}
          localPlayerColor={pieceColor!}
          currentTurnColor={currentTurnColor!}
          onAbortBtnClick={() => onAbortBtnClick()}
          onMoveSelected={(moveSequence) => onMoveSelected(moveSequence)}
        />
      )}

      {gameState === GameState.Aborted && (
        <AbortedScreen onPlayBtnClick={() => onPlayBtnClick()}></AbortedScreen>
      )}

      {gameState === GameState.Over && (
        <OverScreen
          onPlayBtnClick={() => onPlayBtnClick()}
          localPlayerHasWon={winnerId === playerId}
        ></OverScreen>
      )}
    </>
  );
}

export default App;
