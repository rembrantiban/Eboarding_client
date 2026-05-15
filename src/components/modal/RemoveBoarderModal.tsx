import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  boarderName?: string;
  room?: string;
};

const RemoveBoarderModal = ({
  open,
  onClose,
  onConfirm,
  boarderName,
  room,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="text-red-600 w-5 h-5" />
            </div>
            <DialogTitle>Remove Boarder</DialogTitle>
          </div>

          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">
              {boarderName}
            </span>{" "}
            from{" "}
            <span className="font-medium text-foreground">
              {room}
            </span>
            ?
            <br />
            <span className="text-red-500 text-xs">
              This will free the bed and remove future payments.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : null}
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveBoarderModal;