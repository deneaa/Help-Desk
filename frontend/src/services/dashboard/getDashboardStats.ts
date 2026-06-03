import type { WeeklyTicket } from "../../types";

export interface IDashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
  reopenedTickets: number;

  weeklyTickets: WeeklyTicket[];

  users: number;
  agents: number;
  admins: number;
}

export const getDashboardStats = async (
  token: string,
): Promise<IDashboardStats> => {
  const res = await fetch("http://localhost:8080/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return res.json();
};
