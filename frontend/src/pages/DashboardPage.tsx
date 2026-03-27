import { useEffect, useState } from "react";
import { getDashboardStats, getRecentTickets, getUsers } from "../services/dashboardService";
import type { ITicket, IUser } from "../types/types";

interface Stats {
  open: number;
  inProgress: number;
  closed: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ open: 0, inProgress: 0, closed: 0 });
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getRecentTickets().then(setTickets);
    getUsers().then(setUsers);
  }, []);

  const total = stats.open + stats.inProgress + stats.closed;
  const agents = users.filter(u => u.role === "AGENT").length;
  const userCount = users.filter(u => u.role === "USER").length;
  const recentTickets = tickets.slice(0, 5);
  const maxVal = Math.max(stats.open, stats.inProgress, stats.closed, 1);

  return (
    <div className="min-h-screen bg-[#f5f4ff] p-8">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-[#26215C]">Dashboard</h1>
        <span className="text-sm text-gray-400">
          {new Date().toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total tickete" value={total} accent="#7F77DD" sub="toate statusurile" />
        <StatCard label="Open" value={stats.open} accent="#EF9F27" sub="în așteptare" />
        <StatCard label="In Progress" value={stats.inProgress} accent="#378ADD" sub="în lucru" />
        <StatCard label="Closed" value={stats.closed} accent="#1D9E75" sub="rezolvate" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <MiniCard label="Utilizatori" value={userCount} />
        <MiniCard label="Agenți" value={agents} />
        <MiniCard label="Tickete azi" value={tickets.filter(t => {
          const today = new Date().toDateString();
          return new Date(t.createdAt).toDateString() === today;
        }).length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-[#CECBF6] p-6">
          <p className="text-xs font-medium text-[#534AB7] uppercase tracking-wider mb-4">Distribuție tickete</p>
          <div className="flex items-end gap-4 h-24">
            <Bar label="Open" value={stats.open} max={maxVal} color="#EF9F27" />
            <Bar label="In Progress" value={stats.inProgress} max={maxVal} color="#7F77DD" />
            <Bar label="Closed" value={stats.closed} max={maxVal} color="#1D9E75" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#CECBF6] p-6">
          <p className="text-xs font-medium text-[#534AB7] uppercase tracking-wider mb-4">Tickete recente</p>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#EEEDFE]">
                <th className="text-xs text-gray-400 font-normal pb-2">Titlu</th>
                <th className="text-xs text-gray-400 font-normal pb-2">Status</th>
                <th className="text-xs text-gray-400 font-normal pb-2">Categorie</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map(t => (
                <tr key={t.id} className="border-b border-[#f5f4ff] hover:bg-[#f5f4ff] transition-colors">
                  <td className="py-2 text-sm text-[#26215C]">{t.title}</td>
                  <td className="py-2"><StatusBadge status={t.status} /></td>
                  <td className="py-2 text-sm text-gray-400">{t.category}</td>
                </tr>
              ))}
              {recentTickets.length === 0 && (
                <tr><td colSpan={3} className="py-6 text-center text-sm text-gray-400">Niciun ticket</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-[#CECBF6] p-6 md:col-span-2">
          <p className="text-xs font-medium text-[#534AB7] uppercase tracking-wider mb-4">Utilizatori</p>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#EEEDFE]">
                <th className="text-xs text-gray-400 font-normal pb-2">Nume</th>
                <th className="text-xs text-gray-400 font-normal pb-2">Email</th>
                <th className="text-xs text-gray-400 font-normal pb-2">Rol</th>
                <th className="text-xs text-gray-400 font-normal pb-2">Creat la</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[#f5f4ff] hover:bg-[#f5f4ff] transition-colors">
                  <td className="py-2 text-sm text-[#26215C] font-medium">{u.name}</td>
                  <td className="py-2 text-sm text-gray-400">{u.email}</td>
                  <td className="py-2"><RoleBadge role={u.role} /></td>
                  <td className="py-2 text-sm text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString("ro-RO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, accent, sub }: { label: string; value: number; accent: string; sub: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#CECBF6] p-5"
      style={{ borderLeft: `3px solid ${accent}`, borderRadius: "0 14px 14px 0" }}>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-medium" style={{ color: "#26215C" }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: accent }}>{sub}</p>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#EEEDFE] rounded-2xl p-4">
      <p className="text-xs text-[#534AB7] mb-1">{label}</p>
      <p className="text-2xl font-medium text-[#3C3489]">{value}</p>
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const height = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-xs font-medium" style={{ color }}>{value}</span>
      <div className="w-full bg-[#f5f4ff] rounded-t-md flex items-end" style={{ height: "80px" }}>
        <div className="w-full rounded-t-md transition-all" style={{ height: `${height}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: "bg-[#FAEEDA] text-[#633806]",
    IN_PROGRESS: "bg-[#EEEDFE] text-[#3C3489]",
    CLOSED: "bg-[#EAF3DE] text-[#27500A]",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    USER: "bg-[#F1EFE8] text-[#444441]",
    AGENT: "bg-[#EEEDFE] text-[#3C3489]",
    ADMIN: "bg-[#FCEBEB] text-[#791F1F]",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[role] ?? "bg-gray-100 text-gray-500"}`}>
      {role}
    </span>
  );
}