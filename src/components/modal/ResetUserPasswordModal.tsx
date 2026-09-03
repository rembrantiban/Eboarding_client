"use client";

import {
  KeyRound,
  Eye,
  EyeOff,
  X,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  userEmail?: string;
  userAvatar?: string | null;
  onSuccess?: () => void;
};

type Strength = "Weak" | "Fair" | "Strong";

const CHARSET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";

const generatePassword = (length = 12) => {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }

  return result;
};

const getStrength = (password: string): Strength => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 4) return "Strong";
  if (score >= 2) return "Fair";
  return "Weak";
};

const STRENGTH_STYLE: Record<
  Strength,
  { bar: string; text: string; segments: number }
> = {
  Weak: { bar: "bg-red-500", text: "text-red-600", segments: 1 },
  Fair: { bar: "bg-amber-500", text: "text-amber-600", segments: 2 },
  Strong: { bar: "bg-emerald-500", text: "text-emerald-600", segments: 3 },
};

const ResetUserPasswordModal = ({
  open,
  onClose,
  userId,
  userName,
  userEmail,
  userAvatar,
  onSuccess,
}: Props) => {
  const { resetUserPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setCopied(false);
    setError("");
    setIsSubmitting(false);
  }, [open]);

  if (!open) return null;

  const strength = password ? getStrength(password) : null;

  const handleGenerate = () => {
    const generated = generatePassword();

    setPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);
    setShowConfirm(true);
    setCopied(false);
    setError("");
  };

  const handleCopy = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy to clipboard.");
    }
  };

  const handleSubmit = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await resetUserPassword(userId, password);
      onSuccess?.();
      onClose();
    } catch {
      // Global status modal already surfaces the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal */}
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <KeyRound size={16} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Reset Password
              </h2>
              <p className="text-xs text-slate-400">
                Set a new password for this account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          {/* User card */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[12px] font-semibold text-white">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-slate-900">
                {userName}
              </p>
              {userEmail && (
                <p className="truncate text-[11.5px] text-slate-400">
                  {userEmail}
                </p>
              )}
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">
                New Password
              </label>

              <button
                type="button"
                onClick={handleGenerate}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                <RefreshCw size={11.5} />
                Generate
              </button>
            </div>

            <div className="relative">
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                  setCopied(false);
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Enter a new password"
                className="h-10 w-full rounded-xl border border-slate-200 px-3 pr-19 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />

              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                {password && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {password && strength && (
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex flex-1 gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < STRENGTH_STYLE[strength].segments
                          ? STRENGTH_STYLE[strength].bar
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-[10.5px] font-medium ${STRENGTH_STYLE[strength].text}`}
                >
                  {strength}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Confirm Password
            </label>

            <div className="relative">
              <input
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter the new password"
                className="h-10 w-full rounded-xl border border-slate-200 px-3 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
              <TriangleAlert size={14} className="mt-0.5 shrink-0 text-red-500" />
              <p className="text-[12px] leading-snug text-red-600">{error}</p>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2.5">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-[12px] leading-snug text-blue-700">
              Copy this password now — the user will need it to log in and
              won&rsquo;t be notified automatically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !password || !confirmPassword}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetUserPasswordModal;
