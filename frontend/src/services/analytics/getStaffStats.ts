export const getStaffStats = async (token: string) => {
  const res = await fetch("http://localhost:8080/api/analytics/staff-stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch staff stats");

  return res.json();
};
