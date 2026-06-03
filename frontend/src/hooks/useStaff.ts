import { useEffect, useState } from "react";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";
import type { StaffResponse } from "../types";
import { apiRequest } from "../services/api";

const getStaff = async (token: string): Promise<StaffResponse> => {
  return apiRequest("/analytics/staff-members", { token });
};

export const useStaff = () => {
  const [stats, setStats] = useState<StaffResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getStaff(token);
        setStats(data);
      } catch {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { stats, loading, error };
};
