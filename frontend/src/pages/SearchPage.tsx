import { UserSearch } from "../features/search/UserSearch";

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Search</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Find users, tickets, and more.
          </p>
        </div>

        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Users
          </h2>
          <UserSearch fullPage placeholder="Search users by name" />
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
