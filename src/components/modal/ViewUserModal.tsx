"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Mail, User, MapPin, Shield } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    contact_number: string,
    user_type: string;
    address?: string;
    created_at: string;
    updated_at?: string;
    avatar_url?: string;
  };
};

const ViewUserModal = ({ open, onClose, user }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl! w-full p-0 overflow-hidden">

        {/* 🔷 HEADER */}
        <div className="bg-linear-to-r from-blue-600 to-blue-200 p-6 text-white">
          <div className="flex items-center gap-4">

            {/* Avatar */}
           { user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.first_name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {user.first_name.charAt(0)}
            </div>
          )}

            <div>
              <h2 className="text-xl font-semibold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm opacity-80">@{user.username}</p>
              <Badge className="bg-white text-blue-600">
                {user.contact_number}
              </Badge>
            </div>

            {/* Role */}
            <div className="ml-auto">
              <Badge className="bg-white text-blue-600">
                {user.user_type}
              </Badge>
            </div>

          </div>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">

          <div className="space-y-4">

            <InfoItem
              icon={<Mail size={16} />}
              label="Email"
              value={user.email}
            />

            <InfoItem
              icon={<User size={16} />}
              label="Username"
              value={user.username}
            />

            <InfoItem
              icon={<MapPin size={16} />}
              label="Address"
              value={user.address || "N/A"}
            />

          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            <InfoItem
              icon={<Shield size={16} />}
              label="Role"
              value={user.user_type}
            />

            <InfoItem
              label="Created At"
              value={new Date(user.created_at).toLocaleString()}
            />

            <InfoItem
              label="Last Updated"
              value={
                user.updated_at
                  ? new Date(user.updated_at).toLocaleString()
                  : "N/A"
              }
            />

          </div>

        </div>

        {/* 🔷 FOOTER */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-muted"
          >
            Close
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;



/* 🔥 Reusable Info Item */
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
    {icon && <div className="text-muted-foreground">{icon}</div>}

    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);