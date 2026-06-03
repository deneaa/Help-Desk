import type { IComment } from "../../types";

interface AddCommentPayload {
  ticketId: number;
  content: string;
  internal: boolean;
}

export const addComment = async (
  payload: AddCommentPayload,
  token: string,
): Promise<IComment> => {
  const res = await fetch(`http://localhost:8080/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
};
