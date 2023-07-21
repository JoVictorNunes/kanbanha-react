import React from "react";
import { Socket } from "socket.io-client";

const SocketContext = React.createContext<{
  socket: Socket | null;
  connected: boolean;
}>({
  socket: null,
  connected: false,
});

export default SocketContext;
