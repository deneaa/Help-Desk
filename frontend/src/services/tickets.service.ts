import type {
  Category,
  ITicket,
  Priority,
  Status,
  TicketPageResponse,
  TicketType,
} from "../types";
import { apiRequest } from "./api";

/*
ASSIGN & UNASSIGN
*/
export const assignTicket = async (
  ticketId: number,
  agentId: number,
  token: string,
): Promise<ITicket> => {
  return apiRequest(`/tickets/${ticketId}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ agentId }),
    token,
  });
};

export const unassignTicket = async (
  ticketId: number,
  token: string,
): Promise<ITicket> => {
  return apiRequest(`/tickelts/${ticketId}/unassign`, {
    method: "PATCH",
    token,
  });
};

/* 
UPDATE PRIORITY, STATUS, TICKET TYPE, CATEGORY
*/
export const updateTicketPriority = async (
  ticketId: number,
  priority: Priority,
  token: string,
): Promise<ITicket> => {
  return apiRequest(`/tickets/${ticketId}/priority`, {
    method: "PATCH",
    body: JSON.stringify({ priority }),
    token,
  });
};

export const updateTicketStatus = async (
  ticketId: number,
  status: Status,
  token: string,
): Promise<ITicket> => {
  return apiRequest(`/tickets/${ticketId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    token,
  });
};

export const updateTicketType = async (
  ticketId: number,
  type: TicketType,
  token: string,
): Promise<ITicket> => {
  return apiRequest(`/tickets/${ticketId}/ticketType`, {
    method: "PATCH",
    body: JSON.stringify({ type }),
    token,
  });
};

export const updateTicketCategory = async (
  ticketId: number,
  category: Category,
  token: string,
): Promise<ITicket> => {
  return apiRequest(`/tickets/${ticketId}/category`, {
    method: "PATCH",
    body: JSON.stringify({ category }),
    token,
  });
};

/*
GET MY TICKETS AND TICKET DETAILS
*/

export const getTicketDetails = async (
  ticketId: number,
  token: string,
): Promise<ITicket> => {
  return apiRequest(`/tickets/${ticketId}`, { token });
};

export const getMyTickets = async (
  token: string,
  page: number = 0,
): Promise<TicketPageResponse> => {
  return apiRequest(`/tickets/my?page=${page}&size=10`, { token });
};
