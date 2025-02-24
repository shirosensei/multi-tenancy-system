import { Outlet, useLocation } from "react-router-dom";
import Sidebar from '../components/Sidebar';

const Layout = () => {
  const location = useLocation();

  const hideSidebar = location.pathname === "/login"; 

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
