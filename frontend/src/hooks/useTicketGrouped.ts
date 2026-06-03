import { useEffect, useState } from "react";
import type { ITicket } from "../types";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";

type TicketsGrouped = {
  openTickets: ITicket[];
  inProgressTickets: ITicket[];
  closedTickets: ITicket[];
  reopenedTickets: ITicket[];
};

const getTicketsGrouped = async (
  token: string | null,
): Promise<TicketsGrouped> => {
  const res = await fetch(
    "http://localhost:8080/api/analytics/tickets/recent/grouped",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
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
