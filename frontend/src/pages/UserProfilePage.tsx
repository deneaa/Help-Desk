import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";
import { useProfile } from "../hooks/useProfile";
import { FullProfileView } from "../features/profilePage/views/FullProfileView";
import { PublicProfileView } from "../features/profilePage/views/PublicProfileView";

import type { UserFullDTO, UserPublicDTO } from "../types";

const UserProfilePage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const currentUser = useAppSelector((state: RootState) => state.auth.user);

  const userId = Number(id);

  const { stats, loading, error } = useProfile(userId);

  if (!currentUser || !id) return <p>Loading...</p>;
  if (loading) return <p>Loading...</p>;
  if (error || !stats) return <p>Error loading profile</p>;

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Go back</span>
      </button>

      {stats.accessLevel === "FULL" ? (
        <FullProfileView
          profile={stats.data as UserFullDTO}
          currentUser={currentUser}
          isSelf={currentUser.id === userId}
        />
      ) : (
        <PublicProfileView profile={stats.data as UserPublicDTO} />
      )}
    </div>
  );
};

export default UserProfilePage;
