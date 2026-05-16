export const getTypeColor = (type: string) => {
  switch (type) {
    case "BUG":
      return "bg-red-100 text-red-700";
    case "FEATURE":
      return "bg-purple-100 text-purple-700";
    case "REQUEST":
      return "bg-blue-100 text-blue-700";
    case "QUESTION":
      return "bg-cyan-100 text-cyan-700";
    case "INCIDENT":
      return "bg-orange-100 text-orange-700";
    case "TASK":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
