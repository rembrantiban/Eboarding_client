"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import {
  ArrowLeft,
  User,
  AtSign,
  Phone,
  MapPin,
  Mail,
  Lock,
  Loader2,
  Check,
  X as XIcon,
} from "lucide-react"

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const [modal, setModal] = useState<{
    type: "loading" | "success" | "error" | null;
    message?: string;
  }>({
    type: null,
  });

  const sanitize = (value: string) => {
    return value.trim().replace(/\s+/g, " ");
  };
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    contact_number: "",
    address: "",
    password: "",
    confirmPassword: "",
  })

  const validateForm = () => {
    const newErrors: Partial<typeof form> = {};

    if (!form.first_name) newErrors.first_name = "First name is required";
    if (!form.last_name) newErrors.last_name = "Last name is required";
    if (!form.username) newErrors.username = "Username is required";
    if (!form.address) newErrors.address = "Address is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.contact_number) {
      newErrors.contact_number = "Contact number is required";
    } else if (!/^\d{11}$/.test(form.contact_number)) {
      newErrors.contact_number = "Invalid contact number format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: sanitize(value),
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setModal({ type: "error", message: "Passwords do not match" });
      return;
    }

    try {
      setModal({ type: "loading" });

      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        username: form.username,
        contact_number: form.contact_number,
        address: form.address,
        password: form.password,
        user_type: "Boarder",
      });

      setModal({
        type: "success",
        message: "Account created successfully 🎉",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: unknown) {
      let message = "Something went wrong";

      if (typeof err === "string") {
        message = err;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const error = err as {
          response?: { data?: { message?: string } };
        };

        message =
          error.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setModal({
        type: "error",
        message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">

      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden bg-white">

        {/* LEFT PANEL */}
        <div className="hidden md:flex w-80 shrink-0 bg-slate-900 text-white p-10 flex-col justify-between">

          <div>
            <h2 className="text-2xl font-bold mb-4">E-boarding</h2>

            <p className="text-sm text-white/70 mb-6">
              Smart and simple boarding house management for everyone.
            </p>

            <p className="text-sm leading-relaxed text-white/50">
              E-Boarding is a computerized boarding house management system designed
              to streamline boarder records, room assignments, and payment tracking —
              all in one centralized platform for better efficiency and control.
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-lg border rounded-tr-2xl rounded-br-2xl p-10">

          <h1 className="text-xl font-semibold text-slate-900 mb-1">
            Create account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Sign up to get started
          </p>

          <form className="space-y-4 " onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="grid grid-cols-2 gap-3">
              <Field icon={User} error={errors.first_name}>
                <Input
                  name="first_name"
                  placeholder="First name"
                  onChange={handleChange}
                  className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
              </Field>

              <Field icon={User} error={errors.last_name}>
                <Input
                  name="last_name"
                  placeholder="Last name"
                  onChange={handleChange}
                  className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
              </Field>
            </div>

            {/* USERNAME */}
            <Field icon={AtSign} error={errors.username}>
              <Input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </Field>

            {/* CONTACT */}
            <Field icon={Phone} error={errors.contact_number}>
              <Input
                name="contact_number"
                placeholder="Contact number"
                onChange={handleChange}
                className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </Field>

            {/* ADDRESS */}
            <Field icon={MapPin} error={errors.address}>
              <Input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </Field>

            {/* EMAIL */}
            <Field icon={Mail} error={errors.email}>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </Field>

            {/* PASSWORD */}
            <Field icon={Lock} error={errors.password}>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </Field>

            {/* CONFIRM */}
            <Field icon={Lock} error={errors.confirmPassword}>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                onChange={handleChange}
                className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </Field>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-700 text-white rounded-lg py-2.5"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-slate-900 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* MODAL — logic unchanged */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-6 text-center space-y-4 shadow-xl">

            {modal.type === "loading" && (
              <>
                <Loader2 className="w-10 h-10 text-slate-400 animate-spin mx-auto" />
                <p className="text-slate-900 text-sm font-medium">
                  Creating your account...
                </p>
              </>
            )}

            {modal.type === "success" && (
              <>
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                  <Check className="text-emerald-600" size={22} />
                </div>
                <p className="text-slate-900 text-sm font-medium">{modal.message}</p>
              </>
            )}

            {modal.type === "error" && (
              <>
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <XIcon className="text-red-500" size={22} />
                </div>
                <p className="text-slate-900 text-sm font-medium">{modal.message}</p>

                <button
                  onClick={() => setModal({ type: null })}
                  className="text-sm text-slate-500 hover:text-slate-900 hover:underline"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  icon: Icon,
  error,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={`relative flex items-center rounded-lg bg-white border transition-colors ${
          error
            ? "border-red-300"
            : "border-slate-200 hover:border-slate-300 focus-within:border-slate-400"
        }`}
      >
        <Icon size={16} className="absolute left-3 text-slate-400" />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Register