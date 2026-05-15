import UserTable from "@/components/Table/UserTable";
import AddUserModal from "@/components/modal/createUserModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const UserPage = () => {

  const [open, setOpen] = useState(false);


  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 py-2 bg-background">
        <div className="pb-6 pt-2 space-y-6">

          <div className="flex justify-between items-center ">
            <div>
              <h1 className="text-xl font-bold">User</h1>
              <p className="text-muted-foreground">
                Manage your boarding house users and permissions
              </p>
            </div>

            <Button onClick={() => setOpen(true)}>
              + Add User
            </Button>
          </div>
          <UserTable />
          <AddUserModal
            open={open}
            onClose={() => setOpen(false)}
            onSuccess={(newUser) => {
              useAuthStore.setState((state) => ({
                users: [newUser, ...state.users],
              }));

              setOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default UserPage