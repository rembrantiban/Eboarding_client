"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useRef, useState } from "react"
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
  Calendar,
  UserPlus,
  ShieldCheck,
  ImagePlus,
} from "lucide-react"

const MAX_FILE_MB = 5;
const TOTAL_STEPS = 3;
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,20}$/;
const PHONE_REGEX = /^(09|\+639)\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RELATIONSHIP_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,30}$/;

const STEP_TITLES = [
  { title: "Personal information", subtitle: "Tell us a bit about yourself" },
  { title: "Account details", subtitle: "Set up your login and contact info" },
  { title: "Additional details", subtitle: "Optional — you can skip this" },
];

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  contact_number: string;
  address: string;
  password: string;
  confirmPassword: string;
  gender: string;
  age: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  emergency_contact_relationship: string;
  valid_id_type: string;
};

const STEP_FIELDS: Record<number, (keyof FormState)[]> = {
  1: ["first_name", "last_name", "age", "gender"],
  2: ["username", "contact_number", "email", "address", "password", "confirmPassword"],
  3: ["emergency_contact_name", "emergency_contact_number", "emergency_contact_relationship", "valid_id_type"],
};

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    contact_number: "",
    address: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    emergency_contact_relationship: "",
    valid_id_type: "",
  })

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [validId, setValidId] = useState<File | null>(null);
  const [validIdPreview, setValidIdPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>> & { avatar?: string; valid_id_image?: string }>({});

  const [modal, setModal] = useState<{
    type: "loading" | "success" | "error" | null;
    message?: string;
  }>({
    type: null,
  });

  const sanitize = (value: string) => value.trim().replace(/\s+/g, " ");

  const validateFile = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return "Use a JPG, PNG, or WEBP file";
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return `Max file size is ${MAX_FILE_MB}MB`;
    }
    return "";
  };

  const validateAll = () => {
    const newErrors: Partial<Record<keyof FormState, string>> & { avatar?: string; valid_id_image?: string } = {};

    if (!form.first_name) {
      newErrors.first_name = "First name is required";
    } else if (!NAME_REGEX.test(form.first_name)) {
      newErrors.first_name = "Use letters only";
    }

    if (!form.last_name) {
      newErrors.last_name = "Last name is required";
    } else if (!NAME_REGEX.test(form.last_name)) {
      newErrors.last_name = "Use letters only";
    }

    if (!form.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!form.age) {
      newErrors.age = "Age is required";
    } else if (Number(form.age) < 1 || Number(form.age) > 120) {
      newErrors.age = "Enter a valid age";
    }

    if (!form.username) {
      newErrors.username = "Username is required";
    } else if (!USERNAME_REGEX.test(form.username)) {
      newErrors.username = "Use 3–20 letters, numbers, dot, dash, or underscore";
    }

    if (!form.address) {
      newErrors.address = "Address is required";
    } else if (form.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.contact_number) {
      newErrors.contact_number = "Contact number is required";
    } else if (!PHONE_REGEX.test(form.contact_number)) {
      newErrors.contact_number = "Use a valid phone number like 09171234567";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.emergency_contact_name) {
      newErrors.emergency_contact_name = "Emergency contact name is required";
    } else if (!NAME_REGEX.test(form.emergency_contact_name)) {
      newErrors.emergency_contact_name = "Use letters only";
    }

    if (!form.emergency_contact_number) {
      newErrors.emergency_contact_number = "Emergency contact number is required";
    } else if (!PHONE_REGEX.test(form.emergency_contact_number)) {
      newErrors.emergency_contact_number = "Use a valid phone number like 09171234567";
    }

    if (!form.emergency_contact_relationship) {
      newErrors.emergency_contact_relationship = "Relationship is required";
    } else if (!RELATIONSHIP_REGEX.test(form.emergency_contact_relationship)) {
      newErrors.emergency_contact_relationship = "Enter a valid relationship";
    }

    if (!avatar) {
      newErrors.avatar = "Profile photo is required";
    } else {
      const avatarError = validateFile(avatar);
      if (avatarError) newErrors.avatar = avatarError;
    }

    if (!validId) {
      newErrors.valid_id_image = "Valid ID is required";
    } else {
      const idError = validateFile(validId);
      if (idError) newErrors.valid_id_image = idError;
    }

    if (!form.valid_id_type) {
  newErrors.valid_id_type = "Please select an ID type.";
}

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const sanitizedValue =
      name === "age"
        ? value.replace(/\D/g, "")
        : name === "contact_number" || name === "emergency_contact_number"
          ? value.replace(/[^\d+]/g, "")
          : sanitize(value);

    setForm((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, avatar: error }));
      return;
    }
    setErrors((prev) => ({ ...prev, avatar: "" }));
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleValidIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, valid_id_image: error }));
      return;
    }
    setErrors((prev) => ({ ...prev, valid_id_image: "" }));
    setValidId(file);
    setValidIdPreview(URL.createObjectURL(file));
  };

  const goNext = () => {
    const allErrors = validateAll();
    const relevantKeys = STEP_FIELDS[step];
    const stepErrors: Partial<Record<keyof FormState, string>> & { avatar?: string; valid_id_image?: string } = {};
    relevantKeys.forEach((key) => {
      if (allErrors[key]) stepErrors[key] = allErrors[key];
    });

    if (step === TOTAL_STEPS) {
      if (allErrors.avatar) stepErrors.avatar = allErrors.avatar;
      if (allErrors.valid_id_image) stepErrors.valid_id_image = allErrors.valid_id_image;
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Jump back to the earliest step that has an error
      for (const s of [1, 2, 3]) {
        const hasFieldError = STEP_FIELDS[s].some((key) => validationErrors[key]);
        const hasFileError =
          s === TOTAL_STEPS && (validationErrors.avatar || validationErrors.valid_id_image);
        if (hasFieldError || hasFileError) {
          setStep(s);
          break;
        }
      }
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
        gender: form.gender,
        age: Number(form.age),
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_number: form.emergency_contact_number,
        emergency_contact_relationship: form.emergency_contact_relationship,
        avatar,
        valid_id_image: validId,
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
        const error = err as { response?: { data?: { message?: string } } };
        message = error.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setModal({ type: "error", message });
    }
  };

  const { title, subtitle } = STEP_TITLES[step - 1];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">

      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden bg-white border border-slate-100">

        {/* LEFT PANEL */}
        <div className="hidden md:flex w-72 shrink-0 bg-slate-900 text-white p-10 flex-col justify-between">
          <div className="mb-6">
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
        <div className="w-full p-10 border">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${s < step
                      ? "bg-slate-900 text-white"
                      : s === step
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                >
                  {s < step ? <Check size={12} /> : s}
                </div>
                {s !== 3 && (
                  <div className={`h-0.5 flex-1 rounded-full transition-colors ${s < step ? "bg-slate-900" : "bg-slate-100"}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-xl font-semibold text-slate-900 mb-1">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {subtitle}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* STEP 1 — Personal info */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field icon={User} error={errors.first_name}>
                    <Input
                      name="first_name"
                      placeholder="First name"
                      value={form.first_name}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>

                  <Field icon={User} error={errors.last_name}>
                    <Input
                      name="last_name"
                      placeholder="Last name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field icon={User} error={errors.gender}>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full border-0 bg-transparent pl-9 pr-3 py-2.5 text-sm text-slate-900 outline-none appearance-none"
                    >
                      <option value="">Gender </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </Field>

                  <Field icon={Calendar} error={errors.age}>
                    <Input
                      name="age"
                      inputMode="numeric"
                      placeholder="Age "
                      value={form.age}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>
                </div>
              </>
            )}

            {/* STEP 2 — Account details */}
            {step === 2 && (
              <>
                <Field icon={AtSign} error={errors.username}>
                  <Input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field icon={Phone} error={errors.contact_number}>
                    <Input
                      name="contact_number"
                      placeholder="Contact number"
                      value={form.contact_number}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>

                  <Field icon={Mail} error={errors.email}>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>
                </div>

                <Field icon={MapPin} error={errors.address}>
                  <Input
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field icon={Lock} error={errors.password}>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>

                  <Field icon={Lock} error={errors.confirmPassword}>
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>
                </div>
              </>
            )}

            {/* STEP 3 — Emergency contact + documents */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="text-sm font-medium text-slate-700">Additional details</p>
                  <p className="text-xs text-slate-500">All fields below are required to finish registration.</p>
                </div>

                <Field icon={UserPlus} error={errors.emergency_contact_name}>
                  <Input
                    name="emergency_contact_name"
                    placeholder="Emergency contact name"
                    value={form.emergency_contact_name}
                    onChange={handleChange}
                    className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field icon={Phone} error={errors.emergency_contact_number}>
                    <Input
                      name="emergency_contact_number"
                      placeholder="Emergency contact number"
                      value={form.emergency_contact_number}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>

                  <Field icon={ShieldCheck} error={errors.emergency_contact_relationship}>
                    <Input
                      name="emergency_contact_relationship"
                      placeholder="Relationship"
                      value={form.emergency_contact_relationship}
                      onChange={handleChange}
                      className="border-0 bg-transparent pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    />
                  </Field>
                </div>

                <div className="flex-1">
                  <Field icon={ShieldCheck} error={errors.valid_id_type}>
                    <select
                      name="valid_id_type"
                      value={form.valid_id_type}
                      onChange={handleChange}
                      className="w-full border-0 bg-transparent pl-9 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none"
                    >
                      <option value="">Select ID Type</option>
                      <option value="National ID">National ID</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="Passport">Passport</option>
                      <option value="PhilHealth ID">PhilHealth ID</option>
                      <option value="SSS ID">SSS ID</option>
                      <option value="UMID">UMID</option>
                      <option value="PRC ID">PRC ID</option>
                      <option value="Postal ID">Postal ID</option>
                      <option value="Voter's ID">Voter's ID</option>
                      <option value="School ID">School ID</option>
                      <option value="Senior Citizen ID">Senior Citizen ID</option>
                      <option value="PWD ID">PWD ID</option>
                      <option value="Barangay ID">Barangay ID</option>
                      <option value="Company ID">Company ID</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 mb-3 bg-white p-3">
                  <div className="mt-3">
                    <SmallUpload
                      label="Valid ID"
                      preview={validIdPreview}
                      error={errors.valid_id_image}
                      onPick={() => idInputRef.current?.click()}
                      onRemove={() => {
                        setValidId(null);
                        setValidIdPreview(null);
                        if (idInputRef.current) idInputRef.current.value = "";
                      }}
                    />

                    <input
                      ref={idInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleValidIdChange}
                      className="hidden"
                    />
                  </div>
                   <p className="text-[11px] leading-5 text-slate-500">
                    Both photos are required. JPG, PNG, or WEBP only — up to {MAX_FILE_MB}MB each.
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start">
                    <div className="flex-1">
                      <SmallUpload
                        label="Profile photo"
                        preview={avatarPreview}
                        error={errors.avatar}
                        round
                        onPick={() => avatarInputRef.current?.click()}
                        onRemove={() => {
                          setAvatar(null);
                          setAvatarPreview(null);
                          if (avatarInputRef.current) avatarInputRef.current.value = "";
                        }}
                      />
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] leading-5 text-slate-500">
                    Both photos are required. JPG, PNG, or WEBP only — up to {MAX_FILE_MB}MB each.
                  </p>
                  </div>
                </div>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div className="flex items-center gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg py-2.5"
                >
                  Back
                </Button>
              )}

              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="flex-1 bg-slate-900 hover:bg-slate-700 text-white rounded-lg py-2.5"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-700 text-white rounded-lg py-2.5"
                >
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              )}
            </div>
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
        className={`relative flex items-center rounded-lg bg-white border transition-colors ${error
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

function SmallUpload({
  label,
  preview,
  error,
  round = false,
  onPick,
  onRemove,
}: {
  label: string;
  preview: string | null;
  error?: string;
  round?: boolean;
  onPick: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div
        className={`relative w-14 h-14 flex items-center justify-center border border-dashed transition-colors ${round ? "rounded-full" : "rounded-lg"
          } ${error ? "border-red-300 bg-red-50/30" : "border-slate-200 hover:border-slate-300 bg-slate-50/50"}`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={`${label} preview`}
              className={`absolute inset-0 w-full h-full object-cover ${round ? "rounded-full" : "rounded-lg"}`}
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center"
            >
              <XIcon size={9} />
            </button>
          </>
        ) : (
          <button type="button" onClick={onPick} className="flex items-center justify-center">
            <ImagePlus size={16} className="text-slate-400" />
          </button>
        )}
      </div>
      <span className="text-[10px] text-slate-500">{label}</span>
      {error && <span className="text-[10px] text-red-500 text-center max-w-16">{error}</span>}
    </div>
  );
}

export default Register