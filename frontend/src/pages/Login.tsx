import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/reduxHooks";
import { login } from "../features/auth/authSlice";

interface IForm {
  email: string;
  password: string;
  beRemembered: boolean;
}

const initialForm: IForm = {
  email: "",
  password: "",
  beRemembered: false,
};

const Login = () => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<IForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email și parola sunt obligatorii");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ceva nu a mers bine");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          }),
        );
        dispatch(
          login({
            user: data,
            token: data.token,
          }),
        );

        console.log("Login reușit:", data);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Eroare de rețea. Încearcă din nou.");
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"></div>
            <h1 className="text-gray-900 mb-2">Ticket Management System</h1>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="checkbox"
                type="checkbox"
                checked={form.beRemembered}
                onChange={(e) => handleChange(e)}
                className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="remember" className="ml-2 text-gray-600">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-violet-600 hover:text-violet-700 transition-colors"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500">
          <p>Demo credentials: any email and password</p>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
