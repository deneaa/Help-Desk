import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, ChevronRight, Loader2 } from "lucide-react";

import { useStaff } from "../hooks/useStaff";
import { getInitials } from "../helpers/getInitials";

import type { UserPublicDTO } from "../types/types";
import { getAvatarGradient } from "../components/ui/getAvatarGradient";
import { getRoleColor } from "../components/ui/getRoleColor";

type Tab = "ADMIN" | "AGENT";

const StaffPage = () => {
  const navigate = useNavigate();
  const { stats, loading, error } = useStaff();
  const [tab, setTab] = useState<Tab>("ADMIN");

  const filtered: UserPublicDTO[] =
    tab === "ADMIN" ? (stats?.admins ?? []) : (stats?.agents ?? []);

  const count = {
    ADMIN: stats?.admins?.length ?? 0,
    AGENT: stats?.agents?.length ?? 0,
  };

  const tabConfig = [
    {
      key: "ADMIN" as const,
      label: "Admins",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      key: "AGENT" as const,
      label: "Agents",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Staff</h1>
        <p className="text-sm text-gray-400 mt-1">
          All administrators and support agents on this platform.
        </p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        {tabConfig.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {icon}
            {label}

            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600">
              {count[key]}
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading staff...</span>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-sm">No {tab.toLowerCase()}s found.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((user) => (
            <button
              key={user.id}
              onClick={() => navigate(`/users/${user.id}`)}
              className="w-full flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:border-gray-200 hover:shadow-sm transition-all text-left group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                  user.role,
                )} flex items-center justify-center`}
              >
                <span className="text-white text-sm font-semibold">
                  {getInitials(user.name)}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">
                  Joined {new Date(user.joinedAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full uppercase ${getRoleColor(
                  user.role,
                )}`}
              >
                {user.role}
              </span>

              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffPage;
