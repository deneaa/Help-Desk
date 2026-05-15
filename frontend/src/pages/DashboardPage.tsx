import AdminDashboard from "../components/Dashboard/AdminDashboard";
import UserDashboard from "../components/Dashboard/UserDashboard";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";

const DashboardPage = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  return user.role === "ADMIN" || user.role === "AGENT" ? (
    <AdminDashboard />
  ) : (
    <UserDashboard />
  );
};

export default DashboardPage;
