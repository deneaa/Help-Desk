import { TicketTypes, type TicketType } from "../../../types/types";

interface Props {
  open: boolean;
  selected: TicketType | "";
  setSelected: (v: TicketType) => void;
  onClose: () => void;
  onSave: () => void;
}

export const TicketTypeModal = ({
  open,
  selected,
  setSelected,
  onClose,
  onSave,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Change Type</h2>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as TicketType)}
          className="w-full px-4 py-3 rounded-xl border mb-4"
        >
          {TicketTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-violet-600 text-white rounded-xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
