import { useEffect, useState } from "react";
import { getDashboardPrivateStats, type IDashboardPrivateStats } from "../services/dashboard/getDashboardPrivateStats";

export const usePrivateDashboardStats = (token: string | null) => {
  const [stats, setStats] = useState<IDashboardPrivateStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardPrivateStats(token);
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