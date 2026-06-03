import type { UserPublicDTO } from "./user.types";

export interface WeeklyTicket {
  week: string;
  tickets: number;
}

export type StaffResponse = {
  admins: UserPublicDTO[];
  agents: UserPublicDTO[];
};

export type StaffStats = {
  userId: number;
  name: string;
  weekTickets: number;
  monthTickets: number;
  allTimeTickets: number;
};
