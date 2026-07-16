import UserTable from "@/components/Table/UserTable";

const UserPage = () => {


  return (
    <div className="h-screen overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-5 py-6 bg-background ">
          <UserTable />
    </div>
  )
}

export default UserPage