import type { ReactNode } from "react";
import type { Role } from "../../types/types";
import { Navigate } from "react-router";

type Props = {
  children: ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
};
const RoleRoute = ({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
}: Props) => {
  const stored = localStorage.getItem("user") ?? sessionStorage.getItem("user");
  const user: { role: Role } | null = stored ? JSON.parse(stored) : null;

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
};

export default RoleRoute;
