"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

type FormType = {
  first_name: string
  last_name: string
  username: string
  email: string
  contact_number: string
  address: string
  password: string
  user_type: "Admin" | "Staff" | "Boarder"
}

const AddUser = () => {
  const { createUserByAdmin, isLoading } = useAuth()

  const [form, setForm] = useState<FormType>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    contact_number: "",
    address: "",
    password: "",
    user_type: "Boarder",
  })

  const [errors, setErrors] = useState<Partial<FormType>>({})

  const [modal, setModal] = useState<{
    type: "loading" | "success" | "error" | null
    message?: string
  }>({ type: null })

  // 🔥 SANITIZE
  const sanitize = (value: string) =>
    value.trim().replace(/\s+/g, " ")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: sanitize(value),
    })

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  // 🔥 VALIDATION
  const validateForm = () => {
    const newErrors: Partial<FormType> = {}

    if (!form.first_name) newErrors.first_name = "First name is required"
    if (!form.last_name) newErrors.last_name = "Last name is required"
    if (!form.username) newErrors.username = "Username is required"
    if (!form.address) newErrors.address = "Address is required"

    if (!form.email) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email"
    }

    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters"
    }

    return newErrors
  }

  // 🔥 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setModal({ type: "loading" })

      await createUserByAdmin(form)

      setModal({
        type: "success",
        message: "User created successfully 🎉",
      })

      setForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        contact_number: "",
        address: "",
        password: "",
        user_type: "Boarder",
      })

    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } }
      }

      setModal({
        type: "error",
        message: error.response?.data?.message || "Failed to create user",
      })
    }
  }

  return (
      <div className="h-screen overflow-hidden">
    <div className="space-y-6 border-l-2 overflow-auto border-t-2 rounded-tl-2xl px-4 py-2 h-full ">

    <div className="p-6 max-w-3xl mx-auto space-y-6 ">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Add User Account</h1>
        <p className="text-muted-foreground text-sm">
          Create a new user for the system
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-white/30 p-6 shadow space-y-5"
      >

        {/* AVATAR */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold">
            {form.first_name ? form.first_name[0] : "U"}
          </div>
        </div>

        {/* NAME */}
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="First Name"
            name="first_name"
            placeholder="Enter first name"
            value={form.first_name}
            error={errors.first_name}
            onChange={handleChange}
          />
          <Field
            label="Last Name"
            name="last_name"
            placeholder="Enter last name"
            value={form.last_name}
            error={errors.last_name}
            onChange={handleChange}
          />
        </div>

        <Field
          label="Username"
          name="username"
            placeholder="Enter username"
          value={form.username}
          error={errors.username}
          onChange={handleChange}
        />

        <Field
          label="Email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          error={errors.email}
          onChange={handleChange}
        />

        <Field
          label="Address"
          name="address"
            placeholder="Enter Address"
          value={form.address}
          error={errors.address}
          onChange={handleChange}
        />

        <Field
          label="Password"
          name="password"
          placeholder="Enter password"
          type="password"
          value={form.password}
          error={errors.password}
          onChange={handleChange}
        />

        {/* ROLE */}
        <select
          name="user_type"
          value={form.user_type}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="Tenant">Tenant</option>
          <option value="Staff">Staff</option>
        </select>

        {/* BUTTON */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating..." : "Create User"}
        </Button>
      </form>

      {/* MODAL */}
      {modal.type && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 text-center space-y-4 w-80">

            {modal.type === "loading" && (
              <>
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white">Creating user...</p>
              </>
            )}

            {modal.type === "success" && (
              <>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white">✓</div>
                <p className="text-white">{modal.message}</p>
                <button onClick={() => setModal({ type: null })} className="text-sm text-blue-400">Close</button>
              </>
            )}

            {modal.type === "error" && (
              <>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto text-white">✕</div>
                <p className="text-white">{modal.message}</p>
                <button onClick={() => setModal({ type: null })} className="text-sm text-blue-400">Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
        </div>

  )
}
type FieldProps = {
  label: string
  name: string
  value: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}

const Field = ({
  label,
  name,
  placeholder,
  value,
  error,
  onChange,
  type = "text",
}: FieldProps) => (
  <div className="space-y-1">
    <label className="text-sm  font-medium">{label}</label>
    <Input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${
        error ? "border-red-500" : "border-gray-300 text-black"
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

export default AddUser