import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import {
  DataTable,
  useRowExpansion,
  useRowSelection,
  useSortState,
} from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table-toolbar"
import { Icon } from "@/components/icon"
import { IconButton } from "@/components/icon-button"
import { Input } from "@/components/input"
import { Provider } from "@/components/provider"
import { Select } from "@/components/select"

const meta = {
  title: "DataTable",
  component: DataTable,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
  ],
  args: {
    children: null,
  },
} satisfies Meta<typeof DataTable>

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
    department: "Design",
    location: "San Francisco, US",
    joinDate: "Mar 2023",
    lastActive: "5 min ago",
    projects: 8,
  },
  {
    id: "u3",
    name: "Carol White",
    email: "carol@example.com",
    role: "Viewer",
    status: "inactive",
    department: "Marketing",
    location: "London, UK",
    joinDate: "Jun 2022",
    lastActive: "3 days ago",
    projects: 4,
  },
  {
    id: "u4",
    name: "David Kim",
    email: "david@example.com",
    role: "Editor",
    status: "active",
    department: "Product",
    location: "Seoul, KR",
    joinDate: "Nov 2023",
    lastActive: "1 hour ago",
    projects: 6,
  },
  {
    id: "u5",
    name: "Eva Torres",
    email: "eva@example.com",
    role: "Admin",
    status: "pending",
    department: "Engineering",
    location: "São Paulo, BR",
    joinDate: "Feb 2024",
    lastActive: "Just now",
    projects: 3,
  },
  {
    id: "u6",
    name: "Frank Müller",
    email: "frank@example.com",
    role: "Viewer",
    status: "active",
    department: "Support",
    location: "Berlin, DE",
    joinDate: "Apr 2023",
    lastActive: "30 min ago",
    projects: 5,
  },
  {
    id: "u7",
    name: "Grace Okafor",
    email: "grace@example.com",
    role: "Editor",
    status: "active",
    department: "Design",
    location: "Lagos, NG",
    joinDate: "Sep 2023",
    lastActive: "4 hours ago",
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
    lastActive: "10 min ago",
    projects: 15,
  },
  {
    id: "u9",
    name: "Isabel Reyes",
    email: "isabel@example.com",
    role: "Viewer",
    status: "inactive",
    department: "Marketing",
    location: "Mexico City, MX",
    joinDate: "Dec 2023",
    lastActive: "1 week ago",
    projects: 2,
  },
  {
    id: "u10",
    name: "James Wright",
    email: "james@example.com",
    role: "Editor",
    status: "pending",
    department: "Product",
    location: "Toronto, CA",
    joinDate: "Jan 2024",
    lastActive: "Yesterday",
    projects: 7,
  },
  {
    id: "u11",
    name: "Katya Ivanova",
    email: "katya@example.com",
    role: "Admin",
    status: "active",
    department: "Engineering",
    location: "Moscow, RU",
    joinDate: "Aug 2022",
    lastActive: "15 min ago",
    projects: 11,
  },
  {
    id: "u12",
    name: "Liam O'Brien",
    email: "liam@example.com",
    role: "Viewer",
    status: "active",
    department: "Support",
    location: "Dublin, IE",
    joinDate: "May 2023",
    lastActive: "3 hours ago",
    projects: 4,
  },
]

const statusIntent = {
  active: "success",
  inactive: "secondary",
  pending: "warning",
} as const

type IconName = React.ComponentProps<typeof Icon>["name"]

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: IconName
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="text-word-tertiary bg-surface-100 flex size-7 shrink-0 items-center justify-center rounded-md">
        <Icon name={icon} size="sm" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-word-tertiary text-xs leading-none">{label}</span>
        <span className="text-word-primary text-sm leading-none font-medium">
          {value}
        </span>
      </div>
    </div>
  )
}

