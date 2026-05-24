export const getMyStaffStats = async (token: string) => {
  const res = await fetch(
    "http://localhost:8080/api/analytics/staff-stats/my",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch my stats");

  return res.json();
};
