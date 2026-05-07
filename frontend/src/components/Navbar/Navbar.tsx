import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Inbox,
  Settings,
  Bell,
  User,
  LogOut,
} from "lucide-react";

type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string;
};

const links: NavItem[] = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/create-ticket", icon: Plus, label: "Create Ticket" },
  { path: "/my-tickets", icon: Inbox, label: "My Tickets" },
  { path: "/admin", icon: Settings, label: "Admin Panel" },
];

function NavbarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
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
}

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const pageTitle = links.find((l) => isActive(l.path))?.label ?? "Dashboard";

  return (
    <div className="flex h-screen bg-gray-50">
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
          {links.map((item) => (
            <NavbarLink
              key={item.path}
              item={item}
              active={isActive(item.path)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">{pageTitle}</h1>
              <p className="text-gray-500">
                Manage and track your support tickets
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-900">John Doe</p>
                  <p className="text-gray-500 text-sm">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