function UserDetail({ user }: { user: (typeof USERS)[number] }) {
  return (
    <div className="flex flex-col gap-4 pb-1">
      <div className="flex items-center justify-between">
        <MetaItem icon="building-outline" label="Department" value={user.department} />
        <MetaItem icon="location-outline" label="Location" value={user.location} />
        <MetaItem icon="calendar-outline" label="Joined" value={user.joinDate} />
        <MetaItem icon="clock-outline" label="Last active" value={user.lastActive} />
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-word-secondary text-sm">
              {user.projects} active projects
            </span>
            <span className="text-word-tertiary">·</span>
            <Badge intent={statusIntent[user.status as keyof typeof statusIntent]}>
              {user.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <IconButton icon="users-outline" tooltip="Request friend" intent="ghost" />
            <IconButton icon="file-outline" tooltip="Attach file" intent="ghost" />
            <IconButton icon="email-outline" tooltip="Send e-mail" intent="ghost" />
            <IconButton icon="edit-outline" tooltip="Edit user" intent="ghost" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Compact: Story = {
  render: () => (
    <DataTable spacing="compact" className="max-w-5xl">
      <DataTable.Head>
        <DataTable.Header>Name</DataTable.Header>
        <DataTable.Header>Email</DataTable.Header>
        <DataTable.Header width="6rem">Role</DataTable.Header>
        <DataTable.Header width="6rem">Status</DataTable.Header>
      </DataTable.Head>
      <DataTable.Body>
        {USERS.map((user) => (
          <DataTable.Row key={user.id}>
            <DataTable.Cell className="text-word-primary font-medium">
              {user.name}
            </DataTable.Cell>
            <DataTable.Cell className="text-word-secondary">{user.email}</DataTable.Cell>
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
  ),
}

export const WithPagination: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState(1)
      const [limit, setLimit] = useState(10)

      const total = 127
      const pageEnd = Math.ceil(total / limit)
      const start = (page - 1) * limit
      const visibleUsers = Array.from(
        { length: Math.min(limit, total - start) },
        (_, i) => ({
          id: `u${start + i + 1}`,
          name: `User ${start + i + 1}`,
          email: `user${start + i + 1}@example.com`,
          role: ["Admin", "Editor", "Viewer"][i % 3],
          status: ["active", "inactive", "pending"][i % 3] as
            | "active"
            | "inactive"
            | "pending",
        })
      )

      return (
        <DataTable
          pagination={{
            count: total,
            page,
            limit,
            hasNextPage: page < pageEnd,
            hasPreviousPage: page > 1,
            onPageChange: setPage,
            onLimitChange: (v) => {
              setLimit(v)
              setPage(1)
            },
          }}
          limitOptions={[5, 10, 25, 50]}
          className="max-w-5xl"
        >
          <DataTable.Head>
            <DataTable.Header>Name</DataTable.Header>
            <DataTable.Header>Email</DataTable.Header>
            <DataTable.Header width="6rem">Role</DataTable.Header>
            <DataTable.Header width="6rem">Status</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            {visibleUsers.map((user) => (
              <DataTable.Row key={user.id}>
                <DataTable.Cell className="text-word-primary font-medium">
                  {user.name}
                </DataTable.Cell>
                <DataTable.Cell className="text-word-secondary">
                  {user.email}
                </DataTable.Cell>
                <DataTable.Cell>{user.role}</DataTable.Cell>
                <DataTable.Cell>
                  <Badge intent={statusIntent[user.status]}>{user.status}</Badge>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
        </DataTable>
      )
    }

    return <Demo />
  },
}

export const WithBulkBar: Story = {
  render: () => {
    const Demo = () => {
      const selection = useRowSelection(USERS, { key: "id" })

      return (
        <DataTable selection={selection} className="max-w-5xl">
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
            <DataTable.Header>Email</DataTable.Header>
            <DataTable.Header width="6rem">Role</DataTable.Header>
            <DataTable.Header width="6rem">Status</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            {USERS.map((user) => (
              <DataTable.Row key={user.id} rowId={user.id}>
                <DataTable.SelectCell />
                <DataTable.Cell>
                  <span className="text-word-primary font-medium">{user.name}</span>
                </DataTable.Cell>
                <DataTable.Cell>{user.email}</DataTable.Cell>
                <DataTable.Cell>{user.role}</DataTable.Cell>
                <DataTable.Cell>
                  <Badge intent={statusIntent[user.status as keyof typeof statusIntent]}>
                    {user.status}
                  </Badge>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
          <DataTable.BulkBar>
            <Button leftIcon="email-outline" intent="secondary" size="sm">
              Notify
            </Button>
            <Button leftIcon="check-circle-outline" intent="secondary" size="sm">
              Activate
            </Button>
            <Button leftIcon="trash-outline" intent="danger" size="sm">
              Delete
            </Button>
          </DataTable.BulkBar>
        </DataTable>
      )
    }

    return <Demo />
  },
}

export const WithSorting: Story = {
  render: () => {
    const Demo = () => {
      const { sort, directionFor, handleSort } = useSortState({
        column: "name",
        direction: "asc",
      })

      const sorted = [...USERS].sort((a, b) => {
        if (!sort) return 0
        const col = sort.column as keyof (typeof USERS)[0]
        const valA = String(a[col])
        const valB = String(b[col])
        const cmp = valA.localeCompare(valB)
        return sort.direction === "asc" ? cmp : -cmp
      })

      return (
        <DataTable className="max-w-5xl">
          <DataTable.Head>
            <DataTable.SortHeader
              direction={directionFor("name")}
              onSort={handleSort("name")}
            >
              Name
            </DataTable.SortHeader>
            <DataTable.SortHeader
              direction={directionFor("email")}
              onSort={handleSort("email")}
            >
              Email
            </DataTable.SortHeader>
            <DataTable.SortHeader
              width="6rem"
              direction={directionFor("role")}
              onSort={handleSort("role")}
            >
              Role
            </DataTable.SortHeader>
            <DataTable.Header width="6rem">Status</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            {sorted.map((user) => (
              <DataTable.Row key={user.id}>
                <DataTable.Cell className="text-word-primary font-medium">
                  {user.name}
                </DataTable.Cell>
                <DataTable.Cell className="text-word-secondary">
                  {user.email}
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

    return <Demo />
  },
}

export const ExpandableRows: Story = {
  render: () => {
    const Demo = () => {
      const expansion = useRowExpansion()

      return (
        <DataTable expansion={expansion} className="max-w-5xl">
          <DataTable.Head>
            <DataTable.Header>Name</DataTable.Header>
            <DataTable.Header>Email</DataTable.Header>
            <DataTable.Header width="6rem">Role</DataTable.Header>
            <DataTable.Header width="6rem">Status</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            {USERS.map((user) => (
              <DataTable.Row
                key={user.id}
                rowId={user.id}
                detail={<UserDetail user={user} />}
              >
                <DataTable.Cell>
                  <span className="text-word-primary font-medium">{user.name}</span>
                </DataTable.Cell>
                <DataTable.Cell className="text-word-secondary">
                  {user.email}
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

    return <Demo />
  },
}

export const ExpandableWithSelection: Story = {
  render: () => {
    const Demo = () => {
      const expansion = useRowExpansion()
      const selection = useRowSelection(USERS, { key: "id" })

      return (
        <DataTable expansion={expansion} selection={selection} className="max-w-5xl">
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
            <DataTable.Header>Email</DataTable.Header>
            <DataTable.Header width="6rem">Role</DataTable.Header>
            <DataTable.Header width="6rem">Status</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            {USERS.map((user) => (
              <DataTable.Row
                key={user.id}
                rowId={user.id}
                detail={<UserDetail user={user} />}
              >
                <DataTable.SelectCell />
                <DataTable.Cell>
                  <span className="text-word-primary font-medium">{user.name}</span>
                </DataTable.Cell>
                <DataTable.Cell className="text-word-secondary">
                  {user.email}
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
          <DataTable.BulkBar>
            <Button leftIcon="email-outline" intent="secondary" size="sm">
              Notify
            </Button>
            <Button leftIcon="check-circle-outline" intent="secondary" size="sm">
              Activate
            </Button>
            <Button leftIcon="trash-outline" intent="danger" size="sm">
              Delete
            </Button>
          </DataTable.BulkBar>
        </DataTable>
      )
    }

    return <Demo />
  },
}

export const WithRowLink: Story = {
  render: () => (
    <DataTable spacing="cozy">
      <DataTable.Head>
        <DataTable.Header width="40%">Name</DataTable.Header>
        <DataTable.Header>Email</DataTable.Header>
        <DataTable.Header>Role</DataTable.Header>
        <DataTable.Header width={48} srOnly>
          Actions
        </DataTable.Header>
      </DataTable.Head>
      <DataTable.Body>
        {USERS.slice(0, 5).map((user) => (
          <DataTable.Row key={user.id}>
            <DataTable.Cell>
              <DataTable.RowLink href={`#/users/${user.id}`}>
                {user.name}
              </DataTable.RowLink>
            </DataTable.Cell>
            <DataTable.Cell>{user.email}</DataTable.Cell>
            <DataTable.Cell>
              <Badge intent={user.role === "Admin" ? "primary" : "secondary"}>
                {user.role}
              </Badge>
            </DataTable.Cell>
            <DataTable.Cell flushRight>
              <DataTable.Actions>
                <IconButton
                  size="sm"
                  intent="ghost"
                  shape="circle"
                  icon="more-horizontal-outline"
                  aria-label="Actions"
                />
              </DataTable.Actions>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable.Body>
    </DataTable>
  ),
}

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

    const selection = useRowSelection(USERS, { key: "id" })
    const expansion = useRowExpansion()
    const { sort, directionFor, handleSort } = useSortState({
      column: "name",
      direction: "asc",
    })

    const sorted = [...USERS].sort((a, b) => {
      if (!sort) return 0
      const col = sort.column as keyof (typeof USERS)[0]
      const valA = String(a[col])
      const valB = String(b[col])
      const cmp = valA.localeCompare(valB)
      return sort.direction === "asc" ? cmp : -cmp
    })

    const total = sorted.length
    const pageEnd = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const visible = sorted.slice(start, start + limit)

    return (
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
        action={<Button intent="primary">Add user</Button>}
      >
        <DataTable
          spacing="cozy"
          selection={selection}
          expansion={expansion}
          pagination={{
            count: total,
            page,
            limit,
            hasNextPage: page < pageEnd,
            hasPreviousPage: page > 1,
            onPageChange: setPage,
            onLimitChange: (v) => {
              setLimit(v)
              setPage(1)
            },
          }}
          limitOptions={[5, 10, 25]}
        >
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.SortHeader
              width="30%"
              direction={directionFor("name")}
              onSort={handleSort("name")}
            >
              Name
            </DataTable.SortHeader>
            <DataTable.SortHeader
              direction={directionFor("email")}
              onSort={handleSort("email")}
            >
              Email
            </DataTable.SortHeader>
            <DataTable.Header width="6rem">Role</DataTable.Header>
            <DataTable.Header width="6rem">Status</DataTable.Header>
            <DataTable.Header width={48} srOnly>
              Actions
            </DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            {visible.map((user) => (
              <DataTable.Row
                key={user.id}
                rowId={user.id}
                detail={<UserDetail user={user} />}
              >
                <DataTable.SelectCell />
                <DataTable.Cell>
                  <DataTable.RowLink href={`#/users/${user.id}`}>
                    {user.name}
                  </DataTable.RowLink>
                </DataTable.Cell>
                <DataTable.Cell className="text-word-secondary">
                  {user.email}
                </DataTable.Cell>
                <DataTable.Cell>{user.role}</DataTable.Cell>
                <DataTable.Cell>
                  <Badge
                    intent={statusIntent[user.status as keyof typeof statusIntent]}
                  >
                    {user.status}
                  </Badge>
                </DataTable.Cell>
                <DataTable.Cell flushRight>
                  <DataTable.Actions>
                    <IconButton
                      size="sm"
                      intent="ghost"
                      shape="circle"
                      icon="more-horizontal-outline"
                      aria-label="Actions"
                    />
                  </DataTable.Actions>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
          <DataTable.BulkBar>
            <Button leftIcon="email-outline" intent="secondary" size="sm">
              Notify
            </Button>
            <Button leftIcon="check-circle-outline" intent="secondary" size="sm">
              Activate
            </Button>
            <Button leftIcon="trash-outline" intent="danger" size="sm">
              Delete
            </Button>
          </DataTable.BulkBar>
        </DataTable>
      </DataTableToolbar>
    )
  },
}
