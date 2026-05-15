"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"

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
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">

      <div className="w-full max-w-6xl flex  overflow-hidden shadow-2xl">

        {/* 🔷 LEFT PANEL */}
        <div className="hidden md:flex w-md bg-teal-700 text-white p-10 flex-col justify-between relative bg-cover bg-center"
          style={{
            backgroundImage: "url('/Background.jpg')"
          }}
        >
          <div className="absolute inset-0  bg-linear-to-br from-teal-900/90 via-teal-900/90 to-black/70" />

          <div>
            <h2 className="text-3xl font-bold mb-4 z-10 relative">🏠 E-<span className="text-blue-500">Boarding</span></h2>

            <p className="text-sm opacity-90 mb-6">
              Smart and simple boarding house management for everyone.
            </p>

            <p className="text-sm leading-relaxed opacity-80">
              E-Boarding is a computerized boarding house management system designed
              to streamline tenant records, room assignments, and payment tracking —
              all in one centralized platform for better efficiency and control.
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="relative z-10 flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:text-green-50"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* 🔷 RIGHT PANEL */}
        <div className="w-full md:w-1/2 bg-white p-10">

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign up to get started
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  name="first_name"
                  placeholder="First name"
                  onChange={handleChange}
                  className={`bg-gray-100 border ${errors.first_name ? "border-red-400" : "border-gray-300"
                    }`}
                />
                {errors.first_name && (
                  <p className="text-xs text-red-500">{errors.first_name}</p>
                )}
              </div>

              <div>
                <Input
                  name="last_name"
                  placeholder="Last name"
                  onChange={handleChange}
                  className={`bg-gray-100 border ${errors.last_name ? "border-red-400" : "border-gray-300"
                    }`}
                />
                {errors.last_name && (
                  <p className="text-xs text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* USERNAME */}
            <div>
              <Input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className={`bg-gray-100 border ${errors.username ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* CONTACT */}
            <div>
              <Input
                name="contact_number"
                placeholder="Contact number"
                onChange={handleChange}
                className={`bg-gray-100 border ${errors.contact_number ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {errors.contact_number && (
                <p className="text-xs text-red-500">
                  {errors.contact_number}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <Input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className={`bg-gray-100 border ${errors.address ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className={`bg-gray-100 border ${errors.email ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className={`bg-gray-100 border ${errors.password ? "border-red-400" : "border-gray-300"
                  }`}
              />
            </div>

            {/* CONFIRM */}
            <div>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                onChange={handleChange}
                className={`bg-gray-100 border ${errors.confirmPassword
                    ? "border-red-400"
                    : "border-gray-300"
                  }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full bg-teal-700 hover:bg-teal-800 text-white"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-teal-700 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* KEEP YOUR MODAL EXACTLY AS IS */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 text-center space-y-4 shadow-xl">

            {modal.type === "loading" && (
              <>
                <div className="flex justify-center">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-white font-medium">
                  Creating your account...
                </p>
              </>
            )}

            {modal.type === "success" && (
              <>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    ✓
                  </div>
                </div>
                <p className="text-white font-semibold">{modal.message}</p>
              </>
            )}

            {modal.type === "error" && (
              <>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                    ✕
                  </div>
                </div>
                <p className="text-white font-semibold">{modal.message}</p>

                <button
                  onClick={() => setModal({ type: null })}
                  className="text-sm text-blue-400 hover:underline"
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

export default Register