import { UserPlus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IForm {
  fullName: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

const initialForm: IForm = {
  fullName: "",
  email: "",
  password: "",
  confirmedPassword: "",
};

const SignupPage = () => {
  const [form, setForm] = useState<IForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isInvalid = useMemo(() => {
    return (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmedPassword ||
      form.password !== form.confirmedPassword
    );
  }, [form]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (isInvalid) {
        setError("Completează corect toate câmpurile");
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:8080/api/auth/signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.fullName,
              email: form.email,
              password: form.password,
            }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Eroare la înregistrare");
          return;
        }

        navigate("/signup-success");
      } catch {
        setError("Eroare de rețea. Încearcă din nou.");
      }
    },
    [form.fullName, form.email, form.password, isInvalid, navigate],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="w-full max-w-md mt-5">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900 mb-2">Ticket Management System</h1>
            <p className="text-gray-500">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
              required
            />

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

            <input
              name="confirmedPassword"
              type="password"
              value={form.confirmedPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl"
            >
              Sign Up
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-violet-600 font-medium"
              >
                Sign In
              </button>
            </p>
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

export default SignupPage;