type Props = { role: string };

export default function RoleBadge({ role }: Props) {
  const styles: Record<string, string> = {
    USER: "bg-[#F1EFE8] text-[#444441]",
    AGENT: "bg-[#EEEDFE] text-[#3C3489]",
    ADMIN: "bg-[#FCEBEB] text-[#791F1F]",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[role] ?? "bg-gray-100 text-gray-500"}`}
    >
      {role}
    </span>
  );
}
