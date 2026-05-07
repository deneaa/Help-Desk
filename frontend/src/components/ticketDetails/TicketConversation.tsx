import type { IComment } from "../../types/types";

interface Props {
  comments: IComment[];
}

export const TicketConversation = ({ comments }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-gray-900 mb-6">Conversation</h2>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first to reply.
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="border border-gray-100 rounded-xl p-4 bg-gray-50"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">
                  {c.author.name ?? "Unknown"}
                </span>

                <span className="text-gray-500">{c.createdAt}</span>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap">{c.content}</p>

              {c.isInternal && (
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                  Internal
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="text-gray-900 mb-4">Add Comment</h3>

        <form className="space-y-4">
          <textarea
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all bg-gray-50 resize-none"
            placeholder="Type your comment here..."
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all"
            >
              Send Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
