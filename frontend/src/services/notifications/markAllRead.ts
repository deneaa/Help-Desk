export const markAllRead = async (token: string) => {
  const res = await fetch(`http://localhost:8080/api/notifications/read-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed mark all read");
  }

  return;
};
