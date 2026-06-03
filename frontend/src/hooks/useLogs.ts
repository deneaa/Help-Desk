import { useEffect, useState } from "react";
import type { IAuditLog } from "../types";
import { useAppSelector } from "./reduxHooks";
import type { RootState } from "../redux/store";

export type AuditLogsPageResponse = {
  content: IAuditLog[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};

export interface AuditLogFilters {
  changedBy?: string;
  entityType?: string;
  type?: string;
  date?: string; // "YYYY-MM-DD"
}

const getAuditLogs = async (
  token: string,
  page: number,
  size: number,
  filters: AuditLogFilters,
): Promise<AuditLogsPageResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (filters.changedBy) params.set("changedBy", filters.changedBy);
  if (filters.entityType) params.set("entityType", filters.entityType);
  if (filters.type) params.set("type", filters.type);
  if (filters.date) params.set("date", filters.date);

  const res = await fetch(
    `http://localhost:8080/api/audit-logs?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export const useLogs = (
  page: number,
  size: number,
  filters: AuditLogFilters = {},
) => {
  const [stats, setStats] = useState<AuditLogsPageResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAuditLogs(token, page, size, filters);
        setStats(data);
      } catch {
        setError("Failed to load logs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    token,
    page,
    size,
    filters.changedBy,
    filters.entityType,
    filters.type,
    filters.date,
  ]);

  return { stats, loading, error };
};
