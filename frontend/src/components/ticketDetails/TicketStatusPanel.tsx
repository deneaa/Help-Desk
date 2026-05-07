import { Statuses, type Status } from "../../types/types";

interface Props {
  selectedStatus: Status | "";
  setSelectedStatus: (v: Status) => void;
  onUpdate: () => void;
}

export const TicketStatusPanel = ({
  selectedStatus,
  setSelectedStatus,
  onUpdate,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-gray-900 mb-4">Update Status</h3>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as Status)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50"
      >
        {Statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        onClick={onUpdate}
        className="w-full mt-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl"
      >
        Update Status
      </button>
    </div>
  );
};
