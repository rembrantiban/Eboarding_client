import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const { resetPassword, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    try {
      await resetPassword({
        email,
        code,
        newPassword: password,
      });

      setSuccess("Password reset successful!");

      // ⏳ redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: unknown) {
      const message =
        typeof err === "string"
          ? err
          : "Invalid code or error";

      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* Back */}
        <Button
          className="border-none mb-2"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Logo */}
        <h2 className="text-2xl font-bold text-center mb-2">
          E-<span className="bg-linear-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">boarding</span>
        </h2>

        <p className="text-sm font-semibold text-gray-800 text-center">
          Reset Password
        </p>
        <p className="text-sm text-gray-500 text-center mt-1">
          Enter your code and new password
        </p>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 text-sm text-green-600 bg-green-100 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
          />

          <input
            type="text"
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-800 text-white"
            }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default ResetPassword;