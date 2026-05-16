import {
  type ITicket,
  type Priority,
  type Status,
  type IComment,
} from "../types/types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getTicketDetails } from "../services/ticketDetailsService";
import { getCommentsByTicket } from "../services/comments/getCommentsByTicket";

import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";

import { updateTicketStatus } from "../services/tickets/updateTicketStatus";
import { assignTicket } from "../services/tickets/assignTicket";
import { updateTicketPriority } from "../services/tickets/updateTicketPriority";
import { TicketHeader } from "../features/tickets/components/TicketHeader";
import { TicketDetailsMain } from "../features/tickets/components/TicketDetailsMain";
import { TicketConversation } from "../features/tickets/components/TicketConversation";
import { TicketStatusPanel } from "../features/tickets/components/TicketStatusPanel";
import { TicketDetailsPanel } from "../features/tickets/components/TicketDetailsPanel";
import { TicketActionsPanel } from "../features/tickets/components/TicketActionsPanel";
import { TicketPriorityModal } from "../features/tickets/components/TicketPriorityModal";

const TicketDetailsPage = () => {
  const { id } = useParams();

  const token = useAppSelector((state: RootState) => state.auth.token);
  const agentId = useAppSelector((state: RootState) => state.auth.user?.id);

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<Status | "">("");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "">("");

  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicketData = async () => {
      try {
        if (!token || !id) return;

        const ticketData = await getTicketDetails(Number(id), token);
        const commentsData = await getCommentsByTicket(Number(id), token);

        setTicket(ticketData);
        setComments(commentsData);

        setSelectedStatus(ticketData.status);
        setSelectedPriority(ticketData.priority);
      } catch (err) {
        console.log(err);
        setError("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    loadTicketData();
  }, [id, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!ticket) {
    return <p>Ticket not found</p>;
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !token) return;

    if (ticket.status === selectedStatus) {
      setError("Ticket already has this status");
      return;
    }

    try {
      const updatedTicket = await updateTicketStatus(
        Number(id),
        selectedStatus,
        token,
      );

      setTicket(updatedTicket);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to update status");
    }
  };

  const handleAssign = async () => {
    if (!ticket || !agentId || !token) return;

    if (ticket.assignedToId && ticket.assignedToId !== agentId) {
      setError("Ticket is already assigned");
      return;
    }

    if (ticket.assignedToId === agentId) {
      setError("Ticket already assigned to you");
      return;
    }

    if (ticket.createdById === agentId) {
      setError("You cannot assign your own ticket");
      return;
    }

    try {
      const updatedTicket = await assignTicket(Number(id), agentId, token);

      setTicket(updatedTicket);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to assign ticket");
    }
  };

  const handlePriorityUpdate = async () => {
    if (!selectedPriority || !token) return;

    if (ticket.priority === selectedPriority) {
      setError("Ticket already has this priority");
      return;
    }

    try {
      const updatedTicket = await updateTicketPriority(
        Number(id),
        selectedPriority,
        token,
      );

      setTicket(updatedTicket);
      setIsPriorityOpen(false);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to update priority");
    }
  };

  return (
    <div className="space-y-6">
      <TicketHeader />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <TicketDetailsMain ticket={ticket} />

          <TicketConversation comments={comments} />
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
