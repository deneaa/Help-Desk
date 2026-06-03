import type { IAuditLog, WeeklyTicket } from "../../types";

export interface IDashboardPrivateStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
  reopenedTickets: number;

  weeklyTickets: WeeklyTicket[];

  users: number;
  agents: number;
  admins: number;

  auditLogs: IAuditLog[];
}


export const getDashboardPrivateStats = async (
  token: string,
): Promise<IDashboardPrivateStats> => {
  const res = await fetch("http://localhost:8080/api/dashboard/private", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return res.json();
};
