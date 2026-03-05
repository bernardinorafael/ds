import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Checkbox } from "@/components/checkbox"
import { DataTableToolbar } from "@/components/data-table-toolbar"
import { Dropdown } from "@/components/dropdown"
import { IconButton } from "@/components/icon-button"
import { Input } from "@/components/input"
import { Provider } from "@/components/provider"
import { Select } from "@/components/select"
import {
  createColumnHelper,
  DataGrid,
  type ColumnPinningState,
  type SortingState,
  type VisibilityState,
} from "@/experimental/data-grid"

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

type User = {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
  department: string
  location: string
  joinDate: string
  lastActive: string
  projects: number
}

const USERS: User[] = [
  {
    id: "u1",
    name: "Alice Martin",
    email: "alice@example.com",
    role: "Admin",
    status: "active",
    department: "Engineering",
    location: "New York, US",
    joinDate: "Jan 2023",
    lastActive: "2 hours ago",
    projects: 12,
  },
  {
    id: "u2",
    name: "Bob Chen",
    email: "bob@example.com",
    role: "Editor",
    status: "active",
    department: "Marketing",
    location: "San Francisco, US",
    joinDate: "Mar 2023",
    lastActive: "1 day ago",
    projects: 8,
  },
  {
    id: "u3",
    name: "Carol White",
    email: "carol@example.com",
    role: "Viewer",
    status: "inactive",
    department: "Design",
    location: "London, UK",
    joinDate: "Jun 2022",
    lastActive: "2 weeks ago",
    projects: 3,
  },
  {
    id: "u4",
    name: "David Kim",
    email: "david@example.com",
    role: "Editor",
    status: "active",
    department: "Engineering",
    location: "Seoul, KR",
    joinDate: "Sep 2023",
    lastActive: "5 minutes ago",
    projects: 15,
  },
  {
    id: "u5",
    name: "Eva Torres",
    email: "eva@example.com",
    role: "Admin",
    status: "pending",
    department: "Product",
    location: "Berlin, DE",
    joinDate: "Nov 2023",
    lastActive: "3 hours ago",
    projects: 6,
  },
  {
    id: "u6",
    name: "Frank Muller",
    email: "frank@example.com",
    role: "Viewer",
    status: "active",
    department: "Sales",
    location: "Munich, DE",
    joinDate: "Feb 2024",
    lastActive: "1 hour ago",
    projects: 4,
  },
  {
    id: "u7",
    name: "Grace Okafor",
    email: "grace@example.com",
    role: "Editor",
    status: "active",
    department: "Engineering",
    location: "Lagos, NG",
    joinDate: "Apr 2023",
    lastActive: "30 minutes ago",
    projects: 9,
  },
  {
    id: "u8",
    name: "Hiro Tanaka",
    email: "hiro@example.com",
    role: "Admin",
    status: "active",
    department: "Engineering",
    location: "Tokyo, JP",
    joinDate: "Jul 2022",
    lastActive: "10 minutes ago",
    projects: 18,
  },
  {
    id: "u9",
    name: "Irene Costa",
    email: "irene@example.com",
    role: "Viewer",
    status: "pending",
    department: "Support",
    location: "Lisbon, PT",
    joinDate: "Dec 2023",
    lastActive: "4 hours ago",
    projects: 2,
  },
  {
    id: "u10",
    name: "Jake Rivera",
    email: "jake@example.com",
    role: "Editor",
    status: "active",
    department: "Marketing",
    location: "Mexico City, MX",
    joinDate: "Jan 2024",
    lastActive: "20 minutes ago",
    projects: 7,
  },
  {
    id: "u11",
    name: "Kira Novak",
    email: "kira@example.com",
    role: "Admin",
    status: "inactive",
    department: "Engineering",
    location: "Prague, CZ",
    joinDate: "Aug 2022",
    lastActive: "1 month ago",
    projects: 11,
  },
  {
    id: "u12",
    name: "Liam Park",
    email: "liam@example.com",
    role: "Viewer",
    status: "active",
    department: "Design",
    location: "Sydney, AU",
    joinDate: "May 2023",
    lastActive: "15 minutes ago",
    projects: 5,
  },
]

