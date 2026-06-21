import {
  type ITicket,
  type Priority,
  type Status,
  type TicketType,
  type IComment,
} from "../types";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";

import { TicketHeader } from "../features/ticketDetails/components/TicketHeader";
import { TicketDetailsMain } from "../features/ticketDetails/components/TicketDetailsMain";
import { TicketConversation } from "../features/ticketDetails/components/TicketConversation";
import { TicketDetailsPanel } from "../features/ticketDetails/components/TicketDetailsPanel";
import { TicketActionsPanel } from "../features/ticketDetails/components/TicketActionsPanel";
import { TicketPriorityModal } from "../features/ticketDetails/components/TicketPriorityModal";
import { TicketTypeModal } from "../features/ticketDetails/components/TicketTypeModal";
import { TicketStatusPanel } from "../features/ticketDetails/components/TicketStatusPanel";

import {
  getPrivateCommentsByTicket,
  getPublicCommentsByTicket,
} from "../services/comments.service";

import {
  assignTicket,
  getTicketDetails,
  unassignTicket,
  updateTicketPriority,
  updateTicketStatus,
  updateTicketType,
} from "../services/tickets.service";

const TicketDetailsPage = () => {
  const { id } = useParams();

  const token = useAppSelector((s: RootState) => s.auth.token);
  const agentId = useAppSelector((s: RootState) => s.auth.user?.id);
  const role = useAppSelector((s: RootState) => s.auth.user?.role);

  const ticketId = useMemo(() => Number(id), [id]);

  const isStaff = role === "ADMIN" || role === "AGENT";

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Status | "">("");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "">("");
  const [selectedType, setSelectedType] = useState<TicketType | "">("");

  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !ticketId) return;

    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const ticketData = await getTicketDetails(ticketId, token);

        const commentsData = isStaff
          ? await getPrivateCommentsByTicket(ticketId, token)
          : await getPublicCommentsByTicket(ticketId, token);

        if (ignore) return;

        setTicket(ticketData);
        setComments(commentsData);

        setSelectedStatus(ticketData.status);
        setSelectedPriority(ticketData.priority);
        setSelectedType(ticketData.ticketType);
      } catch {
        if (!ignore) setError("Failed to load ticket");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [ticketId, token, isStaff]);


  const handleStatusUpdate = useCallback(async () => {
    if (!ticket || !selectedStatus || !token) return;

    if (ticket.status === selectedStatus) {
      setError("Ticket already has this status");
      return;
    }

    try {
      const updated = await updateTicketStatus(ticketId, selectedStatus, token);
      setTicket(updated);
      setError(null);
    } catch {
      setError("Failed to update status");
    }
  }, [ticket, selectedStatus, token, ticketId]);

  const handleAssign = useCallback(async () => {
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
      const updated = await assignTicket(ticketId, agentId, token);
      setTicket(updated);
      setError(null);
    } catch {
      setError("Failed to assign ticket");
    }
  }, [ticket, agentId, token, ticketId]);

  const handleUnassign = useCallback(async () => {
    if (!ticket || !token) return;

    try {
      const updated = await unassignTicket(ticketId, token);
      setTicket(updated);
      setError(null);
    } catch {
      setError("Failed to unassign ticket");
    }
  }, [ticket, token, ticketId]);

  const handlePriorityUpdate = useCallback(async () => {
    if (!ticket || !selectedPriority || !token) return;

    if (ticket.priority === selectedPriority) {
      setError("Ticket already has this priority");
      return;
    }

    try {
      const updated = await updateTicketPriority(
        ticketId,
        selectedPriority,
        token,
      );
      setTicket(updated);
      setIsPriorityOpen(false);
      setError(null);
    } catch {
      setError("Failed to update priority");
    }
  }, [ticket, selectedPriority, token, ticketId]);

  const handleTypeUpdate = useCallback(async () => {
    if (!ticket || !selectedType || !token) return;

    if (ticket.ticketType === selectedType) {
      setError("Ticket already has this type");
      return;
    }

    try {
      const updated = await updateTicketType(ticketId, selectedType, token);
      setTicket(updated);
      setIsTypeOpen(false);
      setError(null);
    } catch {
      setError("Failed to update type");
    }
  }, [ticket, selectedType, token, ticketId]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!ticket) return <p>Ticket not found</p>;

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

          <TicketConversation
            comments={comments}
            role={role!}
            ticketId={ticketId}
            token={token!}
            onCommentAdded={(c) => setComments((p) => [...p, c])}
          />
        </div>

        <div className="space-y-6">
          {isStaff && (
            <TicketStatusPanel
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              onUpdate={handleStatusUpdate}
            />
          )}

          <TicketDetailsPanel ticket={ticket} />

          {isStaff && (
            <TicketActionsPanel
              onAssign={handleAssign}
              onUnassign={handleUnassign}
              onPriorityOpen={() => setIsPriorityOpen(true)}
              onTypeOpen={() => setIsTypeOpen(true)}
              role={role}
              isAssignedToMe={ticket.assignedToId === agentId}
            />
          )}
        </div>
      </div>

      <TicketPriorityModal
        open={isPriorityOpen}
        selected={selectedPriority}
        setSelected={setSelectedPriority}
        onClose={() => setIsPriorityOpen(false)}
        onSave={handlePriorityUpdate}
      />

      <TicketTypeModal
        open={isTypeOpen}
        selected={selectedType}
        setSelected={setSelectedType}
        onClose={() => setIsTypeOpen(false)}
        onSave={handleTypeUpdate}
      />
    </div>
  );
};

export default TicketDetailsPage;
