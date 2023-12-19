import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/contexts/socket/context';
import { useMembers, useTeams } from '@/hooks';
import clsx from 'clsx';

interface Props {
  project: Project;
}

const ProjectTeams: React.FC<Props> = (props) => {
  const { project } = props;
  const projectId = project.id;

  const teams = useTeams();
  const members = useMembers();

  const projectTeams = useMemo(
    () => Object.values(teams).filter((team) => team.projectId === projectId),
    [projectId, teams]
  );

  return (
    <div>
      {projectTeams.length > 0 ? (
        projectTeams.map((t) => {
          return (
            <div className="even:bg-gray-200 px-2 py-4 rounded flex justify-between">
              <Link to={`teams/${t.id}`} className="hover:underline text-lg">
                {t.name}
              </Link>
              <div className="flex">
                {t.members.map((memberId, index) => {
                  const member = members[memberId];
                  let offset = t.members.length / (index + 1);
                  offset = index === t.members.length - 1 ? 0 : offset;
                  return (
                    <div
                      className={clsx(
                        'rounded-full',
                        'p-2',
                        'bg-blue-600',
                        'leading-none',
                        'transform',
                        `translate-x-${offset}`,
                        `z-${index * 10}`,
                        'border-2',
                        'border-white',
                        'text-white'
                      )}
                      title={member.name}
                    >
                      {member.name.substring(0, 2)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-slate-600">
          This project has no teams yet. Create one and start working! &#128521;
        </div>
      )}
    </div>
  );
};

export default ProjectTeams;
