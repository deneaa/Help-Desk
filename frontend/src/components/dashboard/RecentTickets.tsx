import type { ITicket } from "../../types/types";
import StatusBadge from "../ui/StatusBadge";

type Props = { tickets: ITicket[] };

export default function RecentTickets({ tickets }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#CECBF6] p-6">
      <p className="text-xs font-medium text-[#534AB7] uppercase tracking-wider mb-4">
        Tickete recente
      </p>
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-[#EEEDFE]">
            <th className="text-xs text-gray-400 font-normal pb-2">Titlu</th>
            <th className="text-xs text-gray-400 font-normal pb-2">Status</th>
            <th className="text-xs text-gray-400 font-normal pb-2">
              Categorie
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              className="border-b border-[#f5f4ff] hover:bg-[#f5f4ff] transition-colors"
            >
              <td className="py-2 text-sm text-[#26215C]">{t.title}</td>
              <td className="py-2">
                <StatusBadge status={t.status} />
              </td>
              <td className="py-2 text-sm text-gray-400">{t.category}</td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="py-6 text-center text-sm text-gray-400"
              >
                Niciun ticket
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
