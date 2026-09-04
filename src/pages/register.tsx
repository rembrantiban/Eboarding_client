"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useRef, useState } from "react"
import {
  COUNTRIES,
  DIAL_OPTIONS,
  NATIONALITIES,
  DEFAULT_DIAL,
  DEFAULT_NATIONALITY,
  flagOf,
} from "@/constants/countries"
import {
  ArrowRight,
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
  Users,
  Info,
  Home,
  CheckCircle2,
  Headphones,
  ChevronDown,
  Eye,
  EyeOff,
  UploadCloud,
  CreditCard,
  Globe,
} from "lucide-react"

const MAX_FILE_MB = 5;
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,20}$/;
const PH_PHONE_REGEX = /^(09|\+639)\d{9}$/;
const INTL_PHONE_REGEX = /^\d{6,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RELATIONSHIP_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,30}$/;

const RELATIONSHIP_OPTIONS = [
  "Parent",
  "Mother",
  "Father",
  "Guardian",
  "Sibling",
  "Spouse",
  "Relative",
  "Friend",
];

const ID_TYPES = [
  "National ID",
  "Driver's License",
  "Passport",
  "PhilHealth ID",
  "SSS ID",
  "UMID",
  "PRC ID",
  "Postal ID",
  "Voter's ID",
  "School ID",
  "Student ID",
  "Senior Citizen ID",
  "PWD ID",
  "Barangay ID",
  "Company ID",
];

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  country_code: string;
  contact_number: string;
  nationality: string;
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

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    country_code: DEFAULT_DIAL,
    contact_number: "",
    nationality: DEFAULT_NATIONALITY,
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

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>> & { avatar?: string; valid_id_image?: string; terms?: string }>({});

  const [modal, setModal] = useState<{
    type: "loading" | "success" | "error" | null;
    message?: string;
  }>({
    type: null,
  });

  useEffect(() => {
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
          );

          const data = await res.json();

          setForm(prev => ({
            ...prev,
            address: data.display_name,
          }));
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
      }
    );
  }, []);

  const sanitize = (value: string) => value.replace(/\s+/g, " ").replace(/^ /, "");

  const isPH = form.country_code === "+63";

  // PH numbers keep the strict 09XXXXXXXXX rule; other countries accept 6–15 digits.
  const validatePhone = (value: string) =>
    isPH
      ? PH_PHONE_REGEX.test(value)
      : INTL_PHONE_REGEX.test(value.replace(/\D/g, ""));

  const phoneHint = isPH
    ? "Use a valid phone number like 09171234567"
    : "Enter 6–15 digits";

  const phonePlaceholder = isPH ? "09XXXXXXXXX" : "Phone number";

  const selectedCountry =
    COUNTRIES.find((c) => c.dial === form.country_code) ?? null;

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

    if (!form.nationality) {
      newErrors.nationality = "Nationality is required";
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

    if (!form.country_code) {
      newErrors.country_code = "Country code is required";
    }

    if (!form.contact_number) {
      newErrors.contact_number = "Contact number is required";
    } else if (!validatePhone(form.contact_number)) {
      newErrors.contact_number = phoneHint;
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
    } else if (!validatePhone(form.emergency_contact_number)) {
      newErrors.emergency_contact_number = phoneHint;
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

  // Changing the dial code re-validates both phone fields against the new rule.
  const handleDialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, country_code: value }));
    setErrors((prev) => ({
      ...prev,
      country_code: "",
      contact_number: "",
      emergency_contact_number: "",
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateAll();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setModal({ type: "loading" });

      await register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email,
        username: form.username,
        country_code: form.country_code,
        contact_number: form.contact_number,
        nationality: form.nationality,
        address: form.address,
        password: form.password,
        user_type: "Boarder",
        gender: form.gender,
        age: Number(form.age),
        emergency_contact_name: form.emergency_contact_name.trim(),
        emergency_contact_number: form.emergency_contact_number,
        emergency_contact_relationship: form.emergency_contact_relationship,
        avatar,
        valid_id_type: form.valid_id_type,
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

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">

      <aside className="hidden lg:flex w-62 xl:w-67 shrink-0 flex-col bg-slate-900 text-white lg:sticky lg:top-0 lg:h-screen">

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-6">
          {/* Logo */}
          <div className="mb-7 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Home size={16} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">E-Boarding</span>
          </div>

          {/* Headline */}
          <h1 className="text-xl font-bold leading-snug tracking-tight xl:text-[22px]">
            Create your
            <br />
            <span className="text-indigo-400">account</span>
          </h1>
          <p className="mt-2 text-[12px] leading-relaxed text-white/50">
            Join E-Boarding and manage your boarding experience with ease.
          </p>

          {/* Feature list */}
          <ul className="mt-6 space-y-4">
            <Perk
              icon={ShieldCheck}
              title="Secure & reliable"
              text="Your information is protected with top-level security."
            />
            <Perk
              icon={Users}
              title="Easy management"
              text="Manage your boarding information in one place."
            />
            <Perk
              icon={CheckCircle2}
              title="Trusted platform"
              text="Built for boarders, by boarding professionals."
            />
          </ul>

          {/* Support card */}
          <div className="mt-6 flex gap-2.5 rounded-lg bg-white/5 p-3">
            <Headphones size={15} className="mt-0.5 shrink-0 text-white/70" />
            <div>
              <p className="text-[12px] font-medium">Need help?</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">
                Contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 px-6 py-4">
          <p className="mb-2 text-center text-[11px] text-white/50">Already have an account?</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 py-2.5 text-[13px] font-medium transition-colors hover:bg-white/10"
          >
            Sign in <ArrowRight size={14} />
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-4 lg:py-6">

        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Home size={15} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">E-Boarding</span>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden text-[13px] text-slate-500 sm:inline">Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-900 transition-colors hover:bg-slate-50"
            >
              Sign in
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <UserPlus size={18} className="text-slate-700" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Register</h2>
            <p className="text-[12px] text-slate-500 sm:text-[13px]">
              Fill in the form below to create your account
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-300 bg-white p-4 sm:p-5 lg:p-6"
        >
          {/* ── Personal information ── */}
          <SectionTitle icon={User} label="Personal information" />

          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
            <FormField label="First name" required error={errors.first_name}>
              <Shell icon={User} error={errors.first_name}>
                <Input
                  name="first_name"
                  placeholder="Enter your first name"
                  value={form.first_name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Shell>
            </FormField>

            <FormField label="Last name" required error={errors.last_name}>
              <Shell icon={User} error={errors.last_name}>
                <Input
                  name="last_name"
                  placeholder="Enter your last name"
                  value={form.last_name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Shell>
            </FormField>

            <FormField label="Gender" required error={errors.gender}>
              <Shell error={errors.gender} chevron>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`${selectClass} pl-3 ${form.gender ? "text-slate-900" : "text-slate-400"}`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Shell>
            </FormField>

            <FormField label="Age" required error={errors.age}>
              <Shell icon={Calendar} error={errors.age}>
                <Input
                  name="age"
                  inputMode="numeric"
                  placeholder="Enter your age"
                  value={form.age}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Shell>
            </FormField>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
            <FormField label="Nationality" required error={errors.nationality}>
              <Shell icon={Globe} error={errors.nationality} chevron>
                <select
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className={`${selectClass} ${form.nationality ? "text-slate-900" : "text-slate-400"}`}
                >
                  <option value="">Select nationality</option>
                  {NATIONALITIES.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Shell>
            </FormField>
          </div>

          <Divider />

          {/* ── Account details ── */}
          <SectionTitle icon={Lock} label="Account details" />

          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
            <FormField label="Username" required error={errors.username}>
              <Shell icon={AtSign} error={errors.username}>
                <Input
                  name="username"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Shell>
            </FormField>

            <FormField label="Email address" required error={errors.email}>
              <Shell icon={Mail} error={errors.email}>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Shell>
            </FormField>

            <FormField
              label="Contact number"
              required
              error={errors.contact_number || errors.country_code}
              hint={selectedCountry ? `${flagOf(selectedCountry.iso)} ${selectedCountry.name}` : undefined}
            >
              <Shell error={errors.contact_number || errors.country_code}>
                <div className="relative shrink-0">
                  <select
                    name="country_code"
                    value={form.country_code}
                    onChange={handleDialChange}
                    aria-label="Country code"
                    className="h-9 w-19 cursor-pointer appearance-none border-0 bg-transparent pl-3 pr-5 text-[13px] text-slate-900 outline-none"
                  >
                    {DIAL_OPTIONS.map((c) => (
                      <option key={c.iso} value={c.dial}>
                        {flagOf(c.iso)} {c.dial} — {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <span className="h-4 w-px shrink-0 bg-slate-200" />

                <Input
                  name="contact_number"
                  inputMode="numeric"
                  placeholder={phonePlaceholder}
                  value={form.contact_number}
                  onChange={handleChange}
                  className={bareInputClass}
                />
              </Shell>
            </FormField>
          </div>

          <div className="mt-3">
            <FormField
              label="Address"
              required
              error={errors.address}
              hint={loadingLocation ? "Detecting your location…" : undefined}
            >
              <Shell
                icon={loadingLocation ? Loader2 : MapPin}
                iconClassName={loadingLocation ? "animate-spin" : ""}
                error={errors.address}
              >
                <Input
                  name="address"
                  placeholder="Enter your complete address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Shell>
            </FormField>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <FormField label="Password" required error={errors.password}>
              <Shell icon={Lock} error={errors.password}>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </Shell>
            </FormField>

            <FormField label="Confirm password" required error={errors.confirmPassword}>
              <Shell icon={Lock} error={errors.confirmPassword}>
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </Shell>
            </FormField>
          </div>

          <Divider />

          {/* ── Additional information ── */}
          <SectionTitle
            icon={Info}
            label="Additional information"
            note="Emergency contact and verification"
          />

          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
            <FormField label="Emergency contact name" required error={errors.emergency_contact_name}>
              <Shell icon={User} error={errors.emergency_contact_name}>
                <Input
                  name="emergency_contact_name"
                  placeholder="Enter contact name"
                  value={form.emergency_contact_name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Shell>
            </FormField>

            <FormField label="Emergency contact number" required error={errors.emergency_contact_number}>
              <Shell icon={Phone} error={errors.emergency_contact_number}>
                <Input
                  name="emergency_contact_number"
                  inputMode="numeric"
                  placeholder={phonePlaceholder}
                  value={form.emergency_contact_number}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Shell>
            </FormField>

            <FormField label="Relationship" required error={errors.emergency_contact_relationship}>
              <Shell icon={Users} error={errors.emergency_contact_relationship} chevron>
                <select
                  name="emergency_contact_relationship"
                  value={form.emergency_contact_relationship}
                  onChange={handleChange}
                  className={`${selectClass} ${form.emergency_contact_relationship ? "text-slate-900" : "text-slate-400"}`}
                >
                  <option value="">Select relationship</option>
                  {RELATIONSHIP_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Shell>
            </FormField>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
            <FormField label="Valid ID type" required error={errors.valid_id_type}>
              <Shell icon={CreditCard} error={errors.valid_id_type} chevron>
                <select
                  name="valid_id_type"
                  value={form.valid_id_type}
                  onChange={handleChange}
                  className={`${selectClass} ${form.valid_id_type ? "text-slate-900" : "text-slate-400"}`}
                >
                  <option value="">Select ID type</option>
                  {ID_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Shell>
            </FormField>

            <FormField label="Profile picture" required error={errors.avatar}>
              <UploadBox
                title="Upload your profile picture"
                preview={avatarPreview}
                hasError={!!errors.avatar}
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
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </FormField>

            <FormField label="Valid ID image" required error={errors.valid_id_image}>
              <UploadBox
                title="Upload your valid ID"
                preview={validIdPreview}
                hasError={!!errors.valid_id_image}
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
            </FormField>
          </div>

          {/* ── Terms + submit ── */}
          <div className="mt-4 flex  border-t border-slate-100 pt-5 lg:items-center lg:justify-end">

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full  shrink-0 rounded-lg bg-slate-900 text-[13px] font-semibold text-white shadow-none transition-colors hover:bg-slate-800 disabled:opacity-70 lg:w-95"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="mr-2 animate-spin" /> Creating account…
                </>
              ) : (
                <>
                  <UserPlus size={15} className="mr-2" /> Create account
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <Lock size={12} className="shrink-0" />
          Your information is secure and will never be shared.
        </p>
      </main>

      {/* ── MODAL — logic unchanged ── */}
      {modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xs space-y-3 rounded-xl border border-slate-200 bg-white p-6 text-center">

            {modal.type === "loading" && (
              <>
                <Loader2 className="mx-auto h-9 w-9 animate-spin text-slate-400" />
                <p className="text-[13px] font-medium text-slate-900">
                  Creating your account…
                </p>
              </>
            )}

            {modal.type === "success" && (
              <>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                  <Check className="text-emerald-600" size={20} />
                </div>
                <p className="text-[13px] font-medium text-slate-900">{modal.message}</p>
              </>
            )}

            {modal.type === "error" && (
              <>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                  <XIcon className="text-red-500" size={20} />
                </div>
                <p className="text-[13px] font-medium text-slate-900">{modal.message}</p>

                <button
                  onClick={() => setModal({ type: null })}
                  className="text-[13px] text-slate-500 transition-colors hover:text-slate-900 hover:underline"
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

/* ── Shared classes ───────────────────────────────────── */

const inputClass =
  "h-9 w-full rounded-lg border-0 bg-transparent pl-9 pr-3 text-[13px] text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0";

// Same as inputClass but without the left icon offset — used inside the phone shell.
const bareInputClass =
  "h-9 w-full min-w-0 rounded-lg border-0 bg-transparent px-3 text-[13px] text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0";

const selectClass =
  "h-9 w-full cursor-pointer appearance-none border-0 bg-transparent pl-9 pr-8 text-[13px] outline-none";

/* ── Presentational helpers ───────────────────────────── */

function Perk({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <li className="flex gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Icon size={14} className="text-white/80" />
      </div>
      <div>
        <p className="text-[12px] font-semibold">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">{text}</p>
      </div>
    </li>
  );
}

function SectionTitle({
  icon: Icon,
  label,
  note,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  note?: string;
}) {
  return (
    <div className="mb-3.5 flex flex-wrap items-center gap-2">
      <Icon size={15} className="text-indigo-600" />
      <h3 className="text-[13px] font-semibold text-slate-900">{label}</h3>
      {note && <span className="text-[12px] text-slate-400">({note})</span>}
    </div>
  );
}

function Divider() {
  return <div className="my-5 h-px w-full bg-slate-100" />;
}

function FormField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[12px] font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {hint && <span className="ml-1.5 text-[10px] font-normal text-slate-400">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function Shell({
  icon: Icon,
  iconClassName,
  error,
  chevron,
  children,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconClassName?: string;
  error?: string;
  chevron?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center rounded-lg border bg-white transition-colors ${
        error
          ? "border-red-300 focus-within:border-red-400"
          : "border-slate-200 hover:border-slate-300 focus-within:border-slate-400"
      }`}
    >
      {Icon && (
        <Icon size={15} className={`pointer-events-none absolute left-3 text-slate-400 ${iconClassName ?? ""}`} />
      )}
      {children}
      {chevron && (
        <ChevronDown size={15} className="pointer-events-none absolute right-2.5 text-slate-400" />
      )}
    </div>
  );
}

function UploadBox({
  title,
  preview,
  hasError,
  round = false,
  onPick,
  onRemove,
}: {
  title: string;
  preview: string | null;
  hasError?: boolean;
  round?: boolean;
  onPick: () => void;
  onRemove: () => void;
}) {
  if (preview) {
    return (
      <div className="relative flex h-19 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3">
        <img
          src={preview}
          alt="Upload preview"
          className={`h-12 w-12 shrink-0 object-cover ${round ? "rounded-full" : "rounded-md"}`}
        />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-slate-700">Image selected</p>
          <button
            type="button"
            onClick={onPick}
            className="mt-0.5 text-[11px] font-medium text-indigo-600 hover:underline"
          >
            Replace
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className="absolute right-1.5 top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-900 p-1 text-white transition-colors hover:bg-slate-700"
        >
          <XIcon size={10} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPick}
      className={`flex h-19 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-2 text-center transition-colors ${
        hasError
          ? "border-red-300 bg-red-50/40 hover:bg-red-50"
          : "border-slate-300 bg-slate-50/60 hover:border-slate-400 hover:bg-slate-50"
      }`}
    >
      <UploadCloud size={18} className="text-slate-400" />
      <span className="text-[11px] font-medium text-slate-600">{title}</span>
      <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Max. {MAX_FILE_MB}MB)</span>
    </button>
  );
}

export default Register