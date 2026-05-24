import AdminPanel from "../features/adminPanel/views/AdminPanel";

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage users, view logs, and monitor agent performance.
          </p>
        </div>
        <AdminPanel />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
