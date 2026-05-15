"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UploadCloud, X } from "lucide-react"

const AddRoom = () => {
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    price: "",
    description: "",
  })

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 🔥 Handle Image Upload
  const handleImageChange = (file: File) => {
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleImageChange(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ ...form, image })
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full overflow-y-auto  px-4 py-2">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* 🔷 HEADER */}
          <div>
            <h1 className="text-2xl font-bold">Add Room</h1>
            <p className="text-sm text-muted-foreground">
              Create a new room for your boarding house
            </p>
          </div>

          {/* 🔷 FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-background p-6 shadow-sm space-y-6"
          >

            {/* 🖼️ IMAGE UPLOADER */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Image</label>

              {!preview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition"
                >
                  <UploadCloud className="mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && handleImageChange(e.target.files[0])
                    }
                  />
                </div>
              ) : (
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImage(null)
                      setPreview(null)
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* 🔷 Room Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Name</label>
              <Input
                name="name"
                placeholder="e.g. Room 01"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* 🔷 Capacity + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <Input
                  type="number"
                  name="capacity"
                  placeholder="e.g. 2"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  name="price"
                  placeholder="e.g. 1500"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 🔷 Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                placeholder="Optional room details..."
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background min-h-25"
              />
            </div>

            {/* 🔷 ACTIONS */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
              <Button type="submit">
                Create Room
              </Button>
            </div>

          </form>
        </div>
      </div>

    </div>
  )
}

export default AddRoom