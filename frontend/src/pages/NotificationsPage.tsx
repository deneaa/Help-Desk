import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Check, Loader2 } from "lucide-react";

import { useNotifications } from "../hooks/useNotifications";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";
import type { INotification } from "../types";
import { markAllRead, markAsRead } from "../services/notifications.service";

type NotificationTab = "ALL" | "UNREAD" | "READ";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const token = useAppSelector((state: RootState) => state.auth.token);

  const { notifications, setNotifications, loading, error } =
    useNotifications();

  const [tab, setTab] = useState<NotificationTab>("ALL");

  const { counts, filtered } = useMemo(() => {
    const all = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    const read = notifications.filter((n) => n.read).length;

    const filteredList = notifications.filter((n) => {
      if (tab === "UNREAD") return !n.read;
      if (tab === "READ") return n.read;
      return true;
    });

    return {
      counts: { all, unread, read },
      filtered: filteredList,
    };
  }, [notifications, tab]);

  const tabs: {
    key: NotificationTab;
    label: string;
    count: number;
  }[] = [
    { key: "ALL", label: "All", count: counts.all },
    { key: "UNREAD", label: "Unread", count: counts.unread },
    { key: "READ", label: "Read", count: counts.read },
  ];

  const handleReadOne = async (id: number) => {
    if (!token) return;

    await markAsRead(id, token);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleClick = async (n: INotification) => {
    if (!token) return;

    if (!n.read) {
      await handleReadOne(n.id);
    }

    if (n.redirectUrl) {
      navigate(n.redirectUrl);
    }
  };

  const handleMarkAll = async () => {
    if (!token) return;

    await markAllRead(token);

    const res = await fetch("http://localhost:8080/api/notifications/my", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setNotifications(data);
  };

  // ✅ EARLY RETURN DUPĂ HOOK-URI (corect)
  if (!token) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center px-6 py-10">
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-700" />
              Notifications
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Your updates, alerts and activity
            </p>
          </div>

          <button
            onClick={handleMarkAll}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                tab === t.key
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  tab === t.key
                    ? "bg-gray-100 text-gray-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* STATES */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading notifications...
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No notifications here
          </div>
        )}

        {/* LIST */}
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`group cursor-pointer bg-white border rounded-2xl p-4 flex items-start gap-3 transition hover:shadow-md ${
                n.read ? "border-gray-100" : "border-violet-200 bg-violet-50/30"
              }`}
            >
              <div className="mt-1">
                {n.read ? (
                  <Check className="w-5 h-5 text-gray-400" />
                ) : (
                  <Bell className="w-5 h-5 text-violet-500" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-xs text-gray-500 mt-1">{n.message}</p>
              </div>

              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadOne(n.id);
                  }}
                  className="text-xs text-violet-600 hover:text-violet-800 opacity-0 group-hover:opacity-100 transition"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
