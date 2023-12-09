import { GameId, Move, PlayerId } from '../game';

export type ApplyForGameMessage = {
  type: 'applyForGame';
};

export type PlayTurnMessage = {
  type: 'playTurn';
  gameId: GameId;
  playerId: PlayerId;
  moveSequence: Move[];
};

export type AbortGameMessage = {
  type: 'abortGame';
  gameId: GameId;
  playerId: PlayerId;
};

export type UpstreamSocketMessage =
  | ApplyForGameMessage
  | PlayTurnMessage
  | AbortGameMessage;
