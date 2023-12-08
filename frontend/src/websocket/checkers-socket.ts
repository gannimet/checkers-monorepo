import {
  ApplyForGameMessage,
  GameId,
  Move,
  PlayTurnMessage,
  PlayerId,
  UpstreamSocketMessage,
} from 'common';

export class CheckersSocket {
  socket?: WebSocket;

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

  private sendMessage(message: UpstreamSocketMessage) {
    this.socket?.send(JSON.stringify(message));
  }
}
