import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks';
import instance from './instance';
import SocketContext, { type SocketType } from './context';

interface Props {
  children: React.ReactNode;
}

const SocketProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const [socket] = useState<SocketType>(instance);
  const [connected, setConnected] = useState(false);
  const [isReadyToConnect, setIsReadyToConnect] = useState(false);
  const { authenticated, token } = useAuth();

  useEffect(() => {
    if (authenticated) {
      socket.auth = { token };
      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));
      setIsReadyToConnect(true);
    }
  }, [authenticated, socket, token]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        isReadyToConnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
