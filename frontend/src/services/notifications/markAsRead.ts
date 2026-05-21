export const markAsRead = async (id: number, token: string) => {
  const res = await fetch(
    `http://localhost:8080/api/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to read the notification");
  }

  return;
};
