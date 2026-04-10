const API = "http://localhost:8080/api/tickets";

export const getTicketDetails = async (id: number, token: string) => {
  const response = await fetch(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ticket");
  }

  return response.json();
};
