import { UpstreamSocketMessage } from 'common';
import { WebSocketServer } from 'ws';
import { handleClientMessage } from './message-handling';

const port = process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3001;
const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    const message: UpstreamSocketMessage = JSON.parse(data.toString());

    handleClientMessage(ws, message);
  });
});
