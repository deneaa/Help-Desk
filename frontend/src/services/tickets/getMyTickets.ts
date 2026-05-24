import type { ITicket } from "../../types/types";

interface PageResponse {
  content: ITicket[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export const getMyTickets = async (
  token: string,
  page: number = 0,
): Promise<PageResponse> => {
  const res = await fetch(
    `http://localhost:8080/api/tickets/my?page=${page}&size=10`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
};
