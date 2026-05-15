import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    try {
      await forgotPassword({ email });

      setSuccess("Reset code sent to your email");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);

    } catch (err: unknown) {
      const message =
        typeof err === "string"
          ? err
          : "Failed to send reset code";

      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* Back Button */}
        <Button
          className="border-none mb-2"
          variant="outline"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Logo */}
        <h2 className="text-2xl font-bold text-center  mb-2">
          E-<span className="bg-linear-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">boarding</span>
        </h2>

        {/* Title */}
        <p className="text-sm font-semibold text-gray-800 text-center">
          Forgot Password
        </p>
        <p className="text-sm text-gray-500 text-center mt-1">
          Enter your email to receive a reset code
        </p>

        {/* Alerts */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-800 text-white"
            }`}
          >
            {isLoading ? "Sending..." : "Send Code"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-teal-600 hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;