"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"

interface Props {
  open: boolean;
  onClose: () => void;
  announcement: {
    announcement_id: number;
    title: string;
    description: string;
  } | null;
}

const UpdateAnnouncementModal = ({ open, onClose, announcement }: Props) => {
  const { updateAnnouncement } = useAnnouncement();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // preload data when modal opens
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setDescription(announcement.description);
    }
  }, [announcement]);

  const handleSubmit = async () => {
    if (!announcement) return;
    const toastId = toast.loading("Updating announcement...");
    try {
      setLoading(true);

      await updateAnnouncement(announcement.announcement_id, {
        title,
        description,
      });

      toast.success("Announcement updated successfully", { id: toastId });

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update announcement", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update Announcement
          </DialogTitle>
          <p className="text-sm text-gray-400">
            update the announcement details below.
          </p>
        </DialogHeader>

        {/* FORM */}
        <div className="space-y-4 mt-4">

          {/* TITLE */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              className="rounded-xl"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (press Enter for new line)"
              rows={4}
              className="w-full text-sm rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Updating...
                </span>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default UpdateAnnouncementModal;