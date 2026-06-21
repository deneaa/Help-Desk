import {
  type ITicket,
  type Priority,
  type Status,
  type TicketType,
  type IComment,
} from "../types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const token = useAppSelector((state: RootState) => state.auth.token);
  const agentId = useAppSelector((state: RootState) => state.auth.user?.id);
  const role = useAppSelector((state: RootState) => state.auth.user?.role);

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
    const loadTicketData = async () => {
      try {
        if (!token || !id) return;
        const ticketData = await getTicketDetails(Number(id), token);
        const isStaff = role === "ADMIN" || role === "AGENT";
        console.log("fetching comments, isStaff:", isStaff, "role:", role);
        const commentsData = isStaff
          ? await getPrivateCommentsByTicket(Number(id), token)
          : await getPublicCommentsByTicket(Number(id), token);
        setTicket(ticketData);
        setComments(commentsData);
        setSelectedStatus(ticketData.status);
        setSelectedPriority(ticketData.priority);
        setSelectedType(ticketData.ticketType);
      } catch (err) {
        console.log(err);
        setError("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };
    loadTicketData();
  }, [id, token, role]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!ticket) return <p>Ticket not found</p>;

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !token) return;
    if (ticket.status === selectedStatus) {
      setError("Ticket already has this status");
      return;
    }
    try {
      const updated = await updateTicketStatus(
        Number(id),
        selectedStatus,
        token,
      );
      setTicket(updated);
      setError(null);
    } catch {
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
      const updated = await assignTicket(Number(id), agentId, token);
      setTicket(updated);
      setError(null);
    } catch {
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
      const updated = await updateTicketPriority(
        Number(id),
        selectedPriority,
        token,
      );
      setTicket(updated);
      setIsPriorityOpen(false);
      setError(null);
    } catch {
      setError("Failed to update priority");
    }
  };

  const handleUnassign = async () => {
    if (!ticket || !agentId || !token) return;
    try {
      const updated = await unassignTicket(Number(id), token);
      setTicket(updated);
      setError(null);
    } catch {
      setError("Failed to unassign ticket");
    }
  };

  const handleTypeUpdate = async () => {
    if (!selectedType || !token) return;
    if (ticket.ticketType === selectedType) {
      setError("Ticket already has this type");
      return;
    }
    try {
      const updated = await updateTicketType(Number(id), selectedType, token);
      setTicket(updated);
      setIsTypeOpen(false);
      setError(null);
    } catch {
      setError("Failed to update type");
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
          <TicketConversation
            comments={comments}
            role={role!}
            ticketId={Number(id)}
            token={token!}
            onCommentAdded={(newComment) =>
              setComments((prev) => [...prev, newComment])
            }
          />
        </div>

        <div className="space-y-6">
          {(role === "ADMIN" || role === "AGENT") && (
            <TicketStatusPanel
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              onUpdate={handleStatusUpdate}
            />
          )}
          <TicketDetailsPanel ticket={ticket} />
          {(role === "ADMIN" || role === "AGENT") && (
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
