export interface CreateCommentPayload {
  content: string;
  ticketId: number;
  isInternal: boolean;
}

export const createComment = async (
  payload: CreateCommentPayload,
  token: string,
) => {
  const res = await fetch(
    "http://localhost:8080/api/comments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to create comment");
  }

  return res.json();
};