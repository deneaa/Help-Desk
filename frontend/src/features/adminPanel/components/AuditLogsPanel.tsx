import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useLogs } from "../../../hooks/useLogs";
import AuditLogs from "../../dashboard/components/AuditLogs";
import type { AuditLogFilters } from "../../../hooks/useLogs";

const PAGE_SIZE = 20;

const AuditLogsPanel = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<AuditLogFilters>({});

  const { stats, loading, error } = useLogs(page, PAGE_SIZE, filters);

  const logs = stats?.content ?? [];
  const totalPages = stats?.totalPages ?? 0;
  console.log(filters);

  const updateFilter = (key: keyof AuditLogFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search user…"
              onChange={(e) => updateFilter("changedBy", e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <select
            onChange={(e) => updateFilter("entityType", e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All Entities</option>
            <option value="Ticket">Ticket</option>
            <option value="User">User</option>
            <option value="Comment">Comment</option>
            <option value="System">System</option>
          </select>

          <select
            onChange={(e) => updateFilter("type", e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All Types</option>
            <option value="INSERT">Insert</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>

          <input
            type="date"
            onChange={(e) => updateFilter("date", e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-10 text-center text-gray-400 text-sm">
          Loading logs…
        </div>
      )}
      {error && (
        <div className="bg-white rounded-2xl border border-red-100 px-5 py-10 text-center text-red-400 text-sm">
          {error}
        </div>
      )}
      {!loading && !error && <AuditLogs logs={logs} />}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3">
          <span className="text-sm text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPanel;
