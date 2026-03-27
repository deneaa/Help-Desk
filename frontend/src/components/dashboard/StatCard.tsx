type Props = {
  label: string;
  value: number;
  accent: string;
  sub: string;
};

export default function StatCard({ label, value, accent, sub }: Props) {
  return (
    <div
      className="bg-white border border-[#CECBF6] p-5"
      style={{ borderLeft: `3px solid ${accent}`, borderRadius: "0 14px 14px 0" }}
    >
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-medium text-[#26215C]">{value}</p>
      <p className="text-xs mt-1" style={{ color: accent }}>{sub}</p>
    </div>
  );
}