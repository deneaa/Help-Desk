import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";
import { useAppSelector } from "../hooks/reduxHooks";
import { useEffect } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const token = useAppSelector((state: RootState) => state.auth.token);
  

  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
  }, [navigate, token]);
  return (
    <div>
      {user?.role === "AGENT" ? <h1>Welcome Admin</h1> : <h1>Welcome User</h1>}
    </div>
  );
};

export default DashboardPage;
