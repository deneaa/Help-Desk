import { useState } from "react";
import { BarChart3, FileText, Megaphone, Users } from "lucide-react";
import { useAppSelector } from "../../../hooks/reduxHooks";
import type { RootState } from "../../../redux/store";
import AuditLogsPanel from "../components/AuditLogsPanel";
import NotificationPanel from "../components/NotificationPanel";
import UserManagementPanel from "../components/UserManagement";
import StatisticsPanel from "../components/StatisticsPanel";

const AdminPanel = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  const isAdmin = user!.role === "ADMIN";
  const [activeTab, setActiveTab] = useState("logs");
  if (!user) return null;

  const tabs = [
    { id: "logs", label: "Last Logs", icon: FileText },
    ...(isAdmin
      ? [{ id: "notifications", label: "Announcements", icon: Megaphone }]
      : []),
    { id: "users", label: "User Management", icon: Users },
    { id: "statistics", label: "Statistics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
        <div className="flex gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                activeTab === id
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "logs" && <AuditLogsPanel />}
      {activeTab === "notifications" && isAdmin && <NotificationPanel />}
      {activeTab === "users" && <UserManagementPanel />}
      {activeTab === "statistics" && <StatisticsPanel />}
    </div>
  );
};

export default AdminPanel;
