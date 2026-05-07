import { useEffect, useState } from "react";
import {
  getDashboardStats,
  type IDashboardStats,
} from "../services/dashboard/getDashboardStats";

export const useDashboardStats = (token: string | null) => {
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!token) return;

        const data = await getDashboardStats(token);
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  return { stats, loading, error };
};
