import React from "react";
import { Member } from "../../types";

const MemberContext = React.createContext<Array<Member>>([]);

export default MemberContext;