const statusIntent = {
  active: "success",
  inactive: "secondary",
  pending: "warning",
} as const

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: false,
    cell: (info) => (
      <span className="text-word-primary font-medium">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    enableSorting: false,
    cell: (info) => <span className="text-word-secondary">{info.getValue()}</span>,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    enableSorting: false,
    meta: { width: "6rem" },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: false,
    meta: { width: "6rem" },
    cell: (info) => (
      <Badge intent={statusIntent[info.getValue()]}>{info.getValue()}</Badge>
    ),
  }),
]

const sortableColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => (
      <span className="text-word-primary font-medium">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => <span className="text-word-secondary">{info.getValue()}</span>,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    meta: { width: "6rem" },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: false,
    meta: { width: "6rem" },
    cell: (info) => (
      <Badge intent={statusIntent[info.getValue()]}>{info.getValue()}</Badge>
    ),
  }),
]

const columnsWithActions = [
  ...columns,
  columnHelper.display({
    id: "actions",
    header: "Actions",
    meta: { actions: true },
    cell: () => (
      <div className="mx-auto w-full max-w-7xl">
        <IconButton
          size="sm"
          intent="ghost"
          shape="circle"
          icon="more-horizontal-outline"
          aria-label="Actions"
        />
      </div>
    ),
  }),
]

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Experimental/DataGrid",
  component: DataGrid,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
  ],
  args: {
    columns,
    data: USERS,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Meta<any>

export default meta

type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Compact: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-7xl">
      <DataGrid
        columns={columns}
        data={USERS}
        spacing="compact"
        getRowId={(row) => row.id}
        aria-label="Users table"
      />
    </div>
  ),
}

export const Cozy: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-7xl">
      <DataGrid
        columns={columns}
        data={USERS}
        spacing="cozy"
        getRowId={(row) => row.id}
        aria-label="Users table"
      />
    </div>
  ),
}

export const WithSorting: Story = {
  render: () => {
    const Demo = () => {
      const [sorting, setSorting] = useState<SortingState>([])

      return (
        <div className="mx-auto w-full max-w-7xl">
          <DataGrid
            columns={sortableColumns}
            data={USERS}
            sorting={sorting}
            onSortingChange={setSorting}
            manualSorting={false}
          />
        </div>
      )
    }

    return <Demo />
  },
}

export const WithPagination: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState(1)
      const [limit, setLimit] = useState(10)

      const total = 127
      const pageEnd = Math.ceil(total / limit)
      const start = (page - 1) * limit
      const visibleUsers: User[] = Array.from(
        { length: Math.min(limit, total - start) },
        (_, i) => ({
          id: `u${start + i + 1}`,
          name: `User ${start + i + 1}`,
          email: `user${start + i + 1}@example.com`,
          role: ["Admin", "Editor", "Viewer"][i % 3],
          status: (["active", "inactive", "pending"] as const)[i % 3],
          department: ["Engineering", "Marketing", "Design"][i % 3],
          location: ["New York, US", "London, UK", "Berlin, DE"][i % 3],
          joinDate: ["Jan 2023", "Mar 2023", "Jun 2023"][i % 3],
          lastActive: ["2 hours ago", "1 day ago", "5 minutes ago"][i % 3],
          projects: ((i + 1) * 3) % 20,
        })
      )

      return (
        <div className="mx-auto w-full max-w-7xl">
          <DataGrid
            columns={columns}
            data={visibleUsers}
            pagination={{
              count: total,
              page,
              limit,
              hasNextPage: page < pageEnd,
              hasPreviousPage: page > 1,
            }}
            onPageChange={setPage}
            onLimitChange={(v) => {
              setLimit(v)
              setPage(1)
            }}
            limitOptions={[5, 10, 25, 50]}
          />
        </div>
      )
    }

    return <Demo />
  },
}

// ---------------------------------------------------------------------------
// Expansion helpers
// ---------------------------------------------------------------------------

