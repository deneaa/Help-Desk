import { useEffect, useState } from "react";
import { getTicketDetails } from "../services/tickets/getTicketDetails";
import { getCommentsByTicket } from "../services/comments/getPublicCommentsByTicket";
import type { ITicket } from "../types";

export const useTicketDetails = (id: number, token: string | null) => {
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!token) return;

        const [ticketData, commentsData] = await Promise.all([
          getTicketDetails(id, token),
          getCommentsByTicket(id, token),
        ]);

        console.log(ticketData);
        console.log(commentsData);

        setTicket({
          ...ticketData,
          comments: commentsData,
        });
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
