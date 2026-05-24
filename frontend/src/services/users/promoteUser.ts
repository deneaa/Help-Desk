export const promoteUser = async (userId: number, token: string) => {
  const res = await fetch(
    `http://localhost:8080/api/users/${userId}/role/promote`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) throw new Error("Failed to promote user");
  return res.json();
};
