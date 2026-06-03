import type { AddCommentPayload, IComment } from "../types";
import { apiRequest } from "./api";

/*
ADD COMMENT
*/
export const addComment = async (
  payload: AddCommentPayload,
  token: string,
): Promise<IComment> => {
  return apiRequest("/comments", { method: "POST", body: payload, token });
};

/*
GET PRIVATE (INTERNAL) AND PUBLIC COMMENTS FOR A TICKET
*/
export const getPrivateCommentsByTicket = async (
  ticketId: number,
  token: string,
): Promise<IComment[]> => {
  return apiRequest(`/comments/ticket/${ticketId}`, { token });
};

export const getPublicCommentsByTicket = async (
  ticketId: number,
  token: string,
): Promise<IComment[]> => {
  return apiRequest(`/comments/ticket/${ticketId}/public`, { token });
};
