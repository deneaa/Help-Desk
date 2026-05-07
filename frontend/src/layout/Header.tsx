import { User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../redux/store";

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/create-ticket": "Create Ticket",
  "/tickets/my": "My Tickets",
  "/admin": "Admin Panel",
};

export function Header() {
  const location = useLocation();

  const pageTitle = pageNames[location.pathname] ?? "Dashboard";

  const { name, role } = useAppSelector((root: RootState) => root.auth.user!);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{pageTitle}</h1>
          <p className="text-gray-500">Manage and track your support tickets</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>

            <div className="text-right">
              <p className="text-gray-900">{name}</p>
              <p className="text-gray-500 text-sm">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
