import type { NotificationType } from "./enums";

export interface INotification {
  id: number;
  message: string;
  type: NotificationType;
  read: boolean;
  redirectUrl: string;
  issuedBy: string;
  createdAt: string;
}
