import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { createColumnHelper, DataGrid } from "@/components/data-grid"
import { DataTableToolbar } from "@/components/data-table-toolbar"
import { Input } from "@/components/input"
import { Provider } from "@/components/provider"
import { Select } from "@/components/select"

const meta = {
  title: "DataTableToolbar",
  component: DataTableToolbar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider>
        <div className="max-w-7xl">
          <Story />
        </div>
      </Provider>
    ),
  ],
} satisfies Meta<typeof DataTableToolbar>

export default meta

type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

type User = {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
}

const USERS: User[] = [
  {
    id: "u1",
    name: "Alice Martin",
    email: "alice@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "u2",
    name: "Bob Chen",
    email: "bob@example.com",
    role: "Editor",
    status: "active",
  },
  {
    id: "u3",
    name: "Carol White",
    email: "carol@example.com",
    role: "Viewer",
    status: "inactive",
  },
  {
    id: "u4",
    name: "David Kim",
    email: "david@example.com",
    role: "Editor",
    status: "active",
  },
  {
    id: "u5",
    name: "Eva Torres",
    email: "eva@example.com",
    role: "Admin",
    status: "pending",
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
      <div className="flex flex-col gap-0.5">
        <span className="text-word-primary font-medium">{info.getValue()}</span>
        <span className="text-word-secondary text-sm">{info.row.original.email}</span>
      </div>
    ),
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

const ROLE_OPTIONS = [
  { label: "All roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
]

const SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Role", value: "role" },
  { label: "Status", value: "status" },
]

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const SearchOnly: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DataTableToolbar search={<Input type="search" placeholder="Search users" />}>
      <DataGrid
        columns={columns}
        data={USERS}
        getRowId={(row) => row.id}
        aria-label="Users"
      />
    </DataTableToolbar>
  ),
}

export const AllSlots: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DataTableToolbar
      search={<Input type="search" placeholder="Search users" />}
      filter={<Select aria-label="Role filter" items={ROLE_OPTIONS} placeholder="Role" />}
      sort={<Select aria-label="Sort by" items={SORT_OPTIONS} placeholder="Sort" />}
      action={<Button intent="primary">Add user</Button>}
    >
      <DataGrid
        columns={columns}
        data={USERS}
        getRowId={(row) => row.id}
        aria-label="Users"
      />
    </DataTableToolbar>
  ),
}
