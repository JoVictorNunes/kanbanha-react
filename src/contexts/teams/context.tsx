import React from 'react';
import type { Team } from '@/contexts/socket/context';

const TeamsContext = React.createContext<Record<string, Team>>({});

export default TeamsContext;
