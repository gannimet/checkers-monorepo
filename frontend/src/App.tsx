import { BoardState, PlayerId, SquareState } from 'common';
import { useCallback, useRef, useState } from 'react';
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
  const [gameState, setGameState] = useState(GameState.Idle);
  const [winnerId, setWinnerId] = useState<PlayerId>();

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
      setGameState(GameState.Running);
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
    socket?.applyForGame();
  }, [socket]);

  return (
    <>
      {gameState === GameState.Idle && (
        <IdleScreen onPlayBtnClick={() => onPlayBtnClick()}></IdleScreen>
      )}

      {gameState === GameState.WaitingForOpponent && (
        <WaitingForOpponentScreen></WaitingForOpponentScreen>
      )}

      {gameState === GameState.Running && <Board boardState={boardState} />}

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
