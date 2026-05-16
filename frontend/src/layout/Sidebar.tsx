import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Inbox, LogOut } from "lucide-react";
import { logout } from "../redux/slices/authSlice";
import { NAV_ITEMS } from "../config/navigation";
import type { Role } from "../types/types";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stored = localStorage.getItem("user") ?? sessionStorage.getItem("user");
  const user: { role: Role } | null = stored ? JSON.parse(stored) : null;
  const role = user?.role ?? "USER";

  const visibleLinks = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Inbox className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Ticket System</h2>
            <p className="text-gray-500 text-sm">Help Desk</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {visibleLinks.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
