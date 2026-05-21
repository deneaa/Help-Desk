export const getRoleColor = (role: string) => {
  const map: Record<string, string> = {
    ADMIN: "bg-red-50 text-red-700 border border-red-200",
    AGENT: "bg-violet-50 text-violet-700 border border-violet-200",
    USER: "bg-blue-50 text-blue-700 border border-blue-200",
  };

  return map[role] ?? "bg-gray-50 text-gray-700 border border-gray-200";
};
