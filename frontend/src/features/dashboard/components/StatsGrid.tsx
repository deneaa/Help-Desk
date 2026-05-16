import { Ticket, CircleDot, Clock, CheckCircle, RefreshCw } from "lucide-react";

interface Stats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
  reopenedTickets: number;
}

interface StatsGridProps {
  stats: Stats;
}

const statConfig = [
  {
    key: "totalTickets" as const,
    label: "Total tickets",
    icon: Ticket,
    color: "from-violet-500 to-violet-600",
  },
  {
    key: "openTickets" as const,
    label: "Open",
    icon: CircleDot,
    color: "from-blue-500 to-blue-600",
  },
  {
    key: "inProgressTickets" as const,
    label: "In progress",
    icon: Clock,
    color: "from-amber-500 to-amber-600",
  },
  {
    key: "closedTickets" as const,
    label: "Closed",
    icon: CheckCircle,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    key: "reopenedTickets" as const,
    label: "Reopened",
    icon: RefreshCw,
    color: "from-rose-500 to-rose-600",
  },
];

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-5 gap-6">
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-md`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-gray-900 text-2xl font-medium">{stats[key]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
