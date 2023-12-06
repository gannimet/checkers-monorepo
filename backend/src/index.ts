import { Position, positionToIndex } from 'common/dist/board';
import { WebSocketServer } from 'ws';
const { randomUUID } = require('node:crypto');

const port = process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3001;
const wss = new WebSocketServer({ port });

/**
 * 0 - empty
 * 1 - white
 * 11 - white king
 * 2 - black
 * 22 - black king
 */
const initialState = new Array(64).fill(0);

const initialWhitePositions: Position[] = [
  [0, 5],
  [2, 5],
  [4, 5],
  [6, 5],
  [1, 6],
  [3, 6],
  [5, 6],
  [7, 6],
  [0, 7],
  [2, 7],
  [4, 7],
  [6, 7],
];

const initialBlackPositions: Position[] = [
  [3, 4],
  [3, 0],
  [5, 0],
  [7, 0],
  [0, 3],
  [2, 1],
  [5, 2],
  [6, 1],
  [1, 2],
  [3, 2],
  [5, 4],
  [7, 2],
];

initialWhitePositions.forEach((position) => {
  const index = positionToIndex(position);

  initialState[index] = 1;
});

initialBlackPositions.forEach((position) => {
  const index = positionToIndex(position);

  initialState[index] = 2;
});

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    ws.send(
      JSON.stringify({
        type: 'gameStarted',
        opponentId: '123',
        firstTurn: '456',
        boardState: initialState,
      }),
    );
  });

  const playerId = randomUUID();

  ws.send(
    JSON.stringify({
      type: 'playerConfirm',
      playerId: playerId,
    }),
  );
});
