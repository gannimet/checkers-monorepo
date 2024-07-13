const wsProtocol = import.meta.env.VITE_WEBSOCKET_PROTOCOL;
const wsDomain = import.meta.env.VITE_WEBSOCKET_DOMAIN;
const wsPort = import.meta.env.VITE_WEBSOCKET_PORT;

export const CONFIG = {
  websocketUrl: `${wsProtocol}://${wsDomain}:${wsPort}`,
};
