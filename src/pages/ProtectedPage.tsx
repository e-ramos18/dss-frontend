import { Navigate, Outlet } from "react-router-dom";
import { getItem } from "../utils";
const ProtectedPage = () => {
  const token = getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedPage;
