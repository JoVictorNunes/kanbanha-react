import MemberCard from '@/components/members/card/component';
import { Project } from '@/contexts/socket/context';
import { useInvites, useMembers } from '@/hooks';
import { useMemo } from 'react';

interface Props {
  project: Project;
}

const ProjectOverview: React.FC<Props> = (props) => {
  const { project } = props;
  const projectId = project.id;

  // Data
  const members = useMembers();
  const invites = useInvites();

  // State
  const projectMembers = useMemo(
    () =>
      project.members
        .filter((memberId) => memberId !== project.ownerId)
        .map((memberId) => members[memberId]),
    [members, project]
  );
  const projectInvites = useMemo(
    () => Object.values(invites).filter((i) => i.projectId === projectId && !i.accepted),
    [invites, projectId]
  );
  const unenrolledMembers = projectInvites.map((i) => members[i.memberId]);

  return (
    <div className="py-2 flex flex-col gap-8">
      <div>
        <div className="text-xs text-gray-500 font-bold">Name</div>
        <div>{project.name}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500 font-bold mb-2">Owner</div>
        <MemberCard memberId={project.ownerId} />
      </div>
      <div>
        <div className="text-xs text-gray-500 font-bold mb-2">Members</div>
        <div>
          {projectMembers.map((member) => (
            <div className="flex items-center p-2 rounded odd:bg-gray-200">
              <div className="grow">
                <MemberCard memberId={member.id} />
              </div>
              <div className="text-gray-800">Enrolled</div>
            </div>
          ))}
          {unenrolledMembers.map((member) => (
            <div className="flex items-center p-2 rounded odd:bg-gray-200">
              <div className="grow">
                <MemberCard memberId={member.id} />
              </div>
              <div className="text-gray-800">Invited</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
