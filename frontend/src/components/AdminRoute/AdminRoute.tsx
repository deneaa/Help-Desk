import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

type AdminRouteProps = {
  children: ReactNode;
};

type User = {
  id: number;
  email: string;
  role: string;
};

function AdminRoute({ children }: AdminRouteProps) {
  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "AGENT") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
