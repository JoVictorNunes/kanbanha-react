import { Outlet } from 'react-router-dom'
import "./App.css";
import Sidebar from './components/sidebar/component';

function App() {
  return (
    <div className={`flex h-full`}>
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default App;
