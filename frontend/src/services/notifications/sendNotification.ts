export const sendNotification = async (
  body: CreateBroadcastNotification,
  token: string,
) => {
  const res = await fetch(`http://localhost:8080/api/notifications/broadcast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to read the notification");
  }

  return;
};

export interface CreateBroadcastNotification {
  message: string;
}