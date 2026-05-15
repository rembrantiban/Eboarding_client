import { Input } from "@/components/ui/input"
  

type Props = {
  search: string;
  setSearch: (val: string) => void;
  filter: string;
  setFilter: (val: string) => void;
};

const UserTableHeader = ({ search, setSearch, filter, setFilter }: Props) => {

 
  return (
    <div className="flex items-center justify-between">

      {/* 🔷 Title */}
      

      {/* 🔷 Controls */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <Input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-background"
        >
          <option value="">All</option>
          <option value="Staff">Staff</option>
          <option value="Boarder">Boarder</option>
        </select>

      </div>
    </div>
  )
}

export default UserTableHeader