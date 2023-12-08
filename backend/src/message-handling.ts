import {
  ApplyForGameMessage,
  PlayTurnMessage,
  PlayerId,
  UpstreamSocketMessage,
} from 'common';
import { WebSocket } from 'ws';
import { getInitialBoardState } from './constants';

type Player = {
  id: PlayerId;
};

type Game = {
  id: string;
  white?: Player;
  black?: Player;
  nextTurn?: PlayerId;
};

const currentGames = new Map<string, Game>();

export function handleClientMessage(
  ws: WebSocket,
  message: UpstreamSocketMessage,
) {
  switch (message.type) {
    case 'applyForGame':
      handleApplyForGameMessage(ws, message);
      break;
    case 'playTurn':
      handlePlayTurnMessage(ws, message);
  }
}

function handleApplyForGameMessage(
  ws: WebSocket,
  message: ApplyForGameMessage,
) {
  ws.send(
    JSON.stringify({
      type: 'gameStarted',
      opponentId: '123',
      firstTurn: '456',
      boardState: getInitialBoardState(),
    }),
  );
}

function handlePlayTurnMessage(ws: WebSocket, message: PlayTurnMessage) {}
