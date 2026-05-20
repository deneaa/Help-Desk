import TicketTableSection from "../features/tickets/TicketTableSection";
import { useTicketGrouped } from "../hooks/useTicketGrouped";

const TicketsPage = () => {
  const { stats, loading, error } = useTicketGrouped();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!stats) {
    return <p>Tickets not found</p>;
  }
  return (
    <div className="space-y-8">
      <TicketTableSection
        title="Open Tickets"
        tickets={stats.openTickets}
        viewAllLink="/tickets/category/open"
      />

      <TicketTableSection
        title="In Progress Tickets"
        tickets={stats.inProgressTickets}
        viewAllLink="/tickets/category/in_progress"
      />

      <TicketTableSection
        title="Closed Tickets"
        tickets={stats.closedTickets}
        viewAllLink="/tickets/category/closed"
      />

      <TicketTableSection
        title="Reopened Tickets"
        tickets={stats.reopenedTickets}
        viewAllLink="/tickets/category/reopened"
      />
    </div>
  );
};

export default TicketsPage;
