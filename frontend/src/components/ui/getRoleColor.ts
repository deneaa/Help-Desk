export const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-green-100 text-green-700";
    case "AGENT":
      return "bg-violet-100 text-violet-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};
