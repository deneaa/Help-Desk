import {
  LayoutDashboard,
  Ticket,
  Plus,
  Users,
  Bell,
  User,
  Settings,
  type LucideIcon,
  Search,
} from "lucide-react";
import type { Role } from "../types/types";

export type NavItem = {
  path: string;
  icon: LucideIcon;
  label: string;
  roles: Role[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    path: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: ["ADMIN", "AGENT", "USER"],
  },
  {
    path: "/tickets",
    icon: Ticket,
    label: "Tickets",
    roles: ["ADMIN", "AGENT"],
  },
  {
    path: "/tickets/create",
    icon: Plus,
    label: "Create Ticket",
    roles: ["USER"],
  },
  {
    path: "/tickets/my",
    icon: Ticket,
    label: "My Tickets",
    roles: ["USER"],
  },
  {
    path: "/search",
    icon: Search,
    label: "Search",
    roles: ["ADMIN", "AGENT", "USER"],
  },
  {
    path: "/staff",
    icon: Users,
    label: "Staff",
    roles: ["ADMIN", "AGENT", "USER"],
  },
  {
    path: "/notifications",
    icon: Bell,
    label: "Notifications",
    roles: ["ADMIN", "AGENT", "USER"],
  },
  {
    path: "/profile",
    icon: User,
    label: "My Profile",
    roles: ["ADMIN", "AGENT", "USER"],
  },
  {
    path: "/admin",
    icon: Settings,
    label: "Admin Panel",
    roles: ["ADMIN", "AGENT"],
  },
];
