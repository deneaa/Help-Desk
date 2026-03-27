import type { IUser } from "../../types/types";
import RoleBadge from "../ui/RoleBadge";

type Props = { users: IUser[] };

export default function UsersTable({ users }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#CECBF6] p-6 md:col-span-2">
      <p className="text-xs font-medium text-[#534AB7] uppercase tracking-wider mb-4">Utilizatori</p>
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-[#EEEDFE]">
            <th className="text-xs text-gray-400 font-normal pb-2">Nume</th>
            <th className="text-xs text-gray-400 font-normal pb-2">Email</th>
            <th className="text-xs text-gray-400 font-normal pb-2">Rol</th>
            <th className="text-xs text-gray-400 font-normal pb-2">Creat la</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-[#f5f4ff] hover:bg-[#f5f4ff] transition-colors">
              <td className="py-2 text-sm text-[#26215C] font-medium">{u.name}</td>
              <td className="py-2 text-sm text-gray-400">{u.email}</td>
              <td className="py-2"><RoleBadge role={u.role} /></td>
              <td className="py-2 text-sm text-gray-400">
                {new Date(u.createdAt).toLocaleDateString("ro-RO")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}