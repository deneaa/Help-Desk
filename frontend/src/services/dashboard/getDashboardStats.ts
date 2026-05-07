export interface IDashboardStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

export const getDashboardStats = async (
  token: string,
): Promise<IDashboardStats> => {
  const res = await fetch("http://localhost:8080/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return res.json();
};
