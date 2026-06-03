import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";
import type { ITicket } from "../types";
import { getMyTickets } from "../services/tickets/getMyTickets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TicketTableSection from "../features/tickets/TicketTableSection";

const MyTicketsPage = () => {
  const token = useAppSelector((state: RootState) => state.auth.token);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await getMyTickets(token, page);
        setTickets(data.content);
        setTotalPages(data.totalPages);
      } catch {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, page]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 text-2xl">My Tickets</h1>
        <p className="text-gray-500 text-sm mt-1">
          All tickets submitted by you
        </p>
      </div>

      <TicketTableSection title="My Tickets" tickets={tickets} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
                  ${
                    page === i
                      ? "bg-violet-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
