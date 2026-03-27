type Props = { label: string; value: number };

export default function MiniCard({ label, value }: Props) {
  return (
    <div className="bg-[#EEEDFE] rounded-2xl p-4">
      <p className="text-xs text-[#534AB7] mb-1">{label}</p>
      <p className="text-2xl font-medium text-[#3C3489]">{value}</p>
    </div>
  );
}