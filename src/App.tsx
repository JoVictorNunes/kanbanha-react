import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSocket } from '@/hooks';
import Sidebar from '@/components/sidebar/component';
import Topbar from '@/components/topbar/component';
import Panel from '@/components/panel/component';

function App() {
  const { socket, isReadyToConnect } = useSocket();

  useEffect(() => {
    if (isReadyToConnect) {
      socket.connect();
    }
  }, [isReadyToConnect, socket]);

  return (
    <div className="h-full relative">
      <Sidebar />
      <Panel />
      <Topbar />
      <Outlet />
    </div>
  );
}

export default App;
