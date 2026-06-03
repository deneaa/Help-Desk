import { useEffect, useState } from "react";
import type { TicketsGrouped } from "../types";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";
import { apiRequest } from "../services/api";

const getTicketsGrouped = async (token: string): Promise<TicketsGrouped> => {
  return apiRequest("/analytics/tickets/recent/grouped", { token });
};

export const useTicketGrouped = () => {
  const [stats, setStats] = useState<TicketsGrouped | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTicketsGrouped(token);
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
