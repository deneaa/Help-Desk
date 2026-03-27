type Props = {
  open: number;
  inProgress: number;
  closed: number;
};

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const height = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-xs font-medium" style={{ color }}>{value}</span>
      <div className="w-full bg-[#f5f4ff] rounded-t-md flex items-end" style={{ height: "80px" }}>
        <div className="w-full rounded-t-md transition-all" style={{ height: `${height}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

export default function BarChart({ open, inProgress, closed }: Props) {
  const max = Math.max(open, inProgress, closed, 1);
  return (
    <div className="bg-white rounded-2xl border border-[#CECBF6] p-6">
      <p className="text-xs font-medium text-[#534AB7] uppercase tracking-wider mb-4">Distribuție tickete</p>
      <div className="flex items-end gap-4 h-24">
        <Bar label="Open" value={open} max={max} color="#EF9F27" />
        <Bar label="In Progress" value={inProgress} max={max} color="#7F77DD" />
        <Bar label="Closed" value={closed} max={max} color="#1D9E75" />
      </div>
    </div>
  );
}