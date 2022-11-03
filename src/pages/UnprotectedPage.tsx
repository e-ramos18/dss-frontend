import { Navigate, Outlet } from "react-router-dom";
import { getItem } from "../utils";
const UnprotectedPage = () => {
  const token = getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default UnprotectedPage;
