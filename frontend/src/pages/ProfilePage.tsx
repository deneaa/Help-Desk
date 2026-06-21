import { useMemo } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";
import { useProfile } from "../hooks/useProfile";
import { FullProfileView } from "../features/profilePage/views/FullProfileView";
import type { UserFullDTO } from "../types";

const ProfilePage = () => {
  const currentUser = useAppSelector((state: RootState) => state.auth.user);

  const userId = useMemo(() => currentUser?.id ?? 0, [currentUser?.id]);

  const { stats, loading, error } = useProfile(userId);

  const isValidFullAccess = useMemo(() => {
    return stats?.accessLevel === "FULL" && stats?.data;
  }, [stats]);

  const isSelf = true;

  if (!currentUser) return <p>Loading user...</p>;
  if (loading) return <p>Loading profile...</p>;
  if (error || !stats) return <p>Error loading profile</p>;
  if (!isValidFullAccess) return <p>Unexpected access level</p>;

  return (
    <FullProfileView
      profile={stats.data as UserFullDTO}
      currentUser={currentUser}
      isSelf={isSelf}
    />
  );
};

export default ProfilePage;
