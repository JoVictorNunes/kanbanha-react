import React from 'react';
import type { Invite } from '@/contexts/socket/context';

const InvitesContext = React.createContext<Record<string, Invite>>({});

export default InvitesContext;
