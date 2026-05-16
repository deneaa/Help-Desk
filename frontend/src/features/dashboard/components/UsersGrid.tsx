import { Users, UserCheck, Shield } from "lucide-react";

interface Stats {
  users: number;
  agents: number;
  admins: number;
}

interface StatsGridProps {
  userStats: Stats;
}

const statConfig = [
  {
    key: "users" as const,
    label: "Users",
    icon: Users,
    color: "from-violet-500 to-violet-600",
  },
  {
    key: "agents" as const,
    label: "Agents",
    icon: UserCheck,
    color: "from-blue-500 to-blue-600",
  },
  {
    key: "admins" as const,
    label: "Admins",
    icon: Shield,
    color: "from-emerald-500 to-emerald-600",
  },
];

const UsersGrid = ({ userStats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-md`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-gray-900 text-2xl font-medium">
                {userStats[key]}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersGrid;
