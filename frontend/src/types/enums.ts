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

// Used for selecting an option
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
