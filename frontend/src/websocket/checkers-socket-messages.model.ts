import { SquareState } from 'common/dist/board';

export type PlayerId = string;

export type PlayerConfirmMessage = {
  type: 'playerConfirm';
  playerId: PlayerId;
};

export type GameStartedMessage = {
  type: 'gameStarted';
  opponentId: PlayerId;
  firstTurn: PlayerId;
  boardState: SquareState[];
};

export type TurnPlayedMessage = {
  type: 'turnPlayed';
  playedBy: PlayerId;
  move: number[];
  nextTurn: PlayerId;
};

export type GameOverMessage = {
  type: 'gameOver';
  winner: PlayerId;
};

export type IncomingSocketMessage =
  | PlayerConfirmMessage
  | GameStartedMessage
  | TurnPlayedMessage
  | GameOverMessage;

export type ApplyForGameMessage = {
  type: 'applyForGame';
};

export type PlayTurnMessage = {
  type: 'playTurn';
  playerId: PlayerId;
  move: number[];
};

export type OutgoingSocketMessage = ApplyForGameMessage | PlayTurnMessage;

export type SocketCallbackConfig = {
  onConnected?: () => void;
  onPlayerConfirm?: (message: PlayerConfirmMessage) => void;
  onGameStarted?: (message: GameStartedMessage) => void;
  onTurnPlayed?: (message: TurnPlayedMessage) => void;
  onGameOver?: (message: GameOverMessage) => void;
};
