import { useContext } from "react";
import MemberContext from "../contexts/members/context";

export const useMembers = () => useContext(MemberContext);
