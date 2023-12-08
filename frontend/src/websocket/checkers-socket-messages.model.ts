import {
  GameOverMessage,
  GameStartedMessage,
  PlayerConfirmMessage,
  TurnPlayedMessage,
} from 'common/dist/websocket/downstream-messages.model';

export type SocketCallbackConfig = {
  onConnected?: () => void;
  onPlayerConfirm?: (message: PlayerConfirmMessage) => void;
  onGameStarted?: (message: GameStartedMessage) => void;
  onTurnPlayed?: (message: TurnPlayedMessage) => void;
  onGameOver?: (message: GameOverMessage) => void;
};