function UserDetail({ user }: { user: (typeof USERS)[number] }) {
  return (
    <div className="flex flex-col gap-4 pb-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-word-tertiary text-xs">Department</span>
          <span className="text-word-primary text-sm font-medium">{user.department}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-word-tertiary text-xs">Location</span>
          <span className="text-word-primary text-sm font-medium">{user.location}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-word-tertiary text-xs">Joined</span>
          <span className="text-word-primary text-sm font-medium">{user.joinDate}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-word-tertiary text-xs">Last active</span>
          <span className="text-word-primary text-sm font-medium">{user.lastActive}</span>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-3">
        <span className="text-word-secondary text-sm">
          {user.projects} active projects
        </span>
      </div>
    </div>
  )
}

export const ExpandableRows: Story = {
  render: () => {
    const Demo = () => (
      <div className="mx-auto w-full max-w-7xl">
        <DataGrid
          columns={columns}
          data={USERS}
          enableRowExpansion
          renderRowDetail={(row) => <UserDetail user={row.original} />}
          getRowId={(row) => row.id}
        />
      </div>
    )

    return <Demo />
  },
}

// ---------------------------------------------------------------------------
// Row Link
// ---------------------------------------------------------------------------

export const WithRowLink: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-7xl">
      <DataGrid
        columns={columnsWithActions}
        data={USERS.slice(0, 5)}
        getRowHref={(row) => `#/users/${row.original.id}`}
        getRowId={(row) => row.id}
      />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Column Pinning
// ---------------------------------------------------------------------------

const pinningColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    size: 180,
    enableSorting: false,
    cell: (info) => (
      <span className="text-word-primary font-medium">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    size: 220,
    enableSorting: false,
    cell: (info) => <span className="text-word-secondary">{info.getValue()}</span>,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    size: 120,
    enableSorting: false,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    size: 120,
    enableSorting: false,
    cell: (info) => (
      <Badge intent={statusIntent[info.getValue()]}>{info.getValue()}</Badge>
    ),
  }),
  columnHelper.accessor("department", {
    header: "Department",
    size: 160,
    enableSorting: false,
  }),
  columnHelper.accessor("location", {
    header: "Location",
    size: 180,
    enableSorting: false,
  }),
  columnHelper.accessor("joinDate", {
    header: "Joined",
    size: 120,
    enableSorting: false,
  }),
  columnHelper.accessor("lastActive", {
    header: "Last active",
    size: 150,
    enableSorting: false,
  }),
  columnHelper.accessor("projects", {
    header: "Projects",
    size: 100,
    enableSorting: false,
  }),
]

const PINNABLE_COLUMNS = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "status", label: "Status" },
]

export const WithColumnPinning: Story = {
  render: function Render() {
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
      left: ["name"],
      right: ["email"],
    })

    const togglePin = (columnId: string, side: "left" | "right") => {
      setColumnPinning((prev) => {
        const isAlreadyPinned = prev[side]?.includes(columnId)
        if (isAlreadyPinned) {
          return {
            ...prev,
            [side]: (prev[side] ?? []).filter((id) => id !== columnId),
          }
        }
        const otherSide = side === "left" ? "right" : "left"
        return {
          [otherSide]: (prev[otherSide] ?? []).filter((id) => id !== columnId),
          [side]: [...(prev[side] ?? []), columnId],
        }
      })
    }

    return (
      <div className="mx-auto w-full max-w-7xl">
        <DataTableToolbar
          search={<Input type="search" placeholder="Search users" />}
          filter={
            <Select aria-label="Role filter" items={ROLE_OPTIONS} placeholder="Role" />
          }
          sort={
            <Select
              aria-label="Status filter"
              items={STATUS_OPTIONS}
              placeholder="Status"
            />
          }
          action={
            <Dropdown>
              <Dropdown.Trigger asChild>
                <Button
                  intent="secondary"
                  leftIcon="pin-outline"
                  aria-label="Manage column pinning"
                >
                  Pin
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                <Dropdown.Label>Pin left</Dropdown.Label>
                {PINNABLE_COLUMNS.map((col) => (
                  <Dropdown.CheckboxItem
                    key={`left-${col.id}`}
                    checked={columnPinning.left?.includes(col.id)}
                    onCheckedChange={() => togglePin(col.id, "left")}
                  >
                    {col.label}
                  </Dropdown.CheckboxItem>
                ))}
                <Dropdown.Separator />
                <Dropdown.Label>Pin right</Dropdown.Label>
                {PINNABLE_COLUMNS.map((col) => (
                  <Dropdown.CheckboxItem
                    key={`right-${col.id}`}
                    checked={columnPinning.right?.includes(col.id)}
                    onCheckedChange={() => togglePin(col.id, "right")}
                  >
                    {col.label}
                  </Dropdown.CheckboxItem>
                ))}
              </Dropdown.Content>
            </Dropdown>
          }
        >
          <DataGrid
            columns={pinningColumns}
            data={USERS}
            columnPinning={columnPinning}
            onColumnPinningChange={setColumnPinning}
            getRowId={(row) => row.id}
          />
        </DataTableToolbar>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Column Visibility
// ---------------------------------------------------------------------------

const visibilityColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: false,
    cell: (info) => (
      <span className="text-word-primary font-medium">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    enableSorting: false,
    cell: (info) => <span className="text-word-secondary">{info.getValue()}</span>,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    enableSorting: false,
    meta: { width: "6rem" },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: false,
    meta: { width: "6rem" },
    cell: (info) => (
      <Badge intent={statusIntent[info.getValue()]}>{info.getValue()}</Badge>
    ),
  }),
  columnHelper.accessor("department", {
    header: "Department",
    enableSorting: false,
  }),
  columnHelper.accessor("location", {
    header: "Location",
    enableSorting: false,
  }),
]

