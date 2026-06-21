import { useState } from "react";
import type { IComment, Role } from "../../../types";
import { addComment } from "../../../services/comments.service";

interface Props {
  comments: IComment[];
  role: Role;
  ticketId: number;
  token: string;
  onCommentAdded: (comment: IComment) => void;
}

export const TicketConversation = ({
  comments,
  role,
  ticketId,
  token,
  onCommentAdded,
}: Props) => {
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStaff = role === "ADMIN" || role === "AGENT";

  const visibleComments = isStaff
    ? comments
    : comments.filter((c) => !c.internal);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSending(true);
    setError(null);
    try {
      const newComment = await addComment(
        { ticketId, content: content.trim(), internal: isInternal },
        token,
      );
      onCommentAdded(newComment);
      setContent("");
      setIsInternal(false);
    } catch {
      setError("Failed to send comment");
    } finally {
      setSending(false);
    }
  };

  console.log(comments);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-gray-900 mb-6">Conversation</h2>

      <div className="space-y-4">
        {visibleComments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first to reply.
          </p>
        ) : (
          visibleComments.map((c) => (
            <div
              key={c.id}
              className={`border rounded-xl p-4 ${
                c.internal
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">
                  {c.authorName}
                </span>
                <span className="text-gray-500">
                  {new Date(c.createdAt).toLocaleString("en-EN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap">{c.content}</p>

              {c.internal && (
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">
                  Internal
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="text-gray-900 mb-4">Add Comment</h3>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="space-y-3">
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all bg-gray-50 resize-none"
            placeholder="Type your comment here..."
          />

          <div className="flex items-center justify-between">
            {role !== "USER" && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="w-4 h-4 accent-yellow-500 rounded"
                />
                <span className="text-sm text-gray-600">Internal note</span>
              </label>
            )}

            {role !== "AGENT" && <div />}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={sending || !content.trim()}
              className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
