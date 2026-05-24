import type { Role } from "../../../types/types";

interface Props {
  onAssign: () => void;
  onUnassign: () => void;
  onPriorityOpen: () => void;
  onTypeOpen: () => void;
  role: Role;
  isAssignedToMe: boolean;
}

export const TicketActionsPanel = ({
  onAssign,
  onUnassign,
  onPriorityOpen,
  onTypeOpen,
  role,
  isAssignedToMe,
}: Props) => {
  const isStaff = role === "ADMIN" || role === "AGENT";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-gray-900 mb-4">Actions</h3>

      <div className="space-y-2">
        {isStaff &&
          (isAssignedToMe ? (
            <button
              onClick={onUnassign}
              className="w-full py-2 text-orange-600 hover:bg-orange-50 rounded-xl text-left px-4"
            >
              Unassign me
            </button>
          ) : (
            <button
              onClick={onAssign}
              className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded-xl text-left px-4"
            >
              Assign to me
            </button>
          ))}

        {isStaff && (
          <button
            onClick={onPriorityOpen}
            className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded-xl text-left px-4"
          >
            Change priority
          </button>
        )}

        {isStaff && (
          <button
            onClick={onTypeOpen}
            className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded-xl text-left px-4"
          >
            Change type
          </button>
        )}

        {role === "ADMIN" && (
          <button className="w-full py-2 text-red-600 hover:bg-red-50 rounded-xl text-left px-4">
            Delete ticket
          </button>
        )}
      </div>
    </div>
  );
};
