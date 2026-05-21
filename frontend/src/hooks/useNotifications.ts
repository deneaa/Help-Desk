import { useEffect, useState } from "react";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";
import type { INotification } from "../types/types";

const getNotifications = async (token: string): Promise<INotification[]> => {
  const res = await fetch("http://localhost:8080/api/notifications/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return res.json();
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
