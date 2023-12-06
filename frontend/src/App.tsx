import { BoardState, SquareState } from 'common/dist/board';
import { useCallback, useRef, useState } from 'react';
import './App.scss';
import Board from './board/Board';
import {
  PlayerId,
  SocketCallbackConfig,
} from './websocket/checkers-socket-messages.model';
import useCheckersSocket from './websocket/use-checkers-socket';

const defaultBoardState: BoardState = new Array<SquareState>(64).fill(
  SquareState.Empty,
);

function App() {
  const [boardState, setBoardState] = useState<BoardState>(defaultBoardState);
  const [playerId, setPlayerId] = useState<PlayerId>();

  const socketConfig = useRef<SocketCallbackConfig>({
    onConnected: () => {
      console.log('Connection established');
    },
    onPlayerConfirm: (message) => {
      setPlayerId(message.playerId);
    },
    onGameStarted: (message) => {
      setBoardState(message.boardState);
    },
  });

  const { socket } = useCheckersSocket(socketConfig.current);

  const onSend = useCallback(() => {
    socket && socket.send('Button clicked!');
  }, [socket]);

  return (
    <>
      <div>
        <button onClick={() => onSend()}>Send</button>
        Player ID: {playerId}
      </div>
      <Board boardState={boardState} />
    </>
  );
}

export default App;
