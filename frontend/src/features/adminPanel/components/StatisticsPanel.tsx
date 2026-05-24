import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useAppSelector } from "../../../hooks/reduxHooks";
import type { RootState } from "../../../redux/store";

type SortField = "weekTickets" | "monthTickets" | "allTimeTickets";
type SortDir = "asc" | "desc";

type StaffStats = {
  userId: number;
  name: string;
  weekTickets: number;
  monthTickets: number;
  allTimeTickets: number;
};

const API = "http://localhost:8080";

const StatisticsPanel = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const token = useAppSelector((state: RootState) => state.auth.token);

  const isAdmin = user?.role === "ADMIN";

  const [data, setData] = useState<StaffStats[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortField, setSortField] = useState<SortField>("allTimeTickets");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const url = isAdmin
          ? `${API}/api/analytics/staff-stats`
          : `${API}/api/analytics/staff-stats/my`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setData([]);
          return;
        }

        const json = await res.json();

        setData(Array.isArray(json) ? json : [json]);
      } catch (e) {
        console.error(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, token]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return [...data].sort((a, b) =>
      sortDir === "desc"
        ? b[sortField] - a[sortField]
        : a[sortField] - b[sortField],
    );
  }, [data, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />;

    return sortDir === "desc" ? (
      <ArrowDown className="w-3.5 h-3.5 text-violet-500" />
    ) : (
      <ArrowUp className="w-3.5 h-3.5 text-violet-500" />
    );
  };

  const rows = [
    { label: "Tickets solved this Week", field: "weekTickets" as SortField },
    { label: "Tickets solved this Month", field: "monthTickets" as SortField },
    { label: "Tickets solved all Time", field: "allTimeTickets" as SortField },
  ];

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900 font-medium">
          {isAdmin ? "All Agent Statistics" : "Your Statistics"}
        </h3>

        {isAdmin && (
          <div className="flex gap-2">
            {rows.map(({ label, field }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-3 py-1.5 rounded-lg text-sm border ${
                  sortField === field
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {label} <SortIcon field={field} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sorted.map((agent) => (
          <div
            key={agent.userId}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center text-white font-bold">
                {agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div>
                <h4 className="font-medium text-gray-900">{agent.name}</h4>
                <span className="text-sm text-gray-400">Agent</span>
              </div>
            </div>

            <div className="space-y-3">
              {rows.map(({ label, field }) => (
                <div
                  key={field}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="font-semibold">{agent[field]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPanel;
