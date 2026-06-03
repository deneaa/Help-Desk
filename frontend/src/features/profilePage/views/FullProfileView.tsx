import {
  Mail,
  Calendar,
  Pencil,
  TicketCheck,
  PlusCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserFullDTO, Role } from "../../../types";
import { promoteUser } from "../../../services/users/promoteUser";
import { demoteUser } from "../../../services/users/demoteUser";
import { deleteUser } from "../../../services/users/deleteUser";
import { updateUser } from "../../../services/users/updateUser";
import { useAppSelector } from "../../../hooks/reduxHooks";
import type { RootState } from "../../../redux/store";

type Props = {
  profile: UserFullDTO;
  currentUser: { id: number; role: Role };
  isSelf?: boolean;
};

interface EditForm {
  name: string;
  email: string;
}

const EditProfileModal = ({
  profile,
  token,
  onClose,
  onSaved,
}: {
  profile: UserFullDTO;
  token: string;
  onClose: () => void;
  onSaved: (name: string, email: string) => void;
}) => {
  const [form, setForm] = useState<EditForm>({
    name: profile.name,
    email: profile.email,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim()) { setError("Name cannot be empty"); return; }
    if (!form.email.trim()) { setError("Email cannot be empty"); return; }

    setLoading(true);
    try {
      await updateUser(profile.id, { name: form.name, email: form.email }, token);
      onSaved(form.name, form.email);
      onClose();
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Edit profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const FullProfileView = ({
  profile,
  currentUser,
  isSelf = false,
}: Props) => {
  const token = useAppSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const isAdmin = currentUser.role === "ADMIN";
  const canEdit = isSelf || isAdmin || profile.canEdit;

  const [role, setRole] = useState<string>(profile.role);
  const [displayName, setDisplayName] = useState(profile.name);
  const [displayEmail, setDisplayEmail] = useState(profile.email);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const initials = displayName
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

  const handlePromote = async () => {
    if (!token) return;
    setLoading("promote");
    setError(null);
    try {
      await promoteUser(profile.id, token);
      setRole("AGENT");
    } catch {
      setError("Failed to promote user");
    } finally {
      setLoading(null);
    }
  };

  const handleDemote = async () => {
    if (!token) return;
    setLoading("demote");
    setError(null);
    try {
      await demoteUser(profile.id, token);
      setRole("USER");
    } catch {
      setError("Failed to demote user");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete ${displayName}'s account?`)) return;
    setLoading("delete");
    setError(null);
    try {
      await deleteUser(profile.id, token);
      navigate("/admin");
    } catch {
      setError("Failed to delete user");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-semibold">{initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold text-gray-900">{displayName}</h1>
                {isSelf && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">
                    You
                  </span>
                )}
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wide ${roleColor[role] ?? roleColor["USER"]}`}
                >
                  {role}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
                <Mail className="w-3.5 h-3.5" />
                {displayEmail}
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formattedDate}
              </p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
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
            <span className="text-xs text-gray-400 uppercase tracking-wide">Created</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{profile.ticketsCreated}</p>
          <p className="text-xs text-gray-400 mt-1">tickets</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TicketCheck className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Resolved</span>
          </div>
          <p className="text-3xl font-semibold text-violet-600">{profile.ticketsResolved}</p>
          <p className="text-xs text-gray-400 mt-1">tickets</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Role level</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">{role}</p>
        </div>
      </div>

      {isAdmin && !isSelf && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
            Admin actions
          </h2>
          <div className="flex gap-3 flex-wrap">
            {role === "USER" && (
              <button
                onClick={handlePromote}
                disabled={loading === "promote"}
                className="px-4 py-2 text-sm rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                {loading === "promote" ? "Promoting..." : "Promote to Agent"}
              </button>
            )}
            {role === "AGENT" && (
              <button
                onClick={handleDemote}
                disabled={loading === "demote"}
                className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading === "demote" ? "Demoting..." : "Demote to User"}
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={loading === "delete"}
              className="px-4 py-2 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {loading === "delete" ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>
      )}

      {isEditOpen && token && (
        <EditProfileModal
          profile={{ ...profile, name: displayName, email: displayEmail }}
          token={token}
          onClose={() => setIsEditOpen(false)}
          onSaved={(name, email) => {
            setDisplayName(name);
            setDisplayEmail(email);
          }}
        />
      )}
    </div>
  );
};