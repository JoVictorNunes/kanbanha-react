import React from "react";
import type { Member } from "@/contexts/socket/context";

const MemberContext = React.createContext<Array<Member>>([]);

export default MemberContext;
