import { User } from "lucide-react";
import type { ITicket } from "../../../types/types";
import { getPriorityColor } from "../../../components/ui/getPriorityColor";

interface Props {
  ticket: ITicket;
}

export const TicketDetailsPanel = ({ ticket }: Props) => {
  const formattedDate = new Date(ticket.createdAt).toLocaleString("en-EN", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
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

            <p className="text-gray-900">{ticket.assignedToName ?? "Nobody"}</p>
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
          <p className="text-gray-900">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};
