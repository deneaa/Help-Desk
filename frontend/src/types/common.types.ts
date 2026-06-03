import type { IAuditLog } from "./audit.types";
import type { UserPublicDTO } from "./user.types";

export interface WeeklyTicket {
  week: string;
  tickets: number;
}

export type StaffResponse = {
  admins: UserPublicDTO[];
  agents: UserPublicDTO[];
};

export type StaffStats = {
  userId: number;
  name: string;
  weekTickets: number;
  monthTickets: number;
  allTimeTickets: number;
};

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

export interface IDashboardPrivateStats extends IDashboardStats {
  auditLogs: IAuditLog[];
}
