interface Props {
  onAssign: () => void;
  onPriorityOpen: () => void;
}

export const TicketActionsPanel = ({ onAssign, onPriorityOpen }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-gray-900 mb-4">Actions</h3>

      <div className="space-y-2">
        <button
          onClick={onAssign}
          className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded-xl text-left px-4"
        >
          Assign to me
        </button>

        <button
          onClick={onPriorityOpen}
          className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded-xl text-left px-4"
        >
          Change priority
        </button>

        <button className="w-full py-2 text-red-600 hover:bg-red-50 rounded-xl text-left px-4">
          Delete ticket
        </button>
      </div>
    </div>
  );
};
