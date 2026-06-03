export interface IComment {
  id: number;
  content: string;
  internal: boolean;
  createdAt: string;
  authorId: number;
  authorName: string;
  ticketId: number;
}
