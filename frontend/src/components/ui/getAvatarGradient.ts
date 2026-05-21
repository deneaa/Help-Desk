export const getAvatarGradient = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "from-red-400 to-rose-600";
    case "AGENT":
      return "from-violet-500 to-purple-600";
    default:
      return "from-blue-400 to-blue-600";
  }
};
