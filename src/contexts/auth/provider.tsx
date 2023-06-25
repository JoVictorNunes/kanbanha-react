import React, { useEffect, useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import { decodeJwt } from "jose";
import AuthContext from "./context";
import type { AuthLoader, Member } from "@/types";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { code } = useLoaderData() as AuthLoader;
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (code === 200) {
      const token = localStorage.getItem("token") as string;
      const payload = decodeJwt(token) as Member;
      setAuthenticated(true);
      setAuthenticating(false);
      setCurrentMember(payload);
      setToken(token);
    } else if (code === 400) {
      localStorage.removeItem("token");
      setAuthenticating(false);
      setAuthenticated(false);
      setCurrentMember(null);
      setToken(null);
      navigate("/login");
    }
  }, [code, navigate]);

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