const VISIBILITY_TOGGLES = ["email", "role", "status", "department", "location"] as const

export const WithColumnVisibility: Story = {
  render: function Render() {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
      department: false,
      location: false,
    })

    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-word-secondary text-sm font-medium">Toggle columns:</span>
          {VISIBILITY_TOGGLES.map((col) => (
            <label key={col} className="flex items-center gap-1.5">
              <Checkbox
                size="sm"
                checked={columnVisibility[col] !== false}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, [col]: !!checked }))
                }
              />
              <span className="text-word-primary text-sm capitalize">{col}</span>
            </label>
          ))}
        </div>
        <DataGrid
          columns={visibilityColumns}
          data={USERS.slice(0, 6)}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          getRowId={(row) => row.id}
        />
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// KitchenSink
// ---------------------------------------------------------------------------

const kitchenSinkColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    size: 180,
    cell: (info) => (
      <span className="text-word-primary font-medium">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    size: 220,
    cell: (info) => <span className="text-word-secondary">{info.getValue()}</span>,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    size: 120,
    enableSorting: false,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    size: 120,
    enableSorting: false,
    cell: (info) => (
      <Badge intent={statusIntent[info.getValue()]}>{info.getValue()}</Badge>
    ),
  }),
  columnHelper.accessor("department", {
    header: "Department",
    size: 160,
    enableSorting: false,
  }),
  columnHelper.accessor("location", {
    header: "Location",
    size: 180,
    enableSorting: false,
  }),
  columnHelper.accessor("joinDate", {
    header: "Joined",
    size: 120,
    enableSorting: false,
  }),
  columnHelper.accessor("lastActive", {
    header: "Last active",
    size: 150,
    enableSorting: false,
  }),
  columnHelper.accessor("projects", {
    header: "Projects",
    size: 100,
    enableSorting: false,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    meta: { actions: true },
    cell: () => (
      <div className="flex items-center justify-center">
        <IconButton
          size="sm"
          intent="ghost"
          shape="circle"
          icon="more-horizontal-outline"
          aria-label="Actions"
        />
      </div>
    ),
  }),
]

const KITCHEN_SINK_TOGGLEABLE = [
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "status", label: "Status" },
  { id: "department", label: "Department" },
  { id: "location", label: "Location" },
  { id: "joinDate", label: "Joined" },
  { id: "lastActive", label: "Last active" },
  { id: "projects", label: "Projects" },
] as const

const KITCHEN_SINK_PINNABLE = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "status", label: "Status" },
] as const

const ROLE_OPTIONS = [
  { label: "All roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
]

const STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
]

