import React from 'react';
import { useParams } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { useLayout, useProjects } from '@/hooks';
import ProjectHeader from './header/component';
import ProjectOverview from './overview/component';
import ProjectTeams from './teams/component';
import ProjectSettings from './settings/component';
import clsx from 'clsx';

const Project: React.FC = () => {
  const { projectId = '' } = useParams();

  // Data
  const { layout } = useLayout();
  const projects = useProjects();
  const project = projects[projectId];

  if (!project) {
    return (
      <div
        className="p-5 absolute flex justify-center items-center"
        style={{
          width: layout.main.width,
          height: layout.main.height,
          left: layout.main.left,
          top: layout.main.top,
        }}
      >
        <span>This project does not exist or was deleted.</span>
      </div>
    );
  }

  const tabClassName = clsx(
    'p-3',
    'border-b-2',
    'border-b-transparent',
    'data-[state=active]:border-b-blue-700'
  );

  return (
    <div
      className={`p-5 absolute`}
      style={{
        width: layout.main.width,
        height: layout.main.height,
        left: layout.main.left,
        top: layout.main.top,
      }}
    >
      <ProjectHeader project={project} />
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1" className={tabClassName}>
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" className={tabClassName}>
            Teams
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" className={tabClassName}>
            Settings
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">
          <ProjectOverview project={project} />
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <ProjectTeams project={project} />
        </Tabs.Content>
        <Tabs.Content value="tab3">
          <ProjectSettings project={project} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Project;
