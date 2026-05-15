import React, { useState } from "react";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { toast } from "sonner"
import { Bell } from "lucide-react";

const CreateAnnouncementModal = ({ onClose }: { onClose: () => void }) => {
  const { createAnnouncement } = useAnnouncement();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating announcement...");
    try{
       await createAnnouncement({ title, description }); 
       toast.success("Announcement created successfully!", { id: toastId });
       onClose()
    }
    catch(error) {
      console.error("Create announcement error:", error);
      toast.error("Failed to create announcement.", { id: toastId });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-md p-6 space-y-4 shadow-lg">
        
        <h2 className="text-lg font-semibold flex items-center gap-2"><Bell size={20} /> Create Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded-md px-3 py-2 outline-1 "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border rounded-lg px-3 py-2 h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm bg-red-500 text-white rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-black text-sm text-white px-4 py-2 rounded-lg"
            >
              Post
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateAnnouncementModal;