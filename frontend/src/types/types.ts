export type Role = "USER" | "AGENT";
export type Status = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type Category = "IT" | "HR" | "NETWORK" | "SOFTWARE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const Priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const Categories = ["IT", "HR", "NETWORK", "SOFTWARE"] as const;
export const Statuses = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface ITicket {
  id: number;
  title: string;
  description: string;
  status: Status;
  category: Category;
  priority: Priority;
  createdAt: string;
  updatedAt: string;

  createdById: number | null;
  createdByName: string | null;

  assignedToId: number | null;
  assignedToName: string | null;
}

export interface IComment {
  id: number;
  content: string;
  isInternal: boolean;
  createdAt: string;
  author: IUser;
  ticket: ITicket;
}

export interface INotification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  user: IUser;
  ticket: ITicket;
}

export interface IAuditLog {
  id: number;
  action: string;
  oldValue?: string;
  newValue?: string;
  isVisibleToUser: boolean;
  changedAt: string;
  ticket: ITicket;
  changedBy: IUser;
}
