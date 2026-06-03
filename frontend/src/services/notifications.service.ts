import type { BroadcastNotification } from "../types";
import { apiRequest } from "./api";

/*
SEND NOTIFICATION (GLOBAL ANNOUNCEMENT) TO ALL USERS
*/
export const sendNotification = async (
  body: BroadcastNotification,
  token: string,
): Promise<void> => {
  return apiRequest("/notifications/broadcast", {
    method: "POST",
    body,
    token,
  });
};

/*
MARK NOTIFICATIONS READ (ALL OR ONE)
*/

export const markAllRead = async (token: string): Promise<void> => {
  return apiRequest("/notifications/read-all", { method: "PATCH", token });
};

export const markAsRead = async (
  notificationId: number,
  token: string,
): Promise<void> => {
  return apiRequest(`/notifications/${notificationId}/read`, {
    method: "PATCH",
    token,
  });
};
