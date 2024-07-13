import {
  AbortGameMessage,
  ApplyForGameMessage,
  BoardState,
  DownstreamSocketMessage,
  GameAbortedMessage,
  GameId,
  GameOverMessage,
  GameStartedMessage,
  InfoMessage,
  InfoSubscribeMessage,
  InfoUnsubscribeMessage,
  PlayTurnMessage,
  PlayerConfirmMessage,
  PlayerId,
  SquareState,
  TurnPlayedMessage,
  UpstreamSocketMessage,
  checkForWinner,
  indexToPosition,
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
  boardState: BoardState;
  white?: Player;
  black?: Player;
  nextTurn?: PlayerId;
};

const currentGames = new Map<GameId, Game>();
let infoSubscriber: WebSocket | undefined = undefined;

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
    case 'infoSub':
      handleInfoSubMessage(ws, message);
      break;
    case 'infoUnsub':
      handleInfoUnsubMessage(ws, message);
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

function handlePlayTurnMessage(ws: WebSocket, message: PlayTurnMessage) {
  const { moveSequence, gameId, playerId } = message;
  const game = currentGames.get(gameId);

  if (
    !game ||
    !game.white ||
    !game.black ||
    (game.white.id !== playerId && game.black.id !== playerId)
  ) {
    // gameId and/or playerId are not valid or do not match
    return;
  }

  if (game.nextTurn !== playerId) {
    // It was not this player's turn
    return;
  }

  const newBoardState = [...game.boardState];

  // TODO check move for validity

  const isPlayerWhite = game.white.id === playerId;

  moveSequence.forEach((move) => {
    const position = indexToPosition(move.to);
    if (position[1] === 0 || position[1] === 7) {
      newBoardState[move.to] = isPlayerWhite
        ? SquareState.WhiteKing
        : SquareState.BlackKing;
    } else {
      newBoardState[move.to] = newBoardState[move.from];
    }

    newBoardState[move.from] = SquareState.Empty;

    if (move.capture != null) {
      newBoardState[move.capture] = SquareState.Empty;
    }
  });

  const player = isPlayerWhite ? game.white : game.black;
  const opponent = isPlayerWhite ? game.black : game.white;
  const nextTurn = game.nextTurn === playerId ? opponent.id : player.id;

  // Update game state
  game.boardState = newBoardState;
  game.nextTurn = nextTurn;

  // Inform clients
  const turnPlayedMessage: TurnPlayedMessage = {
    type: 'turnPlayed',
    gameId,
    playedBy: playerId,
    moveSequence,
    boardState: game.boardState,
    nextTurn,
  };

  sendMessage(player.socket, turnPlayedMessage);
  sendMessage(opponent.socket, turnPlayedMessage);

  const winner = checkForWinner(newBoardState);

  if (winner != null) {
    const winnerId =
      winner === SquareState.White ? game.white.id : game.black.id;

    const gameOverMessage: GameOverMessage = {
      type: 'gameOver',
      gameId,
      winner: winnerId,
    };

    sendMessage(player.socket, gameOverMessage);
    sendMessage(opponent.socket, gameOverMessage);
    publishGameInfo(false, winnerId);

    // Clear up this no longer existing game
    currentGames.delete(gameId);
  } else {
    publishGameInfo();
  }
}

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

  publishGameInfo(true);

  // Clear up this no longer existing game
  currentGames.delete(gameId);
}

function handleInfoSubMessage(ws: WebSocket, message: InfoSubscribeMessage) {
  infoSubscriber = ws;
  publishGameInfo();
}

function handleInfoUnsubMessage(
  ws: WebSocket,
  message: InfoUnsubscribeMessage,
) {
  infoSubscriber = undefined;
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
    boardState: getInitialBoardState(),
  };

  currentGames.set(game.id, game);

  return game;
}

function startGame(game: Game) {
  if (!game.white || !game.black) {
    return;
  }

  const startMessageWhite: GameStartedMessage = {
    type: 'gameStarted',
    gameId: game.id,
    opponentId: game.black.id,
    firstTurn: game.white.id,
    color: SquareState.White,
    boardState: game.boardState,
  };

  const startMessageBlack: GameStartedMessage = {
    type: 'gameStarted',
    gameId: game.id,
    opponentId: game.white.id,
    firstTurn: game.white.id,
    color: SquareState.Black,
    boardState: game.boardState,
  };

  sendMessage(game.white.socket, startMessageWhite);
  sendMessage(game.black.socket, startMessageBlack);
  publishGameInfo();
}

function publishGameInfo(aborted = false, winnerId?: PlayerId) {
  const games = Array.from(currentGames.values());

  if (games.length > 0 && infoSubscriber) {
    const { id, boardState, nextTurn } = games[0];
    const response: InfoMessage = {
      type: 'info',
      gameId: id,
      boardState,
      nextTurn,
      aborted,
      winner: winnerId,
    };

    sendMessage(infoSubscriber, response);
  }
}

function sendMessage(ws: WebSocket, message: DownstreamSocketMessage) {
  ws.send(JSON.stringify(message));
}
