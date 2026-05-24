import { useState } from "react";
import {
  sendNotification,
  type CreateBroadcastNotification,
} from "../../../services/notifications/sendNotification";
import { useAppSelector } from "../../../hooks/reduxHooks";
import type { RootState } from "../../../redux/store";

const NotificationPanel = () => {
  const token = useAppSelector((state: RootState) => state.auth.token);

  const [form, setForm] = useState<CreateBroadcastNotification>({
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!token) return;
    if (!form.message.trim()) return;

    try {
      setSending(true);
      setError(null);

      await sendNotification(form, token);

      setSent(true);
      setForm({ message: "" });

      setTimeout(() => setSent(false), 2500);
    } catch (e) {
      console.log(e);
      setError("Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-900 font-medium mb-1">
          Create Global Announcement
        </h3>

        <p className="text-sm text-gray-400 mb-5">
          Sends a notification to{" "}
          <strong className="text-gray-600">every user</strong>.
        </p>

        <div className="space-y-4">
          <textarea
            value={form.message}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Announcement message…"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 outline-none resize-none"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleSend}
              disabled={sending || !form.message.trim()}
              className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send to All Users"}
            </button>

            {sent && (
              <span className="text-emerald-600 text-sm font-medium">
                ✓ Sent successfully
              </span>
            )}

            {error && <span className="text-red-500 text-sm">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
