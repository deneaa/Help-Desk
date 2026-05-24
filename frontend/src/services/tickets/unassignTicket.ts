export const unassignTicket = async (
  ticketId: number,
  token: string,
) => {
  const res = await fetch(
    `http://localhost:8080/api/tickets/${ticketId}/unassign`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to assign ticket");
  }

  return res.json();
};
