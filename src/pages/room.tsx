import RoomsTable from "@/components/Room/Roomstable";
import AssignementPage from "@/components/RoomAssigment/AssignPage";
import RoomHistoryTable from "@/components/Room/Roomoccupancyhistorypage";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BedDouble, Users, History } from "lucide-react";

export default function Room() {
  return (
    <div className="h-screen overflow-auto rounded-tl-2xl border-l border-t bg-background px-6 py-5">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Room Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage rooms, assignments, and occupancy in one place.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rooms" className="space-y-2">
          <TabsList className="h-10 w-full justify-start gap-1 rounded-lg bg-muted/60 p-1 sm:w-auto">
            <TabsTrigger
              value="rooms"
              className="gap-1.5 rounded-md px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <BedDouble className="h-4 w-4" />
              Rooms
            </TabsTrigger>

            <TabsTrigger
              value="assignments"
              className="gap-1.5 rounded-md px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4" />
              Assignments
            </TabsTrigger>

            <TabsTrigger
              value="history"
              className="gap-1.5 rounded-md px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <History className="h-4 w-4" />
              Occupancy History
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="rooms"
          >
            <RoomsTable />
          </TabsContent>

          <TabsContent
            value="assignments"
          >
            <AssignementPage />
          </TabsContent>

          <TabsContent
            value="history"
          >
            <RoomHistoryTable />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}