import React from "react";
import { useLayout } from "../../hooks";

const Home: React.FC = () => {
  const { state } = useLayout();
  return (
    <div
      style={{
        height: state.main.height,
        width: state.main.width,
        left: state.main.left,
        top: state.main.top,
      }}
      className="absolute flex justify-center items-center"
    >
      <div>Home</div>
    </div>
  );
};

export default Home;
