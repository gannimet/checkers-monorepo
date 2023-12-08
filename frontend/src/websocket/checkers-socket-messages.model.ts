import {
  GameAbortedMessage,
  GameOverMessage,
  GameStartedMessage,
  PlayerConfirmMessage,
  TurnPlayedMessage,
} from 'common';

export type SocketCallbackConfig = {
  onConnected?: () => void;
  onPlayerConfirm?: (message: PlayerConfirmMessage) => void;
  onGameStarted?: (message: GameStartedMessage) => void;
  onTurnPlayed?: (message: TurnPlayedMessage) => void;
  onGameOver?: (message: GameOverMessage) => void;
  onGameAborted?: (message: GameAbortedMessage) => void;
};
