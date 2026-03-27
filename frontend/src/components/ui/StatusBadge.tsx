type Props = { status: string };

export default function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    OPEN: "bg-[#FAEEDA] text-[#633806]",
    IN_PROGRESS: "bg-[#EEEDFE] text-[#3C3489]",
    CLOSED: "bg-[#EAF3DE] text-[#27500A]",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
}
