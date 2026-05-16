import { useAppSelector } from "../../../hooks/reduxHooks";
import { usePrivateDashboardStats } from "../../../hooks/usePrivateDashboardStats";
import type { RootState } from "../../../redux/store";
import AuditLogs from "../components/AuditLogs";
import StatsGrid from "../components/StatsGrid";
import UsersGrid from "../components/UsersGrid";
import WeeklyChart from "../components/WeeklyChart";

const AdminDashboard = () => {
  const token = useAppSelector((state: RootState) => state.auth.token);
  const { stats, loading, error } = usePrivateDashboardStats(token);

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
      <AuditLogs logs={stats.auditLogs} />
    </div>
  );
};

export default AdminDashboard;
