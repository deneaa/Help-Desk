// still working

import { LogOut } from "lucide-react";
import type { RootState } from "../redux/store";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const user = useAppSelector((state: RootState) => state.auth.user?.role);
  const name = useAppSelector((state: RootState) => state.auth.user?.name);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  
  return (
    <div className="mt-4 ml-5">
      <h1 className="flex items-center gap-3 text-xl font-semibold">
        Welcome {name} - {user}
        <button
          className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl 
             bg-red-500 text-white text-sm font-medium
             hover:bg-red-600 active:scale-95 transition-all shadow-md"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>{" "}
      </h1>
    </div>
  );
};

export default DashboardPage;

/*import type { RootState } from "../app/store";
import { useAppSelector } from "../hooks/reduxHooks";
import type { Priority, Status } from "../types/types";
import {
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const getStatusColor = (status: Status) => {
  switch (status) {
    case "OPEN":
      return "bg-orange-100 text-orange-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "CLOSED":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "LOW":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const DashboardPage = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <div>
      {user?.role === "AGENT" ? <h1>Welcome Admin</h1> : <h1>Welcome User</h1>}
      return (
      <div className="space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-gray-900 text-3xl">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-gray-900">Recent Activity</h2>
            <p className="text-gray-500 text-sm">
              Latest ticket updates and activities
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">{activity.title}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">{activity.user}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${getPriorityColor(activity.priority)}`}
                    >
                      {activity.priority}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(activity.status)}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-900 mb-4">Response Time</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Average</span>
                  <span className="text-gray-900">2.5 hours</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">First Response</span>
                  <span className="text-gray-900">45 min</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-900 mb-4">Resolution Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">This Week</span>
                  <span className="text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">This Month</span>
                  <span className="text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    </div>
  );
};

export default DashboardPage;

*/
