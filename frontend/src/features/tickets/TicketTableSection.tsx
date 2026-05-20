import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTypeColor } from "../../components/ui/getTypeColor";
import { getStatusColor } from "../../components/ui/getStatusColor";
import { getPriorityColor } from "../../components/ui/getPriorityColor";
import type { ITicket } from "../../types/types";

interface Props {
  title: string;
  tickets: ITicket[];
  viewAllLink?: string;
}

const TicketTableSection = ({ title, tickets, viewAllLink }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-gray-900 text-lg">{title}</h2>
          <p className="text-gray-500 text-sm">
            Showing latest {tickets.length} tickets
          </p>
        </div>

        {viewAllLink && (
          <button
            onClick={() => navigate(viewAllLink)}
            className="text-violet-600 hover:text-violet-700 transition-colors"
          >
            View All
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-gray-600">ID</th>
              <th className="px-6 py-4 text-left text-gray-600">Title</th>
              <th className="px-6 py-4 text-left text-gray-600">Type</th>
              <th className="px-6 py-4 text-left text-gray-600">Category</th>
              <th className="px-6 py-4 text-left text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-gray-600">Priority</th>
              <th className="px-6 py-4 text-left text-gray-600">Date</th>
              <th className="px-6 py-4 text-left text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <td className="px-6 py-4 text-gray-500">#{ticket.id}</td>

                <td className="px-6 py-4 text-gray-900">{ticket.title}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${getTypeColor(ticket.ticketType)}`}
                  >
                    {ticket.ticketType}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">{ticket.category}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${getPriorityColor(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(ticket.createdAt).toLocaleString("en-EN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tickets/${ticket.id}`);
                    }}
                    className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTableSection;
