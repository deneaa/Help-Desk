export const demoteUser = async (userId: number, token: string) => {
  const res = await fetch(
    `http://localhost:8080/api/users/${userId}/role/demote`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) throw new Error("Failed to demote user");
  return res.json();
};
