import { DownstreamSocketMessage } from 'common';
import { useEffect, useRef } from 'react';
import { CONFIG } from '../config';
import { CheckersSocket } from './checkers-socket';
import { SocketCallbackConfig } from './checkers-socket-messages.model';

export default function useCheckersSocket(
  callbackConfig: SocketCallbackConfig,
) {
  const checkersSocket = useRef(new CheckersSocket());

  useEffect(() => {
    const rawSocket = new WebSocket(CONFIG.websocketUrl);

    checkersSocket.current.socket = rawSocket;
    console.log('set up checkers socket:', checkersSocket);

    rawSocket.addEventListener('open', () => {
      handleConnection(callbackConfig);
    });

    rawSocket.addEventListener('message', (message) => {
      const parsedMessage: DownstreamSocketMessage = JSON.parse(message.data);

      handleMessage(parsedMessage, callbackConfig);
    });

    return () => {
      rawSocket.close();
    };
  }, [callbackConfig]);

  return checkersSocket.current;
}

function handleConnection(callbackConfig: SocketCallbackConfig) {
  const { onConnected } = callbackConfig;

  onConnected && onConnected();
}

function handleMessage(
  message: DownstreamSocketMessage,
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
