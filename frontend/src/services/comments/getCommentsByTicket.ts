export const getCommentsByTicket = async (ticketId: number, token: string) => {
  const res = await fetch(
    `http://localhost:8080/api/comments/ticket/${ticketId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
};
