import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TicketHeader = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/my-tickets")}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      Back to My Tickets
    </button>
  );
};
