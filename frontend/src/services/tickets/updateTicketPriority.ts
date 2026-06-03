import type { Priority } from "../../types";

export const updateTicketPriority = async (
  ticketId: number,
  priority: Priority,
  token: string,
) => {
  const res = await fetch(
    `http://localhost:8080/api/tickets/${ticketId}/priority`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ priority }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update priority");
  }

  return res.json();
};
