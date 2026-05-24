import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import MyTicketsPage from "../pages/MyTicketsPage";
import CreateTicketPage from "../pages/CreateTicketPage";
import TicketDetailsPage from "../pages/TicketDetailsPage";
import StaffPage from "../pages/StaffPage";
import NotificationsPage from "../pages/NotificationsPage";
import ProfilePage from "../pages/ProfilePage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import SignupSuccessPage from "../pages/SignupSuccessPage";
import { requireAuth, requireGuest, requireRole } from "./loader";
import TicketsPage from "../pages/TicketsPage";
import TicketsCategoryPage from "../pages/TicketsCategoryPage";
import UserProfilePage from "../pages/UserProfilePage";
import SearchPage from "../pages/SearchPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    loader: requireGuest,
    element: <LoginPage />,
  },
  {
    path: "/signup",
    loader: requireGuest,
    element: <SignupPage />,
  },
  {
    path: "/signup-success",
    loader: requireGuest,
    element: <SignupSuccessPage />,
  },

  {
    loader: requireAuth,
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/staff", element: <StaffPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      {
        path: "/profile",
        element: <ProfilePage />,
      },

      {
        path: "/users/:id",
        element: <UserProfilePage />,
      },
      { path: "/tickets/category/:category", element: <TicketsCategoryPage /> },
      {
        path: "/tickets/my",
        loader: requireRole(["USER"]),
        element: <MyTicketsPage />,
      },
      {
        path: "/tickets/create",
        loader: requireRole(["USER"]),
        element: <CreateTicketPage />,
      },
      {
        path: "/tickets",
        loader: requireRole(["ADMIN", "AGENT"]),
        element: <TicketsPage />,
      },
      { path: "/tickets/:id", element: <TicketDetailsPage /> },

      { path: "/search", element: <SearchPage /> },
      {
        path: "/admin",
        loader: requireRole(["ADMIN", "AGENT"]),
        element: <AdminDashboardPage />,
      },
    ],
  },

  { path: "*", element: <Navigate to="/login" replace /> },
]);
