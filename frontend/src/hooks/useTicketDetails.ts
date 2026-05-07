import { useEffect, useState } from "react";
import { getTicketDetails } from "../services/tickets/getTicketDetails";
import type { ITicket } from "../types/types";

export const useTicketDetails = (id: number, token: string | null) => {
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!token) return;
        const data = await getTicketDetails(id, token);
        setTicket(data);
      } catch (err) {
        console.error(err);
        setError("Error loading ticket");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  return { ticket, setTicket, error, loading };
};
