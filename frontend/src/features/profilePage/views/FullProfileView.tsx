import {
  Mail,
  Calendar,
  Pencil,
  TicketCheck,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import type { UserFullDTO, Role } from "../../../types/types";

type Props = {
  profile: UserFullDTO;
  currentUser: { id: number; role: Role };
  isSelf?: boolean;
};

export const FullProfileView = ({
  profile,
  currentUser,
  isSelf = false,
}: Props) => {
  const isAdmin = currentUser.role === "ADMIN";
  const canEdit = isSelf || isAdmin || profile.canEdit;

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = new Date(profile.joinedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const roleColor: Record<string, string> = {
    ADMIN: "bg-red-50 text-red-700 border border-red-200",
    AGENT: "bg-violet-50 text-violet-700 border border-violet-200",
    USER: "bg-gray-50 text-gray-600 border border-gray-200",
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-5">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-semibold">
                {initials}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold text-gray-900">
                  {profile.name}
                </h1>
                {isSelf && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">
                    You
                  </span>
                )}
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wide ${
                    roleColor[profile.role] ?? roleColor["USER"]
                  }`}
                >
                  {profile.role}
                </span>
              </div>

              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
                <Mail className="w-3.5 h-3.5" />
                {profile.email}
              </p>

              <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formattedDate}
              </p>
            </div>
          </div>

          {canEdit && (
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
              Edit profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <PlusCircle className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Created
            </span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {profile.ticketsCreated}
          </p>
          <p className="text-xs text-gray-400 mt-1">tickets</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TicketCheck className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Resolved
            </span>
          </div>
          <p className="text-3xl font-semibold text-violet-600">
            {profile.ticketsResolved}
          </p>
          <p className="text-xs text-gray-400 mt-1">tickets</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Role level
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {profile.role}
          </p>
        </div>
      </div>

      {isAdmin && !isSelf && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
            Admin actions
          </h2>
          <div className="flex gap-3 flex-wrap">
            {profile.role === "USER" && (
              <button className="px-4 py-2 text-sm rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                Promote to Agent
              </button>
            )}
            {profile.role === "AGENT" && (
              <button className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                Demote to User
              </button>
            )}
            <button className="px-4 py-2 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
              Delete account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
