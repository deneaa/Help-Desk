import { useAppSelector } from "../../hooks/reduxHooks";
import { usePublicDashboardStats } from "../../hooks/usePublicDashboardStats";
import type { RootState } from "../../redux/store";
import StatsGrid from "../dashboard/StatsGrid";
import UsersGrid from "../dashboard/UsersGrid";
import WeeklyChart from "../dashboard/WeeklyChart";

const UserDashboard = () => {
  const token = useAppSelector((state: RootState) => state.auth.token);
  const { stats, loading, error } = usePublicDashboardStats(token);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!stats) return null;

  const userStats = {
    users: stats.users,
    admins: stats.admins,
    agents: stats.agents,
  };

  return (
    <div className="space-y-8">
      <StatsGrid stats={stats} />
      <WeeklyChart data={stats.weeklyTickets} />
      <UsersGrid userStats={userStats} />
    </div>
  );
};

export default UserDashboard;
