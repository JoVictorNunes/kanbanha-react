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
  const { authenticated, token } = useAuth();

  useEffect(() => {
    if (authenticated && token && !socket) {
      const socket = io("http://localhost:3000", {
        auth: {
          token: token,
        },
      });
      setSocket(socket);
    }
  }, [authenticated, token, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
