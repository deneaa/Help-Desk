// THIS IS JUST A PROTOTYPE, IGNORE THE MESS
// It will be refactored into modular components and better structure later

import { ArrowLeft, Clock, Paperclip, Send, User } from "lucide-react";
import {
  Priorities,
  Statuses,
  type ITicket,
  type Priority,
  type Status,
} from "../types/types";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTicketDetails } from "../services/ticketDetailsService";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../app/store";
import { getStatusColor } from "../components/ui/getStatusColor";
import { getPriorityColor } from "../components/ui/getPriorityColor";

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    if (ticket.status === selectedStatus) {
      setError("Ticket-ul are deja acest status");
      return;
    }

    const res = await fetch(`http://localhost:8080/api/tickets/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: selectedStatus }),
    });

    const updated = await res.json();
    setTicket(updated);
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
      const res = await fetch(
        `http://localhost:8080/api/tickets/${id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ agentId: agentId }),
        },
      );

      if (!res.ok) throw new Error("Assign failed");

      const updated = await res.json();
      setTicket(updated);
    } catch (err) {
      setError("Eroare la assign");
      console.log(err);
    }
  };

  const handlePriorityUpdate = async () => {
    if (!ticket || !token) return;

    if (ticket.priority === selectedPriority) {
      setError("Priority already set");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/tickets/${id}/priority`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priority: selectedPriority }),
        },
      );

      const updated = await res.json();
      setTicket(updated);
      setIsPriorityOpen(false);
    } catch (err) {
      setError("Failed to update priority");
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/my-tickets")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to My Tickets
      </button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gray-500">Ticket #{ticket.id}</span>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${getPriorityColor(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <h1 className="text-gray-900 mb-3">{ticket.title}</h1>
                <p className="text-gray-600 leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-gray-100 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                {ticket.createdAt}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                Reported by {ticket.createdByName}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-gray-900 mb-6">Conversation</h2>
            <div className="space-y-6"></div>
          </div>
          {/*}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-gray-900 mb-4">Add Comment</h3>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50 resize-none"
                placeholder="Type your comment here..."
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <Paperclip className="w-5 h-5" />
                  Attach File
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Comment
                </button>
              </div>
            </form>
          </div>*/}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-900 mb-4">Update Status</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Status)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50"
            >
              {Statuses.map((s) => (
                <option value={s}>{s}</option>
              ))}
            </select>
            <button
              className="w-full mt-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              onClick={handleStatusUpdate}
            >
              Update Status
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-900 mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">Category</p>
                <p className="text-gray-900">{ticket.category}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Assigned To</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-900">
                    {ticket.assignedToName ? ticket.assignedToName : "Nobody"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Priority</p>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Created</p>
                <p className="text-gray-900">{ticket.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all text-left px-4"
                onClick={handleAssign}
              >
                Assign to me
              </button>
              <button
                className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all text-left px-4"
                onClick={() => setIsPriorityOpen(true)}
              >
                Change priority
              </button>
              <button className="w-full py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all text-left px-4">
                Delete ticket
              </button>
            </div>
          </div>
        </div>
      </div>
      {isPriorityOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Change Priority</h2>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority)}
              className="w-full px-4 py-3 rounded-xl border mb-4"
            >
              {Priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPriorityOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handlePriorityUpdate}
                className="px-4 py-2 bg-violet-600 text-white rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailsPage;
