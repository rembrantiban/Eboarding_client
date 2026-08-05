"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRoom } from "@/hooks/useRoom";
import { X, ImagePlus, Upload } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const AddRoomModal = ({ open, onClose, onSuccess }: Props) => {
  const { createRoom } = useRoom();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    room_number: "",
    capacity: "",
    price_per_month: "",
    bed_count: "",
    description: "",
    status: "Available" as const,
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!form.room_number || !form.capacity || !form.price_per_month || !form.bed_count) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await createRoom({
        room_number: form.room_number,
        capacity: parseInt(form.capacity.toString()),
        bed_count: parseInt(form.bed_count.toString()),
        price_per_month: parseFloat(form.price_per_month.toString()),
        status: form.status,
        description: form.description,
        images,
      });

      toast.success("Room created successfully!");
      setForm({ room_number: "", capacity: "", bed_count: "", price_per_month: "", description: "", status: "Available" });
      setImages([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create room");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-6 py-5 border-b rounded-lg border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Room</h2>
            <p className="text-xs text-slate-400 mt-0.5">Create a new room listing</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          <div>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Room Info</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Room Number"    name="room_number"    placeholder="e.g. 101"   value={form.room_number}    onChange={handleChange} />
              <Field label="Capacity"       name="capacity"       placeholder="e.g. 4"      value={form.capacity}       onChange={handleChange} type="number" />
              <Field label="Number of Beds" name="bed_count"      placeholder="e.g. 4"      value={form.bed_count}      onChange={handleChange} type="number" />
              <Field label="Price / Month"  name="price_per_month" placeholder="0.00"       value={form.price_per_month} onChange={handleChange} type="number" prefix="₱" />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Description</p>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the room (amenities, rules, etc.)"
              rows={3}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-400 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Images</p>
              <span className="text-xs text-slate-400">{images.length} photo{images.length !== 1 ? "s" : ""}</span>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragOver ? "border-slate-400 bg-slate-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                  <ImagePlus size={18} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Drop images here</p>
                  <p className="text-xs text-slate-400 mt-0.5">or browse from your computer</p>
                </div>
                <label
                  htmlFor="add-room-upload"
                  className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-50 transition"
                >
                  <Upload size={12} /> Browse
                </label>
                <input
                  id="add-room-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </div>

            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">Selected Photos</p>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((file, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square ring-1 ring-slate-300">
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover"
                        alt={`preview-${i}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl text-sm">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm px-6"
          >
            {isSubmitting ? "Creating..." : "Add Room"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AddRoomModal;

type FieldProps = {
  label: string;
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  prefix?: string;
};

const Field = ({ label, name, placeholder, value, onChange, type = "text", prefix }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-600">{label}</label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
          {prefix}
        </span>
      )}
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`rounded-xl border-slate-200 text-sm h-9 focus-visible:ring-slate-500/30 focus-visible:border-slate-400 ${prefix ? "pl-7" : ""}`}
      />
    </div>
  </div>
);