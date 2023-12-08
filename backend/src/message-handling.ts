import {
  ApplyForGameMessage,
  DownstreamSocketMessage,
  PlayTurnMessage,
  PlayerConfirmMessage,
  PlayerId,
  UpstreamSocketMessage,
} from 'common';
import { WebSocket } from 'ws';
const { randomUUID } = require('node:crypto');

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
  const playerId = randomUUID();
  const gameId = randomUUID();

  const response: PlayerConfirmMessage = {
    type: 'playerConfirm',
    playerId,
    gameId,
  };

  sendMessage(ws, response);
}

function handlePlayTurnMessage(ws: WebSocket, message: PlayTurnMessage) {}

function sendMessage(ws: WebSocket, message: DownstreamSocketMessage) {
  ws.send(JSON.stringify(message));
}
