import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Sidebar />

      <div
        style={{
          // marginLeft: "calc((100% - 120px) / 2)",
          marginLeft: "120px",
          width: "calc(100% - 120px)",
          // padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;