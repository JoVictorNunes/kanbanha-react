import React, { useEffect, useRef, useState } from 'react';
import InviteContext from './context';
import { useSocket } from '@/hooks';
import type { Invite } from '@/contexts/socket/context';

interface Props {
  children: React.ReactNode;
}

const InvitesProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [invites, setInvites] = useState<Array<Invite>>([]);
  const isInititalInvitesRead = useRef(false);
  console.log(invites)

  useEffect(() => {
    const onCreate = (invite: Invite) => {
      setInvites([...invites, invite]);
    };
    socket.on('invites:create', onCreate);
    return () => {
      socket.off('invites:create', onCreate);
    };
  }, [socket, invites]);

  useEffect(() => {
    if (!connected || isInititalInvitesRead.current) return;
    socket.emit('invites:read', (invites: Array<Invite>) => {
      setInvites(invites);
      isInititalInvitesRead.current = true;
    });
  }, [connected, socket]);

  return <InviteContext.Provider value={invites}>{children}</InviteContext.Provider>;
};

export default InvitesProvider;
