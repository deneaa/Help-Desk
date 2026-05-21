import { useParams } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";
import { useProfile } from "../hooks/useProfile";
import { FullProfileView } from "../features/profilePage/views/FullProfileView";
import { PublicProfileView } from "../features/profilePage/views/PublicProfileView";
import type { UserFullDTO, UserPublicDTO } from "../types/types";

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAppSelector((state: RootState) => state.auth.user);

  const userId = Number(id);
  const { stats, loading, error } = useProfile(userId);

  if (!currentUser || !id) return <p>Loading...</p>;
  if (loading) return <p>Loading...</p>;
  if (error || !stats) return <p>Error loading profile</p>;

  if (stats.accessLevel === "FULL") {
    return (
      <FullProfileView
        profile={stats.data as UserFullDTO}
        currentUser={currentUser}
        isSelf={currentUser.id === userId}
      />
    );
  }

  return <PublicProfileView profile={stats.data as UserPublicDTO} />;
};

export default UserProfilePage;
