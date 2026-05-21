import { useEffect, useState } from "react";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";
import type { StaffResponse } from "../types/types";

const getStaff = async (token: string | null): Promise<StaffResponse> => {
  const res = await fetch("http://localhost:8080/api/analytics/staff", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
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
