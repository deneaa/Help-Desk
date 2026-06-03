import { useEffect, useState } from "react";
import type { Category, ITicket, TicketPageResponse } from "../types";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";
import { apiRequest } from "../services/api";

const getTicketsCategory = async (
  token: string,
  category: Category,
  page: number,
  size: number,
): Promise<TicketPageResponse> => {
  return apiRequest(`/tickets/category/${category}?page=${page}&size=${size}`, {
    token,
  });
};

export const useTicketsCategory = (
  category: Category,
  page: number,
  size: number,
) => {
  const [stats, setStats] = useState<ITicket[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getTicketsCategory(token, category, page, size);

        setStats(data.content);
        setTotalPages(data.totalPages);
      } catch {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, category, page, size]);

  return { stats, totalPages, loading, error };
};
