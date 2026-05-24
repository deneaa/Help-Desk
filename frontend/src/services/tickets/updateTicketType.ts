import type { ITicket, TicketType } from "../../types/types";

export const updateTicketType = async (
  ticketId: number,
  type: TicketType,
  token: string,
): Promise<ITicket> => {
  const res = await fetch(`http://localhost:8080/api/tickets/${ticketId}/ticketType`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type }),
  });

  if (!res.ok) throw new Error("Failed to update ticket type");

  return res.json();
};
