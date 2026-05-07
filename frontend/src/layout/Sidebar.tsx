import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, Inbox, Settings, LogOut } from "lucide-react";

type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string;
};

const links: NavItem[] = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/create-ticket", icon: Plus, label: "Create Ticket" },
  { path: "/tickets/my", icon: Inbox, label: "My Tickets" },
  { path: "/admin", icon: Settings, label: "Admin Panel" },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* BRAND */}
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

      {/* LINKS */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((item) => {
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

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
