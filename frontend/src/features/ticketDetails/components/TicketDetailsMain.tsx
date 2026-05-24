import { Clock, User } from "lucide-react";
import { getStatusColor } from "../../../components/ui/getStatusColor";
import { getPriorityColor } from "../../../components/ui/getPriorityColor";
import { getTypeColor } from "../../../components/ui/getTypeColor";
import type { ITicket } from "../../../types/types";

interface Props {
  ticket: ITicket;
}

export const TicketDetailsMain = ({ ticket }: Props) => {
  const formattedDate = new Date(ticket.createdAt).toLocaleString("en-EN", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
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
            <span
              className={`px-3 py-1 rounded-lg text-sm ${getTypeColor(ticket.ticketType)}`}
            >
              {ticket.ticketType}
            </span>
          </div>

          <h1 className="text-gray-900 mb-3">{ticket.title}</h1>
          <p className="text-gray-600 leading-relaxed">{ticket.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-6 border-t border-gray-100 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          Reported by {ticket.createdByName}
        </div>
      </div>
    </div>
  );
};
