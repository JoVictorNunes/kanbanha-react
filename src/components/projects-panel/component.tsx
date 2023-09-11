import React, { SyntheticEvent, useRef, useState } from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth, useProjects, useSocket } from '@/hooks';
import Dialog from '@/components/dialog/component';
import PlusSmal from '@/svgs/PlusSmal';
import Creatable from 'react-select/creatable';
import { MultiValue } from 'react-select';
import * as Yup from 'yup';

const Projects: React.FC = () => {
  const projects = useProjects();
  const { socket, connected } = useSocket();
  const { currentMember } = useAuth();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [invited, setInvited] = useState<
    MultiValue<{ readonly label: string; readonly value: string }>
  >([]);

  const renderNewProjectForm = () => {
    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      if (!connected || !nameRef.current) return;
      socket.emit(
        'projects:create',
        { name: nameRef.current.value, invited: invited.map((v) => v.value) },
        (response) => {
          if (response.code === 200) {
            toast.success('Project created!');
            setIsAddingProject(false);
          } else {
            toast.error(response.message);
          }
        }
      );
    };
    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            className="outline-none border-[1px] border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:shadow-[0px_0px_0px_3px] focus:shadow-blue-300"
            ref={nameRef}
            required
            maxLength={12}
            minLength={3}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="name">Invite members by email</label>
          <Creatable
            isClearable
            isMulti
            onChange={(value) => {
              setInvited(value);
            }}
            onCreateOption={(value) => {
              try {
                const schema = Yup.string().email().required();
                schema.validateSync(value);
                setInvited((prev) => [
                  ...prev,
                  {
                    label: value,
                    value,
                  },
                ]);
              } catch {
                toast.error('Provide a valid email', {
                  hideProgressBar: true,
                  autoClose: 3000,
                });
              }
            }}
            value={invited}
            formatCreateLabel={(value) => `Invite "${value}"`}
            noOptionsMessage={() => 'Provide an email'}
          />
        </div>
        <button
          type="submit"
          className="self-end text-blue-700 bg-blue-100 hover:bg-blue-200 py-1 px-6 rounded font-medium focus:shadow-[0px_0px_0px_2px] focus:shadow-blue-600 outline-none"
        >
          Create
        </button>
      </form>
    );
  };

  return (
    <div className={`flex flex-col gap-6 p-5 border-r-2 border-r-gray-100 w-full h-full`}>
      <div className={`grow flex flex-col gap-8`}>
        <div>
          <h2 className={`text-xl pb-2`}>Projects</h2>
          <div className={`flex flex-col gap-2`}>
            {currentMember === null
              ? null
              : Object.values(projects)
                  .filter((p) => p.members.includes(currentMember.id))
                  .map((p) => {
                    return (
                      <div className="flex gap-2">
                        <NavLink
                          key={p.id}
                          to={`projects/${p.id}`}
                          className={({ isActive, isPending }) =>
                            clsx(
                              'border-2',
                              'border-gray-100',
                              'rounded-md',
                              'px-4',
                              'py-2',
                              'flex',
                              'items-center',
                              'grow',
                              {
                                'border-blue-700': isActive,
                                'bg-blue-700': isActive,
                                'text-white': isActive,
                                'bg-gray-50': isPending,
                              }
                            )
                          }
                        >
                          <span className="grow overflow-hidden text-ellipsis whitespace-nowrap">
                            {p.name}
                          </span>
                        </NavLink>
                      </div>
                    );
                  })}
          </div>
        </div>
      </div>
      <div>
        <Dialog
          description="Create a new project."
          onOpenChange={setIsAddingProject}
          open={isAddingProject}
          title="New Project"
          trigger={{
            className: clsx(
              'border-2',
              'border-dashed',
              'border-indigo-500',
              'text-indigo-500',
              'hover:bg-indigo-100',
              'focus:shadow-[0px_0px_0px_2px]',
              'focus:shadow-indigo-300',
              'focus:border-solid',
              'flex',
              'px-6',
              'py-3',
              'rounded-lg',
              'w-full',
              'justify-center',
              'outline-none'
            ),
            label: 'New Project',
            icon: <PlusSmal />,
          }}
        >
          {renderNewProjectForm()}
        </Dialog>
      </div>
    </div>
  );
};

export default Projects;
