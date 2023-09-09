import React from 'react';
import type { Invite } from '@/contexts/socket/context';

const InviteContext = React.createContext<Array<Invite>>([]);

export default InviteContext;
