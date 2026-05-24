export const deleteUser = async (userId: number, token: string) => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete user");
};
