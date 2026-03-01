import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table-toolbar"
import { Input } from "@/components/input"
import { Provider } from "@/components/provider"
import { Select } from "@/components/select"

const meta = {
  title: "DataTable/Toolbar",
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

const USERS = [
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

function UsersTable() {
  return (
    <DataTable>
      <DataTable.Head>
        <DataTable.Header>Name</DataTable.Header>
        <DataTable.Header width="6rem">Role</DataTable.Header>
        <DataTable.Header width="6rem">Status</DataTable.Header>
      </DataTable.Head>
      <DataTable.Body>
        {USERS.map((user) => (
          <DataTable.Row key={user.id}>
            <DataTable.Cell>
              <div className="flex flex-col gap-0.5">
                <span className="text-word-primary font-medium">{user.name}</span>
                <span className="text-word-secondary text-sm">{user.email}</span>
              </div>
            </DataTable.Cell>
            <DataTable.Cell>{user.role}</DataTable.Cell>
            <DataTable.Cell>
              <Badge intent={statusIntent[user.status as keyof typeof statusIntent]}>
                {user.status}
              </Badge>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable.Body>
    </DataTable>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const SearchOnly: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DataTableToolbar search={<Input type="search" placeholder="Search users" />}>
      <UsersTable />
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
      <UsersTable />
    </DataTableToolbar>
  ),
}
