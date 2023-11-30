import { useEffect, useState } from 'react';
import { CONFIG } from '../config';
import {
  IncomingSocketMessage,
  SocketCallbackConfig,
} from './checkers-socket-messages.model';

export default function useCheckersSocket(
  callbackConfig: SocketCallbackConfig,
) {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const theSocket = new WebSocket(CONFIG.websocketUrl);
    setSocket(theSocket);

    theSocket.addEventListener('open', () => {
      handleConnection(callbackConfig);
    });

    theSocket.addEventListener('message', (message) => {
      const parsedMessage: IncomingSocketMessage = JSON.parse(message.data);

      handleMessage(parsedMessage, callbackConfig);
    });

    return () => {
      theSocket.close();
    };
  }, [callbackConfig]);

  return {
    socket,
  };
}

function handleConnection(callbackConfig: SocketCallbackConfig) {
  const { onConnected } = callbackConfig;

  onConnected && onConnected();
}

function handleMessage(
  message: IncomingSocketMessage,
  callbackConfig: SocketCallbackConfig,
) {
  const { onPlayerConfirm, onGameStarted, onTurnPlayed, onGameOver } =
    callbackConfig;

  switch (message.type) {
    case 'playerConfirm': {
      onPlayerConfirm && onPlayerConfirm(message);
      break;
    }
    case 'gameStarted': {
      onGameStarted && onGameStarted(message);
      break;
    }
    case 'turnPlayed': {
      onTurnPlayed && onTurnPlayed(message);
      break;
    }
    case 'gameOver': {
      onGameOver && onGameOver(message);
      break;
    }
  }
}
