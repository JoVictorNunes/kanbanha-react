import { useContext } from 'react';
import InvitesContext from '@/contexts/invites/context';

export const useInvites = () => useContext(InvitesContext);
