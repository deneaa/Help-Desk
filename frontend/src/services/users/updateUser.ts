import type { IUser } from "../../types/types";

export const updateUser = async (
  id: number,
  data: { name?: string; email?: string },
  token: string,
): Promise<IUser> => {
  const response = await fetch(`http://localhost:8080/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update user");

  return response.json();
};
