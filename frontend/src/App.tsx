import { useEffect, useState } from "react";
import "./App.css";
import type IUser from "./interfaces/IUser.ts";

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: "USER" | "AGENT";
}

function App() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data: IUser[]) => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = () => {
    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        fetchUsers();
        setForm({ name: "", email: "", password: "", role: "USER" });
      });
  };

    return (
    <div>
      <h1>Users</h1>

      <div>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as 'USER' | 'AGENT' })}>
          <option value="USER">USER</option>
          <option value="AGENT">AGENT</option>
        </select>
        <button onClick={handleSubmit}>Adaugă user</button>
      </div>

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} — {user.email} — {user.role}</li>
        ))}
      </ul>
    </div>
  )

}

export default App;
