import { useEffect, useState } from "react";
import type { UserProfileResponse } from "../types";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";
import { apiRequest } from "../services/api";

const getUserProfile = async (
  userId: number,
  token: string,
): Promise<UserProfileResponse> => {
  return apiRequest(`/users/${userId}`, { token });
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
        const data = await getUserProfile(userId, token);
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