export const KitchenSink: Story = {
  render: function Render() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
      left: ["name"],
      right: [],
    })

    const togglePin = (columnId: string, side: "left" | "right") => {
      setColumnPinning((prev) => {
        const isAlreadyPinned = prev[side]?.includes(columnId)
        if (isAlreadyPinned) {
          return {
            ...prev,
            [side]: (prev[side] ?? []).filter((id) => id !== columnId),
          }
        }
        const otherSide = side === "left" ? "right" : "left"
        return {
          [otherSide]: (prev[otherSide] ?? []).filter((id) => id !== columnId),
          [side]: [...(prev[side] ?? []), columnId],
        }
      })
    }

    const sorted = [...USERS].sort((a, b) => {
      if (sorting.length === 0) return 0
      const { id, desc } = sorting[0]
      const col = id as keyof (typeof USERS)[0]
      const valA = String(a[col])
      const valB = String(b[col])
      const cmp = valA.localeCompare(valB)
      return desc ? -cmp : cmp
    })

    const total = sorted.length
    const pageEnd = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const visible = sorted.slice(start, start + limit)

    return (
      <div className="mx-auto w-full max-w-7xl">
        <DataTableToolbar
          search={<Input type="search" placeholder="Search users" />}
          filter={
            <Select aria-label="Role filter" items={ROLE_OPTIONS} placeholder="Role" />
          }
          sort={
            <Select
              aria-label="Status filter"
              items={STATUS_OPTIONS}
              placeholder="Status"
            />
          }
          action={
            <div className="flex items-center gap-2">
              <Dropdown>
                <Dropdown.Trigger asChild>
                  <Button intent="secondary" leftIcon="settings-outline">
                    Columns
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Content align="end">
                  {KITCHEN_SINK_TOGGLEABLE.map((col) => (
                    <Dropdown.CheckboxItem
                      key={col.id}
                      checked={columnVisibility[col.id] !== false}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({ ...prev, [col.id]: !!checked }))
                      }
                    >
                      {col.label}
                    </Dropdown.CheckboxItem>
                  ))}
                </Dropdown.Content>
              </Dropdown>
              <Dropdown>
                <Dropdown.Trigger asChild>
                  <Button intent="secondary" leftIcon="pin-outline">
                    Pin
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Content align="end">
                  <Dropdown.Label>Pin left</Dropdown.Label>
                  {KITCHEN_SINK_PINNABLE.map((col) => (
                    <Dropdown.CheckboxItem
                      key={`left-${col.id}`}
                      checked={columnPinning.left?.includes(col.id)}
                      onCheckedChange={() => togglePin(col.id, "left")}
                    >
                      {col.label}
                    </Dropdown.CheckboxItem>
                  ))}
                  <Dropdown.Separator />
                  <Dropdown.Label>Pin right</Dropdown.Label>
                  {KITCHEN_SINK_PINNABLE.map((col) => (
                    <Dropdown.CheckboxItem
                      key={`right-${col.id}`}
                      checked={columnPinning.right?.includes(col.id)}
                      onCheckedChange={() => togglePin(col.id, "right")}
                    >
                      {col.label}
                    </Dropdown.CheckboxItem>
                  ))}
                </Dropdown.Content>
              </Dropdown>
              <Button leftIcon="plus-outline" intent="primary">
                Add user
              </Button>
            </div>
          }
        >
          <DataGrid
            columns={kitchenSinkColumns}
            data={visible}
            spacing="cozy"
            sorting={sorting}
            onSortingChange={setSorting}
            manualSorting={false}
            pagination={{
              count: total,
              page,
              limit,
              hasNextPage: page < pageEnd,
              hasPreviousPage: page > 1,
            }}
            onPageChange={setPage}
            onLimitChange={(v) => {
              setLimit(v)
              setPage(1)
            }}
            limitOptions={[5, 10]}
            enableRowExpansion
            renderRowDetail={(row) => <UserDetail user={row.original} />}
            getRowHref={(row) => `#/users/${row.original.id}`}
            getRowId={(row) => row.id}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            columnPinning={columnPinning}
            onColumnPinningChange={setColumnPinning}
          />
        </DataTableToolbar>
      </div>
    )
  },
}
