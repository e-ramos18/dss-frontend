import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { APIResponse, Roles } from "../types";
import { getCurrentUser } from "../misc/auth";

const AdminPage = () => {
  const navigate = useNavigate();
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  useEffect(() => {
    onMount();
  }, []);
  const onMount = async () => {
    const res: APIResponse = await getCurrentUser();
    if (!res.data && res.error) {
      setErrorMessage(res.error);
    } else if (res.data && res.data.role === Roles.User) {
      navigate("/home");
    }
  };
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminPage;
