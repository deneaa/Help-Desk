import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/reduxHooks";
import { login } from "../redux/slices/authSlice";
import { Lock } from "lucide-react";

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

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<IForm>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const isInvalid = useMemo(() => {
    return !form.email.trim() || !form.password.trim();
  }, [form.email, form.password]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (isInvalid) {
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
          return;
        }

        const storage = form.beRemembered ? localStorage : sessionStorage;

        storage.setItem("token", data.token);
        storage.setItem(
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
            user: {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
            },
            token: data.token,
          }),
        );

        navigate("/dashboard");
      } catch {
        setError("Eroare de rețea. Încearcă din nou.");
      }
    },
    [form, isInvalid, dispatch, navigate],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900 mb-2">Ticket Management System</h1>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
              required
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
              required
            />

            <div className="flex items-center">
              <input
                name="beRemembered"
                type="checkbox"
                checked={form.beRemembered}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="ml-2 text-gray-600">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl"
            >
              Sign In
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/signup")}
              className="text-violet-600 font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoginPage;
