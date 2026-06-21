import TicketTableSection from "../features/tickets/TicketTableSection";
import { useTicketGrouped } from "../hooks/useTicketGrouped";

const TicketsPage = () => {
  const { stats, loading, error } = useTicketGrouped();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  if (!stats) return <p>Tickets not found</p>;

  const { openTickets, inProgressTickets, closedTickets, reopenedTickets } =
    stats;

  return (
    <div className="space-y-8">
      <TicketTableSection
        title="Open Tickets"
        tickets={openTickets}
        viewAllLink="/tickets/category/open"
      />

      <TicketTableSection
        title="In Progress Tickets"
        tickets={inProgressTickets}
        viewAllLink="/tickets/category/in_progress"
      />

      <TicketTableSection
        title="Closed Tickets"
        tickets={closedTickets}
        viewAllLink="/tickets/category/closed"
      />

      <TicketTableSection
        title="Reopened Tickets"
        tickets={reopenedTickets}
        viewAllLink="/tickets/category/reopened"
      />
    </div>
  );
};

export default TicketsPage;
