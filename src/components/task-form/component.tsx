import { useRef, SyntheticEvent } from "react";
import classes from "./styles.module.css";
import { useSocket } from "../../hooks";
import { TASK_STATUSES } from "../../utils/enums";
import { Task } from "../../types";
import { useMembers } from "../../hooks/useMembers";

const TaskForm = () => {
  const dateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const predictedDateRef = useRef<HTMLInputElement>(null);
  const responsibleRef = useRef<HTMLSelectElement>(null);
  const socket = useSocket();
  const members = useMembers();
  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (
      !dateRef.current ||
      !descriptionRef.current ||
      !predictedDateRef.current ||
      !responsibleRef.current ||
      !socket
    ) {
      return;
    }
    const date = dateRef.current.valueAsNumber;
    const description = descriptionRef.current.value;
    const predictedDate = predictedDateRef.current.value;
    const responsible = responsibleRef.current.value;
    const body: Omit<Task, "id"> = {
      createdAt: Date.now(),
      date,
      description,
      finishedAt: null,
      inDevelopmentAt: responsible !== "" ? Date.now() : null,
      predictedDate,
      responsible: responsible !== "" ? responsible : null,
      status: responsible !== "" ? TASK_STATUSES.ONGOING : TASK_STATUSES.ACTIVE,
    };
    socket.emit("task:create", body);
  };

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <div>
        <label htmlFor="date">Data</label>
        <input type="date" name="date" id="date" ref={dateRef} required />
      </div>
      <div>
        <label htmlFor="description">Descrição</label>
        <textarea
          name="description"
          id="description"
          cols={30}
          rows={5}
          ref={descriptionRef}
          required
        />
      </div>
      <div>
        <label htmlFor="predictedDate">Previsão de término</label>
        <input
          type="datetime-local"
          name="predictedDate"
          id="predictedDate"
          ref={predictedDateRef}
          required
        />
      </div>
      <div>
        <label htmlFor="responsible">Membro responsável</label>
        <select name="responsible" id="responsible" ref={responsibleRef}>
          <option value="">Sem responsável</option>
          {members.map((member) => {
            return (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            );
          })}
        </select>
      </div>
      <div id="actions">
        <button type="reset">Cancelar</button>
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
};

export default TaskForm;
