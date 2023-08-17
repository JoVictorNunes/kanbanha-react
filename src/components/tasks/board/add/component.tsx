import React, { SyntheticEvent, useMemo, useState } from "react";
import Select, { MultiValue } from "react-select";
import Dialog from "../../../dialog/component";
import { useMembers, useSocket, useTeams } from "../../../../hooks";
import type { TaskStatuses, UUID } from "@/contexts/socket/context";

type SelectValue = MultiValue<{ value: string; label: string }> | null;

interface Props {
  status: TaskStatuses;
  teamId: UUID;
}

const Add: React.FC<Props> = (props) => {
  const { teamId, status } = props;

  // Data
  const { socket, connected } = useSocket();
  const teams = useTeams();
  const members = useMembers();
  const team = useMemo(
    () => teams.find((t) => t.id === teamId),
    [teams, teamId]
  );
  const teamMembers = useMemo(
    () => members.filter((m) => team?.members?.includes?.(m.id)),
    [members, team]
  );

  // State
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  function renderForm() {
    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const date = new Date(formData.get("date") as string).getTime();
      const description = (formData.get("description") || "") as string;
      const dueDate = new Date(formData.get("dueDate") as string).getTime();
      if (!socket || !connected) return;
      socket.emit(
        "tasks:create",
        {
          teamId,
          date,
          description,
          dueDate,
          status,
          assignees: selectedMembers?.map((m) => m.value) || [],
        },
        (res) => {
          console.log(res);
        }
      );
    };
    const options = teamMembers.map((m) => ({
      value: m.id,
      label: m.name,
    }));

    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <div>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={(e) => {
                console.log(e.target.value);
                setDate(e.target.value);
              }}
            />
          </div>
          <div>
            <textarea
              name="description"
              id="description"
              cols={30}
              rows={10}
            ></textarea>
          </div>
          <div>
            <input type="date" name="dueDate" id="dueDate" />
          </div>
          <label htmlFor="memebers">Members</label>
          <Select
            options={options}
            onChange={(value) => setSelectedMembers(value)}
            name="members"
            isMulti
          />
        </div>
        <button
          type="submit"
          className="self-end text-green-800 bg-green-100 hover:bg-green-200 py-1 px-6 rounded font-medium"
        >
          Add
        </button>
      </form>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Add New Task"
      description="Add a new to do task."
      triggerText="Add New Task"
      triggerClassName="bg-white border-[1px] border-gray-200 text-blue-700 py-2 px-6 rounded w-full flex"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m6-6H6"
          />
        </svg>
      }
    >
      {renderForm()}
    </Dialog>
  );
};

export default Add;
