import React from "react";
import { useLayout } from "../../hooks";
import ProjectsPanel from "../projects-panel/component";

const Panel: React.FC = () => {
  const { state } = useLayout();
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        height: state.panel.height,
        width: state.panel.width,
        left: state.panel.left,
        top: state.panel.top,
      }}
    >
      <ProjectsPanel />
    </div>
  );
};

export default Panel;
