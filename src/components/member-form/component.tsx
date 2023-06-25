import React, { SyntheticEvent, useRef } from "react";
import classes from './styles.module.css'
import { useSocket } from "../../hooks";
import { Member } from "../../types";

const MemberForm: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();
  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (
      !nameRef.current ||
      !roleRef.current ||
      !socket
    ) {
      return;
    }
    const name = nameRef.current.value;
    const role = roleRef.current.value;
    const body: Omit<Member, "id"> = {
      name,
      role
    };
    socket.emit("member:create", body);
  };

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <div className="flex-column gap-5">
        <label htmlFor="name">Nome</label>
        <input type="text" name="name" id="name" ref={nameRef} required />
      </div>
      <div className="flex-column gap-5">
        <label htmlFor="role">Cargo</label>
        <input type="text" name="role" id="role" ref={roleRef} required />
      </div>
      <div>
        <button type="submit">Cadastrar</button>
      </div>
    </form>
  );
};

export default MemberForm;
