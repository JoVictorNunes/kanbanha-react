import React from 'react';
import { useLayout } from '@/hooks';
import ProjectsPanel from '@/components/projects-panel/component';

const Panel: React.FC = () => {
  const { layout } = useLayout();
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        height: layout.panel.height,
        width: layout.panel.width,
        left: layout.panel.left,
        top: layout.panel.top,
      }}
    >
      <ProjectsPanel />
    </div>
  );
};

export default Panel;
