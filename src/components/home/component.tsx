import React from 'react';
import { useLayout } from '@/hooks';

const Home: React.FC = () => {
  const { layout } = useLayout();

  return (
    <div
      style={{
        height: layout.main.height,
        width: layout.main.width,
        left: layout.main.left,
        top: layout.main.top,
      }}
      className="absolute flex justify-center items-center"
    >
      <div>Home</div>
    </div>
  );
};

export default Home;
