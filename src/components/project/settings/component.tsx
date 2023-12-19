import { useState } from 'react';
import { Project } from '@/contexts/socket/context';
import { useSocket } from '@/hooks';
import { toast } from 'react-toastify';

interface Props {
  project: Project;
}

const ProjectSettings: React.FC<Props> = (props) => {
  const { project } = props;
  const projectId = project.id;

  const { socket } = useSocket();
  const [projectName, setProjectName] = useState(project.name);
  const [disableActions, setDisableActions] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start">
        <label htmlFor="projectName" className="font-medium">
          Project name
        </label>
        <div>
          <input
            type="text"
            id="projectName"
            className="disabled:opacity-50 outline-none border-[1px] border-gray-300 rounded p-2 focus:shadow-[0px_0px_0px_3px] focus:shadow-blue-300 focus:border-blue-600"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
            }}
            disabled={disableActions}
          />
          <button
            className="disabled:opacity-50 bg-blue-600 px-4 py-2 rounded text-white ml-2"
            onClick={() => {
              setDisableActions(true);
              socket.emit('projects:update', { id: projectId, name: projectName }, (ack) => {
                if (ack.code === 200) {
                  toast.success('Project renamed!');
                } else {
                  toast.error('Failed to rename!');
                }
                setDisableActions(false);
              });
            }}
            disabled={disableActions}
          >
            Rename
          </button>
        </div>
      </div>
      <div className="border-[1px] border-red-600 rounded p-2 flex flex-col gap-4">
        <div>
          <div className="font-medium">Delete this project</div>
          <div>Warning: this action will delete permanently this project, its teams and tasks.</div>
        </div>
        <button
          className="disabled:opacity-50 px-4 py-2 rounded border-red-600 border-[1px] text-red-600 self-start hover:bg-red-600 hover:text-white"
          onClick={() => {
            setDisableActions(true);
            socket.emit('projects:delete', { id: projectId }, (ack) => {
              if (ack.code === 200) {
                toast.success('Project deleted!');
              } else {
                toast.error('Failed to delete!');
              }
              setDisableActions(false);
            });
          }}
          disabled={disableActions}
        >
          Delete project
        </button>
      </div>
    </div>
  );
};

export default ProjectSettings;
