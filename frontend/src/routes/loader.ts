import { redirect } from "react-router-dom";
import type { Role } from "../types/types";

type User = {
  id: number;
  email: string;
  role: Role;
};

function getUser(): User | null {
  const stored = localStorage.getItem("user") ?? sessionStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

function getToken(): string | null {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function requireGuest() {
  if (getToken()) throw redirect("/dashboard");
  return null;
}

export function requireAuth() {
  if (!getToken()) throw redirect("/login");
  return null;
}

export function requireRole(allowedRoles: Role[]) {
  return () => {
    requireAuth();
    const user = getUser();
    if (!user || !allowedRoles.includes(user.role))
      throw redirect("/dashboard");
    return null;
  };
}
