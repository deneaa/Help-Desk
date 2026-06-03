import type { ITicket } from "../../types";

export const getTicketDetails = async (
  ticketId: number,
  token: string,
): Promise<ITicket> => {
  const res = await fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch ticket details");
  }

  return res.json();
};
