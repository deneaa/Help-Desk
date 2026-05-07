import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";
import { useDashboardStats } from "../hooks/useDashboardStats";
import StatCard from "../components/StatCard/StatCard";

const DashboardPage = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const token = useAppSelector((state: RootState) => state.auth.token);

  const { stats, loading, error } = useDashboardStats(token);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl">
          {user?.role === "AGENT" ? "Welcome Agent" : "Welcome User"}
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Total Tickets" value={stats.total} />
        <StatCard label="Open Tickets" value={stats.open} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Closed Tickets" value={stats.closed} />
      </div>

      {/*
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-gray-900">Recent Activity</h2>
          <p className="text-gray-500 text-sm">
            Latest ticket updates and activities
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-900">{activity.title}</p>
                  <p className="text-gray-500 text-sm">
                    {activity.user} • {activity.time}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{activity.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
};

export default DashboardPage;
