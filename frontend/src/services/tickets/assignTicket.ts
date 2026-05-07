export const assignTicket = async (
  ticketId: number,
  agentId: number,
  token: string,
) => {
  const res = await fetch(
    `http://localhost:8080/api/tickets/${ticketId}/assign`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ agentId }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to assign ticket");
  }

  return res.json();
};
