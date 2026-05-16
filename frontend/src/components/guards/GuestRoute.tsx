import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
