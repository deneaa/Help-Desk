import type { Category, Priority, Status, TicketType } from "./enums";

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
