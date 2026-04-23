import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: "120px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;