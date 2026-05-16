import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import GuestRoute from "./components/guards/GuestRoute";
import ProtectedRoute from "./components/guards/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SignupSuccessPage from "./pages/SignupSuccesPage";
import RoleRoute from "./components/guards/RoleRoute";
import StaffPage from "./pages/StaffPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import TicketsPage from "./pages/TicketsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup-success"
          element={
            <GuestRoute>
              <SignupSuccessPage />
            </GuestRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />

          <Route
            path="/tickets/my"
            element={
              <RoleRoute allowedRoles={["USER"]}>
                <MyTicketsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/tickets/create"
            element={
              <RoleRoute allowedRoles={["USER"]}>
                <CreateTicketPage />
              </RoleRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <RoleRoute allowedRoles={["ADMIN", "AGENT"]}>
                <TicketsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["ADMIN", "AGENT"]}>
                <AdminDashboardPage />
              </RoleRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
