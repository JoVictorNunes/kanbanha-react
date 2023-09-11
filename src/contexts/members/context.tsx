import React from 'react';
import type { Member } from '@/contexts/socket/context';

const MemberContext = React.createContext<Record<string, Member>>({});

export default MemberContext;
