import type { Status } from "../../types";

export const updateTicketStatus = async (
  ticketId: number,
  status: Status,
  token: string,
) => {
  const res = await fetch(
    `http://localhost:8080/api/tickets/${ticketId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update status");
  }

  return res.json();
};
