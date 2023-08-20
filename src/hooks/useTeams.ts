import { useContext } from 'react';
import TeamsContext from '@/contexts/teams/context';

export const useTeams = () => useContext(TeamsContext);
