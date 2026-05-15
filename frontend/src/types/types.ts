export type Role = "USER" | "AGENT" | "ADMIN";
export type Status = "OPEN" | "IN_PROGRESS" | "CLOSED" | "REOPENED";
export type Category = "IT" | "HR" | "NETWORK" | "SOFTWARE" | "GENERAL";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TicketType = "BUG" | "INCIDENT" | "REQUEST" | "TASK";
export type AuditType = "INSERT" | "UPDATE" | "DELETE";
export type NotificationReferenceType = "TICKET" | "COMMENT";
export type NotificationType =
  | "TICKET_CREATED"
  | "TICKET_ASSIGNED"
  | "TICKET_UNASSIGNED"
  | "TICKET_STATUS_CHANGED"
  | "TICKET_PRIORITY_CHANGED"
  | "TICKET_TYPE_CHANGED"
  | "TICKET_CATEGORY_CHANGED"
  | "TICKET_CLOSED"
  | "COMMENT_ADDED";

export const Priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const Categories = [
  "IT",
  "HR",
  "NETWORK",
  "SOFTWARE",
  "GENERAL",
] as const;
export const Statuses = ["OPEN", "IN_PROGRESS", "CLOSED", "REOPENED"] as const;
export const TicketTypes = ["BUG", "INCIDENT", "REQUEST", "TASK"] as const;

export interface WeeklyTicket {
  week: string;
  tickets: number;
}

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
  ticketType: TicketType;
  status: Status;
  category: Category;
  priority: Priority;
  createdAt: string;
  updatedAt: string;

  createdById: number;
  createdByName: string;

  assignedToId: number | null;
  assignedToName: string | null;
}

export interface IComment {
  id: number;
  content: string;
  isInternal: boolean;
  createdAt: string;
  authorId: number;
  authorName: string;
  ticketId: number;
}

export interface INotification {
  id: number;
  message: string;
  type: NotificationType;
  isRead: boolean;
  redirectUrl: string;
  issuedBy: string;
  createdAt: string;
}

export interface IAuditLog {
  id: number;
  type: AuditType;
  action: string;
  entityType: string;
  entityId: number;
  newValue: string;
  internal: boolean;
  changedAt: string;
  changedBy: string;
}
