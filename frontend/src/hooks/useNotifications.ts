import { useEffect, useState } from "react";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";
import type { INotification } from "../types";
import { apiRequest } from "../services/api";

const getNotifications = async (token: string): Promise<INotification[]> => {
  return apiRequest<INotification[]>("/notifications/my", { token });
};

export const useNotifications = () => {
  const token = useAppSelector((state: RootState) => state.auth.token);

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getNotifications(token);
        setNotifications(data);
      } catch {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { notifications, setNotifications, loading, error };
};
