import { UserSearch } from "../../search/UserSearch";

const UserManagementPanel = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-gray-900 font-medium">User Management</h3>
        <p className="text-sm text-gray-400 mt-0.5">
          Search for a user and click to open their profile
        </p>
      </div>
      <UserSearch placeholder="Search by name or email…" />
    </div>
  );
};

export default UserManagementPanel;
