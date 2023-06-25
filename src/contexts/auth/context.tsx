import React from "react";
import { Member } from "@/types";

const AuthContext = React.createContext<{
  authenticated: boolean;
  authenticating: boolean;
  currentMember: Member | null;
  token: string | null;
}>({
  authenticated: false,
  authenticating: true,
  currentMember: null,
  token: null,
});

export default AuthContext;
