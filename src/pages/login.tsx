"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import RulesModal from "@/components/modal/RulesModal"

const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading, user } = useAuth()
  const [openRules, setOpenRules] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const [modal, setModal] = useState<{
    type: "loading" | "success" | "error" | null;
    message?: string;
  }>({ type: null });

  const sanitize = (value: string) => value.trim().replace(/\s+/g, " ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: sanitize(value) });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.identifier) newErrors.identifier = "Email or username is required";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setModal({ type: "loading" });
      await login({ identifier: form.identifier, password: form.password });
      setModal({ type: "success", message: "Login successful 🎉" });
      setTimeout(() => {
        if (user?.user_type === "Boarder") navigate("/");
        else navigate("/dashboard");
      }, 1200);
    } catch (err: unknown) {
      let message = "Invalid credentials";
      if (typeof err === "string") {
        message = err;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const error = err as { response?: { data?: { message?: string } } };
        message = error.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setModal({ type: "error", message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── HEADER (unchanged) ── */}
      <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent select-none">
            <span className="text-black">E</span>-boarding
          </p>
          <div className="flex gap-3">
            <Button className="bg-black/80" onClick={() => navigate("/")}>Home</Button>
            <Button className="bg-blue-600 hover:bg-blue-500" onClick={() => navigate("/register")}>Register</Button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="flex flex-1 items-center justify-center px-4 relative overflow-hidden">

        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('./Background.jpg')" }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute w-100 h-100 bg-purple-500/20 blur-[120px] top-10 left-10" />
        <div className="absolute w-100 h-100 bg-blue-500/20 blur-[120px] bottom-10 right-10" />

        <div className="relative w-full max-w-sm z-10">

          <div className="h-0.5 w-full rounded-t-2xl bg-linear-to-r from-teal-500 via-blue-400 to-teal-500" />

          <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/10 border-t-0 rounded-b-2xl shadow-2xl px-8 pt-8 pb-7 space-y-7">

            {/* Brand mark */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black tracking-tighter bg-linear-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent select-none">
                <span className="text-white">E</span>-boarding
              </span>
              <p className="text-white/40 text-xs tracking-widest uppercase font-medium">Member Portal</p>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/10" />

            {/* Heading */}
            <div className="space-y-0.5">
              <h1 className="text-white text-xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-white/40 text-sm">Enter your credentials to continue</p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Identifier */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Email or Username
                </label>
                <div className={`
                  relative flex items-center rounded-lg
                  bg-white/6 border transition-colors
                  ${errors.identifier
                    ? "border-red-400/60"
                    : "border-white/10 hover:border-white/20 focus-within:border-purple-400/60"}
                `}>
                  {/* Icon */}
                  <svg className="absolute left-3 w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <Input
                    name="identifier"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-white placeholder:text-white/25 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-red-400 flex items-center gap-1 pl-0.5">
                    <span>⚠</span> {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Password
                  </label>
                  <span
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-blue-300/80 hover:text-blue-300 cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </span>
                </div>
                <div className={`
                  relative flex items-center rounded-lg
                  bg-white/6 border transition-colors
                  ${errors.password
                    ? "border-red-400/60"
                    : "border-white/10 hover:border-white/20 focus-within:border-purple-400/60"}
                `}>
                  <svg className="absolute left-3 w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-white placeholder:text-white/25 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 flex items-center gap-1 pl-0.5">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full py-2.5 rounded-sm text-sm font-semibold text-white
                    bg-linear-to-r from-teal-600 to-teal-600
                    hover:from-purple-500 hover:to-teal-500
                    active:scale-[0.98] transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg shadow-purple-900/30
                  "
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                </button>
              </div>
            </form>

            {/* Footer */}
            <p className="text-center text-white/30 text-xs pt-1">
              By signing in you agree to our{" "}
              <span
                onClick={() => setOpenRules(true)}
                className="text-blue-300/70 hover:text-blue-300 cursor-pointer transition-colors underline underline-offset-2"
              >
                Rules & Regulations
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── MODALS (unchanged) ── */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 text-center space-y-4 shadow-xl">
            {modal.type === "loading" && (
              <>
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white">Authenticating...</p>
              </>
            )}
            {modal.type === "success" && (
              <>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">✓</div>
                <p className="text-white">{modal.message}</p>
              </>
            )}
            {modal.type === "error" && (
              <>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">✕</div>
                <p className="text-white">{modal.message}</p>
                <button onClick={() => setModal({ type: null })} className="text-blue-400 text-sm hover:underline">
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <RulesModal open={openRules} onClose={() => setOpenRules(false)} />
    </div>
  )
}

export default Login