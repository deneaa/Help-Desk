import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";
import { useProfile } from "../hooks/useProfile";
import { FullProfileView } from "../features/profilePage/views/FullProfileView";
import type { UserFullDTO } from "../types/types";

const ProfilePage = () => {
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const { stats, loading, error } = useProfile(Number(currentUser?.id));

  if (!currentUser) return <p>Loading user...</p>;
  if (loading) return <p>Loading profile...</p>;
  if (error || !stats) return <p>Error loading profile</p>;

  if (stats.accessLevel !== "FULL") return <p>Unexpected access level</p>;

  return (
    <FullProfileView
      profile={stats.data as UserFullDTO}
      currentUser={currentUser}
      isSelf
    />
  );
};

export default ProfilePage;
