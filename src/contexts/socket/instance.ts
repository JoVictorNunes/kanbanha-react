import { io } from 'socket.io-client';

const { VITE_SERVER_DOMAIN, VITE_SERVER_PORT } = import.meta.env;

export default io(`${VITE_SERVER_DOMAIN}:${VITE_SERVER_PORT}`, {
  autoConnect: false,
});
