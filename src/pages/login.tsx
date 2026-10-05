"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import RulesModal from "@/components/modal/RulesModal"
import {
  Mail,
  Lock,
  Loader2,
  Check,
  X as XIcon,
  Eye,
  EyeOff,
} from "lucide-react"

const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [openRules, setOpenRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const loggedInUser = await login({ identifier: form.identifier, password: form.password });
      setModal({ type: "success", message: "Login successful 🎉" });

     console.log(loggedInUser);
      setTimeout(() => {
      const role = loggedInUser.user_type?.trim().toLowerCase();

      switch (role) {
        case "boarder":
          navigate("/boarder-dashboard");
          break;

        case "staff":
          navigate("/staff-dashboard");
          break;

        case "admin":
        case "administrator":
          navigate("/dashboard");
          break;

        default:
          navigate("/dashboard");
          break;
      }
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
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── HEADER ── */}
      <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xl font-bold tracking-tight text-slate-900 select-none">
            E-boarding
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              className="bg-slate-900 text-white hover:bg-slate-700"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 bg-slate-50">

        <div className="relative w-full max-w-sm">

          <div className="rounded-2xl bg-white p-8 space-y-7">

            {/* Brand mark */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900 select-none">
                E-boarding
              </span>
              <p className="text-slate-400 text-xs tracking-widest uppercase font-medium">Member Portal</p>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-slate-100" />

            {/* Heading */}
            <div className="space-y-0.5">
              <h1 className="text-slate-900 text-xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-slate-500 text-sm">Enter your credentials to continue</p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Identifier */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Email or Username
                </label>
                <div className={`
                  relative flex items-center rounded-lg
                  bg-white border transition-colors
                  ${errors.identifier
                    ? "border-red-300"
                    : "border-slate-200 hover:border-slate-300 focus-within:border-slate-400"}
                `}>
                  <Mail size={16} className="absolute left-3 text-slate-400" />
                  <Input
                    name="identifier"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-red-500 flex items-center gap-1 pl-0.5">
                    <span>⚠</span> {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Password
                </label>
                <div className={`
                  relative flex items-center rounded-lg
                  bg-white border transition-colors
                  ${errors.password
                    ? "border-red-300"
                    : "border-slate-200 hover:border-slate-300 focus-within:border-slate-400"}
                `}>
                  <Lock size={16} className="absolute left-3 text-slate-400" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="border-0 bg-transparent pl-9 pr-10 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <div className="flex items-start justify-between gap-3">
                  {errors.password && (
                    <p className="text-xs text-red-500 flex items-center gap-1 pl-0.5">
                      <span>⚠</span> {errors.password}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="ml-auto shrink-0 text-xs text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full py-2.5 rounded-lg text-sm font-semibold text-white
                    bg-slate-900
                    hover:bg-slate-700
                    active:scale-[0.98] transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                </button>
              </div>
            </form>

            {/* Footer */}
            <p className="text-center text-slate-400 text-xs pt-1">
              By signing in you agree to our{" "}
              <span
                onClick={() => setOpenRules(true)}
                className="text-slate-600 hover:text-slate-900 cursor-pointer transition-colors underline underline-offset-2"
              >
                Rules & Regulations
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white/15 border border-slate-100 rounded-2xl p-6 text-center space-y-4 shadow-xl">
            {modal.type === "loading" && (
              <>
                <Loader2 className="w-10 h-10 text-slate-900 animate-spin mx-auto" />
                <p className="text-slate-900 text-sm font-medium">Authenticating...</p>
              </>
            )}
            {modal.type === "success" && (
              <>
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="text-emerald-100" size={22} />
                </div>
                <p className="text-slate-900 text-sm font-medium">{modal.message}</p>
              </>
            )}
            {modal.type === "error" && (
              <>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                  <XIcon className="text-red-100" size={22} />
                </div>
                <p className="text-slate-900 text-sm font-medium">{modal.message}</p>
                <button onClick={() => setModal({ type: null })} className="text-slate-500 text-sm hover:text-slate-900 hover:underline">
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