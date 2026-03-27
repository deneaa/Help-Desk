import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getRecentTickets,
  getUsers,
} from "../services/dashboardService";
import type { ITicket, IUser } from "../types/types";
import StatCard from "../components/dashboard/StatCard";
import MiniCard from "../components/dashboard/MiniCard";
import BarChart from "../components/dashboard/BarChart";
import RecentTickets from "../components/dashboard/RecentTickets";
import UsersTable from "../components/dashboard/UsersTable";

interface Stats {
  open: number;
  inProgress: number;
  closed: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getRecentTickets().then(setTickets);
    getUsers().then(setUsers);
  }, []);

  const total = stats.open + stats.inProgress + stats.closed;
  const today = new Date().toDateString();

  return (
    <div className="min-h-screen bg-[#f5f4ff] p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-[#26215C]">Dashboard</h1>
        <span className="text-sm text-gray-400">
          {new Date().toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard
          label="Total tickete"
          value={total}
          accent="#7F77DD"
          sub="toate statusurile"
        />
        <StatCard
          label="Open"
          value={stats.open}
          accent="#EF9F27"
          sub="în așteptare"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          accent="#378ADD"
          sub="în lucru"
        />
        <StatCard
          label="Closed"
          value={stats.closed}
          accent="#1D9E75"
          sub="rezolvate"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <MiniCard
          label="Utilizatori"
          value={users.filter((u) => u.role === "USER").length}
        />
        <MiniCard
          label="Agenți"
          value={users.filter((u) => u.role === "AGENT").length}
        />
        <MiniCard
          label="Tickete azi"
          value={
            tickets.filter(
              (t) => new Date(t.createdAt).toDateString() === today,
            ).length
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChart
          open={stats.open}
          inProgress={stats.inProgress}
          closed={stats.closed}
        />
        <RecentTickets tickets={tickets.slice(0, 5)} />
        <UsersTable users={users} />
      </div>
    </div>
  );
}
