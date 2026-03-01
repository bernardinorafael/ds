import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { DataTable, useSortState } from "@/components/data-table"
import { IconButton } from "@/components/icon-button"
import { Provider } from "@/components/provider"

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

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Basic: Story = {
  render: () => (
    <DataTable>
      <DataTable.Head>
        <DataTable.Header>Name</DataTable.Header>
        <DataTable.Header width="6rem">Role</DataTable.Header>
        <DataTable.Header width="6rem">Status</DataTable.Header>
        <DataTable.Header width="4rem" srOnly>
          Actions
        </DataTable.Header>
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
            <DataTable.Cell flushRight>
              <DataTable.Actions>
                <IconButton
                  icon="more-horizontal"
                  size="sm"
                  intent="ghost"
                  aria-label="More options"
                />
              </DataTable.Actions>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable.Body>
    </DataTable>
  ),
}

export const Compact: Story = {
  render: () => (
    <DataTable spacing="compact">
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
          limitOptions={[10, 25, 50]}
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
        const cmp = a[col].localeCompare(b[col])
        return sort.direction === "asc" ? cmp : -cmp
      })

      return (
        <DataTable>
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
