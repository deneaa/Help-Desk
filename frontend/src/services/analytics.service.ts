import type { StaffStats } from "../types";
import { apiRequest } from "./api";

/*
GET STAFF STATS FOR EVERYONE
*/
export const getStaffStats = async (token: string): Promise<StaffStats[]> => {
  return apiRequest("/analytics/staff-stats", { token });
};

export const getMyStaffStats = async (token: string): Promise<StaffStats> => {
  return apiRequest("/analytics/staff-stats/my", { token });
};
