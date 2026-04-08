import type { RootState } from "../app/store";
import { useAppSelector } from "../hooks/reduxHooks";

const DashboardPage = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <div>
      {user?.role === "AGENT" ? <h1>Welcome Admin</h1> : <h1>Welcome User</h1>}
    </div>
  );
};

export default DashboardPage;
