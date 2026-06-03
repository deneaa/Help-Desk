import type { Status } from "../../types";

export const getStatusColor = (status: Status) => {
  switch (status) {
    case "OPEN":
      return "bg-orange-100 text-orange-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "CLOSED":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
