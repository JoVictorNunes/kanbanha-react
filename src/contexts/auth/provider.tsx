import React, { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import AuthContext from './context';
import type { AuthLoader } from './loader';

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { code, currentMember, token } = useLoaderData() as AuthLoader;
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    if (code === 200) {
      setAuthenticated(true);
      setAuthenticating(false);
      return;
    }
    setAuthenticating(false);
    setAuthenticated(false);
    navigate('/signin');
  }, [code, navigate, token]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        authenticating,
        currentMember,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
