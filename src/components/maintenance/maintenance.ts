
export type MaintenanceStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Closed"
  | "Cancelled"

export type MaintenanceCategory =
  | "Electrical"
  | "Plumbing"
  | "Furniture"
  | "Appliance"
  | "Internet"
  | "Aircon"
  | "Others"

export type MaintenancePriority = "Low" | "Normal" | "Urgent"

export type MaintenanceRequest = {
  id: string
  request_number: string
  boarder?: string
  boarder_id?: string
  room_number: string
  bed_number?: string
  category: MaintenanceCategory | string
  description: string
  priority?: MaintenancePriority
  image_url?: string | null
  status: MaintenanceStatus
  assigned_staff?: string | null
  assigned_staff_id?: string | null
  /** ISO date string. */
  created_at: string
  updated_at?: string
  resolved_at?: string | null
  /** Resolution summary or closing remarks left by staff. */
  resolution_notes?: string | null
}

/** Payload sent when a boarder files a new request. */
export type CreateMaintenanceRequestPayload = {
  room_number: string
  category: MaintenanceCategory | string
  priority: MaintenancePriority
  description: string
  image?: File | null
}

/* -------------------------------------------------------------------------- */
/*                                Example data                                */
/* -------------------------------------------------------------------------- */

export const MAINTENANCE_CATEGORIES: MaintenanceCategory[] = [
  "Electrical",
  "Plumbing",
  "Furniture",
  "Appliance",
  "Internet",
  "Aircon",
  "Others",
]

/**
 * Seed data for local development. Covers every status and both the
 * with-image and no-image paths so the empty and placeholder states render.
 */
export const SAMPLE_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: "mr_01",
    request_number: "MR-20260805-0001",
    boarder: "Juan Dela Cruz",
    boarder_id: "brd_01",
    room_number: "201",
    bed_number: "B",
    category: "Electrical",
    description:
      "The ceiling outlet near the study desk sparks when I plug in my laptop charger. I stopped using it for now.",
    priority: "Urgent",
    image_url:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    status: "Pending",
    assigned_staff: null,
    created_at: "2026-08-05T09:14:00+08:00",
  },
  {
    id: "mr_02",
    request_number: "MR-20260803-0007",
    boarder: "Juan Dela Cruz",
    boarder_id: "brd_01",
    room_number: "201",
    bed_number: "B",
    category: "Plumbing",
    description:
      "Bathroom faucet drips continuously even when fully closed. Water pools around the sink overnight.",
    priority: "Normal",
    image_url:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
    status: "In Progress",
    assigned_staff: "Maria Santos",
    assigned_staff_id: "stf_02",
    created_at: "2026-08-03T16:42:00+08:00",
    updated_at: "2026-08-04T08:10:00+08:00",
  },
  {
    id: "mr_03",
    request_number: "MR-20260728-0012",
    boarder: "Juan Dela Cruz",
    boarder_id: "brd_01",
    room_number: "201",
    category: "Internet",
    description:
      "Wi-Fi keeps disconnecting every few minutes on the second floor, especially in the evening.",
    priority: "Normal",
    image_url: null,
    status: "Completed",
    assigned_staff: "Carlo Reyes",
    assigned_staff_id: "stf_01",
    created_at: "2026-07-28T20:05:00+08:00",
    updated_at: "2026-07-30T11:30:00+08:00",
    resolved_at: "2026-07-30T11:30:00+08:00",
    resolution_notes:
      "Replaced the second-floor access point and moved it away from the stairwell. Signal tested stable across all rooms.",
  },
  {
    id: "mr_04",
    request_number: "MR-20260715-0004",
    boarder: "Juan Dela Cruz",
    boarder_id: "brd_01",
    room_number: "201",
    category: "Furniture",
    description:
      "The bed frame creaks loudly and one of the side panels has come loose.",
    priority: "Low",
    image_url:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    status: "Closed",
    assigned_staff: "Maria Santos",
    assigned_staff_id: "stf_02",
    created_at: "2026-07-15T13:20:00+08:00",
    updated_at: "2026-07-19T09:00:00+08:00",
    resolved_at: "2026-07-18T15:45:00+08:00",
    resolution_notes:
      "Tightened all frame bolts and replaced the loose side panel bracket.",
  },
  {
    id: "mr_05",
    request_number: "MR-20260710-0002",
    boarder: "Juan Dela Cruz",
    boarder_id: "brd_01",
    room_number: "201",
    category: "Aircon",
    description:
      "Requested an extra fan for the room, but I already bought one myself.",
    priority: "Low",
    image_url: null,
    status: "Cancelled",
    assigned_staff: null,
    created_at: "2026-07-10T18:33:00+08:00",
    updated_at: "2026-07-11T10:05:00+08:00",
  },
]

/** Example staff list for the assign modal. */
export const SAMPLE_MAINTENANCE_STAFF = [
  {
    id: "stf_01",
    name: "Carlo Reyes",
    email: "carlo.reyes@gmail.com",
    contact_number: "+63 917 452 8810",
    avatar_url: null,
    active_requests: 1,
    completed_requests: 24,
    closed_requests: 21,
  },
  {
    id: "stf_02",
    name: "Maria Santos",
    email: "maria.santos@gmail.com",
    contact_number: "+63 928 331 7742",
    avatar_url: null,
    active_requests: 2,
    completed_requests: 38,
    closed_requests: 35,
  },
  {
    id: "stf_03",
    name: "Ramon Villanueva",
    email: "ramon.villanueva@gmail.com",
    contact_number: "+63 995 118 2064",
    avatar_url: null,
    active_requests: 4,
    completed_requests: 17,
    closed_requests: 15,
  },
  {
    id: "stf_04",
    name: "Grace Alcantara",
    email: "grace.alcantara@gmail.com",
    contact_number: "+63 906 774 3391",
    avatar_url: null,
    active_requests: 6,
    completed_requests: 41,
    closed_requests: 40,
  },
]