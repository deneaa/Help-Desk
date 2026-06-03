import { Calendar, Shield } from "lucide-react";
import type { UserPublicDTO } from "../../../types";

type Props = {
  profile: UserPublicDTO;
};

export const PublicProfileView = ({ profile }: Props) => {
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

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-5">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
          <span className="text-white text-lg font-semibold">{initials}</span>
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {profile.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
            <Shield className="w-3.5 h-3.5" />
            {profile.role}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4 shrink-0" />
        <span>Joined</span>
        <span className="text-gray-900 font-medium">{formattedDate}</span>
      </div>
    </div>
  );
};
