import { BoardState, SquareState } from '../board';
import { GameId, Move, PlayerId } from '../game';

export type PlayerConfirmMessage = {
  type: 'playerConfirm';
  playerId: PlayerId;
};

export type GameStartedMessage = {
  type: 'gameStarted';
  gameId: GameId;
  opponentId: PlayerId;
  firstTurn: PlayerId;
  color: SquareState.White | SquareState.Black;
  boardState: BoardState;
};

export type TurnPlayedMessage = {
  type: 'turnPlayed';
  gameId: GameId;
  playedBy: PlayerId;
  moveSequence: Move[];
  boardState: BoardState;
  nextTurn: PlayerId;
};

export type GameAbortedMessage = {
  type: 'gameAborted';
  gameId: GameId;
};

export type GameOverMessage = {
  type: 'gameOver';
  gameId: GameId;
  winner: PlayerId;
};

export type DownstreamSocketMessage =
  | PlayerConfirmMessage
  | GameStartedMessage
  | TurnPlayedMessage
  | GameAbortedMessage
  | GameOverMessage;
