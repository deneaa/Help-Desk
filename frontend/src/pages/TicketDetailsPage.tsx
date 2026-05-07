import { type ITicket, type Priority, type Status } from "../types/types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTicketDetails } from "../services/ticketDetailsService";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";
import { updateTicketStatus } from "../services/tickets/updateTicketStatus";
import { assignTicket } from "../services/tickets/assignTicket";
import { updateTicketPriority } from "../services/tickets/updateTicketPriority";
import { TicketHeader } from "../components/ticketDetails/TicketHeader";
import { TicketDetailsMain } from "../components/ticketDetails/TicketDetailsMain";
import { TicketConversation } from "../components/ticketDetails/TicketConversation";
import { TicketDetailsPanel } from "../components/ticketDetails/TicketDetailsPanel";
import { TicketActionsPanel } from "../components/ticketDetails/TicketActionsPanel";
import { TicketPriorityModal } from "../components/ticketDetails/TicketPriorityModal";
import { TicketStatusPanel } from "../components/ticketDetails/TicketStatusPanel";

const TicketDetailsPage = () => {
  const { id } = useParams();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const agentId = useAppSelector((state: RootState) => state.auth.user!.id);

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | "">("");
  const [error, setError] = useState<string | null>(null);

  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | "">("");

  useEffect(() => {
    const load = async () => {
      try {
        if (token) {
          const data = await getTicketDetails(Number(id), token);
          setTicket(data);
          setSelectedStatus(data.status);
          setSelectedPriority(data.priority);
        }
      } catch (err) {
        setError("Error loading ticket");
        console.log(err);
      }
    };

    load();
  }, [id, token]);

  if (error) return <p>{error}</p>;
  if (!ticket) return <p>Loading...</p>;

  const handleStatusUpdate = async () => {
    if (!ticket) return;
    if (!selectedStatus) return null;

    if (ticket.status === selectedStatus) {
      setError("Ticket-ul are deja acest status");
      return;
    }

    try {
      const updated = await updateTicketStatus(
        Number(id),
        selectedStatus,
        token!,
      );

      setTicket(updated);
    } catch (err) {
      setError("Status update failed");
      console.log(err);
    }
  };

  const handleAssign = async () => {
    if (!ticket || !agentId || !token) return;

    if (ticket.assignedToId && ticket.assignedToId !== agentId) {
      setError("Ticket-ul este preluat deja de altcineva");
      return;
    }

    if (ticket.assignedToId === agentId) {
      setError("Ticket-ul este deja alocat ție");
      return;
    }

    if (ticket.createdById === agentId) {
      setError("Nu poti sa-ti aloci tie ticket-ul facut de tine");
      return;
    }

    try {
      const updated = await assignTicket(Number(id), agentId, token);
      setTicket(updated);
    } catch (err) {
      setError("Eroare la assign");
      console.log(err);
    }
  };

  const handlePriorityUpdate = async () => {
    if (!ticket || !token) return;
    if (!selectedPriority) return;

    if (ticket.priority === selectedPriority) {
      setError("Priority already set");
      return;
    }

    try {
      const updated = await updateTicketPriority(
        Number(id),
        selectedPriority,
        token,
      );

      setTicket(updated);
      setIsPriorityOpen(false);
    } catch (err) {
      setError("Failed to update priority");
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      <TicketHeader />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <TicketDetailsMain ticket={ticket} />
          <TicketConversation ticket={ticket} />
        </div>

        <div className="space-y-6">
          <TicketStatusPanel
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            onUpdate={handleStatusUpdate}
          />

          <TicketDetailsPanel ticket={ticket} />
          <TicketActionsPanel
            onAssign={handleAssign}
            onPriorityOpen={() => setIsPriorityOpen(true)}
          />
        </div>
      </div>

      <TicketPriorityModal
        open={isPriorityOpen}
        selected={selectedPriority}
        setSelected={setSelectedPriority}
        onClose={() => setIsPriorityOpen(false)}
        onSave={handlePriorityUpdate}
      />
    </div>
  );
};

export default TicketDetailsPage;
