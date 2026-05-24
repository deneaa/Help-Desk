export const getPublicCommentsByTicket = async (
  ticketId: number,
  token: string,
) => {
  const res = await fetch(
    `http://localhost:8080/api/comments/ticket/${ticketId}/public`,
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
