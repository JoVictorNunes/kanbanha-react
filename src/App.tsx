import { Outlet } from 'react-router-dom'
import "./App.css";
import Sidebar from './components/sidebar/component';
import Topbar from './components/topbar/component';

function App() {
  return (
    <div className={`h-full root`}>
      <Sidebar />
      <Topbar />
      <Outlet />
    </div>
  );
}

export default App;
