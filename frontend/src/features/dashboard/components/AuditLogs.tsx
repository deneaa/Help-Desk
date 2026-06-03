import { getInitials } from "../../../helpers/getInitials";
import type { IAuditLog } from "../../../types";

interface ILogs {
  logs: IAuditLog[];
}

function formatDate(raw: string): { primary: string; secondary: string } {
  const date = new Date(raw);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const fullDate = date.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (isToday) return { primary: `Today, ${time}`, secondary: fullDate };
  if (isYesterday)
    return { primary: `Yesterday, ${time}`, secondary: fullDate };
  return {
    primary: `${date.toLocaleDateString("ro-RO", { day: "numeric", month: "short" })}, ${time}`,
    secondary: fullDate,
  };
}

const AVATAR_COLORS = [
  { bg: "#EEEDFE", text: "#3C3489" },
  { bg: "#E1F5EE", text: "#085041" },
  { bg: "#FAECE7", text: "#712B13" },
  { bg: "#FAEEDA", text: "#633806" },
  { bg: "#E6F1FB", text: "#0C447C" },
];

function avatarColor(name: string) {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

const AuditLogs = ({ logs }: ILogs) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-gray-900 font-medium text-[15px]">
          Recent activity
        </h2>
        <p className="text-gray-500 text-sm">Latest system activity logs</p>
      </div>

      <div>
        {logs.map((log) => {
          const { primary, secondary } = formatDate(log.changedAt);
          const initials = getInitials(log.changedBy);
          const colors = avatarColor(log.changedBy);

          return (
            <div
              key={log.id}
              className="flex items-start gap-3 px-5 py-[14px] border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[14px] font-medium text-gray-900">
                    {log.changedBy}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                    {log.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {log.action} - {log.entityType} #{log.entityId}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-[13px] text-gray-700 whitespace-nowrap">
                  {primary}
                </p>
                <p className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">
                  {secondary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditLogs;
