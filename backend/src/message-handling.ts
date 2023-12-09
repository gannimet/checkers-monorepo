import {
  AbortGameMessage,
  ApplyForGameMessage,
  DownstreamSocketMessage,
  GameAbortedMessage,
  GameId,
  GameStartedMessage,
  PlayTurnMessage,
  PlayerConfirmMessage,
  PlayerId,
  SquareState,
  UpstreamSocketMessage,
} from 'common';
import { WebSocket } from 'ws';
import { getInitialBoardState } from './constants';
const { randomUUID } = require('node:crypto');

type Player = {
  id: PlayerId;
  socket: WebSocket;
};

type Game = {
  id: string;
  white?: Player;
  black?: Player;
  nextTurn?: PlayerId;
};

const currentGames = new Map<GameId, Game>();

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
      break;
    case 'abortGame':
      handleAbortGameMessage(ws, message);
      break;
  }
}

function handleApplyForGameMessage(
  ws: WebSocket,
  message: ApplyForGameMessage,
) {
  const playerId = randomUUID();

  const response: PlayerConfirmMessage = {
    type: 'playerConfirm',
    playerId,
  };

  sendMessage(ws, response);

  putInOpenGameOrStartNew(ws, playerId);
}

function handlePlayTurnMessage(ws: WebSocket, message: PlayTurnMessage) {}

function handleAbortGameMessage(ws: WebSocket, message: AbortGameMessage) {
  const { gameId, playerId } = message;

  const response: GameAbortedMessage = {
    type: 'gameAborted',
    gameId,
  };

  // Send confirmation message to aborting player
  sendMessage(ws, response);

  // Find game and inform other player
  const game = currentGames.get(gameId);

  if (game && game.white && game.black) {
    const opponentSocket =
      game.white.id === playerId ? game.black.socket : game.white.socket;

    sendMessage(opponentSocket, response);
  }

  // Clear up this no longer existing game
  currentGames.delete(gameId);
}

function putInOpenGameOrStartNew(ws: WebSocket, playerId: PlayerId): Game {
  const openGame = [...currentGames.values()].find((game) => {
    return (!!game.white && !game.black) || (!game.white && !!game.black);
  });

  const player: Player = {
    id: playerId,
    socket: ws,
  };

  if (openGame) {
    // Put player into existing game at free slot
    if (openGame.white) {
      openGame.black = player;
    } else {
      openGame.white = player;
    }

    // Inform both players about the new game
    startGame(openGame);

    return openGame;
  }

  // Create new game and put player in free slot
  const game: Game = {
    id: randomUUID(),
    white: player,
    nextTurn: player.id,
  };

  currentGames.set(game.id, game);

  return game;
}

function startGame(game: Game) {
  if (!game.white || !game.black) {
    return;
  }

  const initialBoardState = getInitialBoardState();

  const startMessageWhite: GameStartedMessage = {
    type: 'gameStarted',
    gameId: game.id,
    opponentId: game.black.id,
    firstTurn: game.white.id,
    color: SquareState.White,
    boardState: initialBoardState,
  };

  const startMessageBlack: GameStartedMessage = {
    type: 'gameStarted',
    gameId: game.id,
    opponentId: game.white.id,
    firstTurn: game.white.id,
    color: SquareState.Black,
    boardState: initialBoardState,
  };

  sendMessage(game.white.socket, startMessageWhite);
  sendMessage(game.black.socket, startMessageBlack);
}

function sendMessage(ws: WebSocket, message: DownstreamSocketMessage) {
  ws.send(JSON.stringify(message));
}
