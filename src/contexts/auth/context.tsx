import React from 'react';
import type { MemberPayload } from './loader';

const AuthContext = React.createContext<{
  authenticated: boolean;
  authenticating: boolean;
  currentMember: MemberPayload | null;
  token: string | null;
}>({
  authenticated: false,
  authenticating: true,
  currentMember: null,
  token: null,
});

export default AuthContext;
