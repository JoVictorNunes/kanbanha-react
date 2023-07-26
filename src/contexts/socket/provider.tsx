import React, { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import SocketContext from "./context";
import { useAuth } from "../../hooks";

interface Props {
  children: React.ReactNode;
}

const SocketProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { authenticated, token } = useAuth();

  useEffect(() => {
    if (authenticated && !socket) {
      const socket = io("http://localhost:3000", {
        auth: {
          token: token,
        },
        autoConnect: false,
      });
      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
      setSocket(socket);
    }
  }, [authenticated, token, socket]);
  console.log(connected)

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
