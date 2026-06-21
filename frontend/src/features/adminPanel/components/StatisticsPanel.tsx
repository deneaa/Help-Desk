import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useAppSelector } from "../../../hooks/reduxHooks";
import type { RootState } from "../../../redux/store";
import {
  getMyStaffStats,
  getStaffStats,
} from "../../../services/analytics.service";
import type { StaffStats } from "../../../types";

type SortField = keyof Pick<
  StaffStats,
  "weekTickets" | "monthTickets" | "allTimeTickets"
>;

type SortDir = "asc" | "desc";

const rows: { label: string; field: SortField }[] = [
  { label: "This Week", field: "weekTickets" },
  { label: "This Month", field: "monthTickets" },
  { label: "All Time", field: "allTimeTickets" },
];

export default function StatisticsPanel() {
  const { user, token } = useAppSelector((s: RootState) => s.auth);
  const isAdmin = user?.role === "ADMIN";

  const [data, setData] = useState<StaffStats[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortField, setSortField] = useState<SortField>("allTimeTickets");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    if (!token) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const res = isAdmin
          ? await getStaffStats(token)
          : await getMyStaffStats(token);

        if (!mounted) return;

        const normalized = Array.isArray(res) ? res : [res];
        setData(normalized);
      } catch (err) {
        console.error(err);
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [token, isAdmin]);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) =>
      sortDir === "desc"
        ? b[sortField] - a[sortField]
        : a[sortField] - b[sortField],
    );
  }, [data, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "desc" ? "asc" : "desc"));
        return prev;
      }
      setSortDir("desc");
      return field;
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />;

    return sortDir === "desc" ? (
      <ArrowDown className="w-3.5 h-3.5 text-violet-500" />
    ) : (
      <ArrowUp className="w-3.5 h-3.5 text-violet-500" />
    );
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">
          {isAdmin ? "All Agents" : "My Stats"}
        </h3>

        {isAdmin && (
          <div className="flex gap-2">
            {rows.map(({ label, field }) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                  sortField === field
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {label}
                <SortIcon field={field} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sorted.map((agent) => (
          <div
            key={agent.userId}
            className="bg-white border border-gray-100 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-500 text-white rounded-xl flex items-center justify-center font-bold">
                {agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div>
                <h4 className="text-gray-900 font-medium">{agent.name}</h4>
                <span className="text-gray-400 text-sm">Agent</span>
              </div>
            </div>

            <div className="space-y-3">
              {rows.map(({ label, field }) => (
                <div
                  key={field}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="font-semibold">{agent[field]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
