import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupSuccessPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        Contul a fost creat cu succes!
      </h1>
      <p className="mb-6">Acum puteți să vă logați.</p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600"
      >
        Go to Login
      </button>
    </div>
  );
};

export default SignupSuccessPage
