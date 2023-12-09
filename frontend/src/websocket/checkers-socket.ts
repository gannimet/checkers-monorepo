import {
  AbortGameMessage,
  ApplyForGameMessage,
  GameId,
  Move,
  PlayTurnMessage,
  PlayerId,
  UpstreamSocketMessage,
} from 'common';

export class CheckersSocket {
  socket?: WebSocket;

  get isReady() {
    return !!this.socket;
  }

  applyForGame() {
    const message: ApplyForGameMessage = {
      type: 'applyForGame',
    };

    this.sendMessage(message);
  }

  playTurn(gameId: GameId, playerId: PlayerId, moveSequence: Move[]) {
    const message: PlayTurnMessage = {
      type: 'playTurn',
      gameId,
      playerId,
      moveSequence,
    };

    this.sendMessage(message);
  }

  abortGame(gameId: GameId, playerId: PlayerId) {
    const message: AbortGameMessage = {
      type: 'abortGame',
      gameId,
      playerId,
    };

    this.sendMessage(message);
  }

  private sendMessage(message: UpstreamSocketMessage) {
    this.socket?.send(JSON.stringify(message));
  }
}
