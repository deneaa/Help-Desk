import { useEffect, useState } from "react";
import type { UserProfileResponse } from "../types/types";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";

export const fetchUserProfile = async (
  userId: number,
  token: string | null,
): Promise<UserProfileResponse> => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};

export const useProfile = (userId: number) => {
  const [stats, setStats] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserProfile(userId, token);
        setStats(data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  return { stats, loading, error };
};
