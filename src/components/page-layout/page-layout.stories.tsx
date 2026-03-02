import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { IconSprite } from "@/components/icon"
import { PageLayout } from "@/components/page-layout"

const meta = {
  title: "PageLayout",
  component: PageLayout,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof PageLayout>

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {
  render: () => (
    <PageLayout title="Users">
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <PageLayout title="Users" description="Manage your team members and their roles.">
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithActions: Story = {
  render: () => (
    <PageLayout
      title="Users"
      description="Manage your team members and their roles."
      actions={
        <>
          <Button intent="secondary">Export</Button>
          <Button intent="primary" leftIcon="plus-outline">
            Add User
          </Button>
        </>
      }
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithTitleBadge: Story = {
  render: () => (
    <PageLayout
      title="Users"
      titleBadge={
        <Badge intent="pro" size="sm">
          Pro
        </Badge>
      }
      description="Manage your team members and their roles."
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <PageLayout
      title="Users"
      description="Manage your team members and their roles."
      badges={
        <>
          <Badge intent="success" size="sm">
            Active: 12
          </Badge>
          <Badge intent="secondary" size="sm">
            Inactive: 3
          </Badge>
        </>
      }
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithBackAction: Story = {
  render: () => (
    <PageLayout
      title="User Details"
      description="View and edit user information."
      backAction={
        <Button intent="ghost" size="sm" leftIcon="arrow-left-outline">
          Back
        </Button>
      }
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const KitchenSink: Story = {
  render: () => (
    <PageLayout
      title="Team Members"
      titleBadge={
        <Badge intent="pro" size="sm">
          Pro
        </Badge>
      }
      description="Manage your organization's team members."
      badges={
        <>
          <Badge intent="success" size="sm">
            Active: 12
          </Badge>
          <Badge intent="secondary" size="sm">
            Invited: 5
          </Badge>
          <Badge intent="danger" size="sm">
            Suspended: 1
          </Badge>
        </>
      }
      afterDescription={
        <p className="text-sm text-word-tertiary">Last updated 2 hours ago</p>
      }
      actions={
        <>
          <Button intent="secondary">Export</Button>
          <Button intent="primary" leftIcon="plus-outline">
            Invite Member
          </Button>
        </>
      }
      backAction={
        <Button intent="ghost" size="sm" leftIcon="arrow-left-outline">
          Back
        </Button>
      }
    >
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-400">
        <p className="text-word-tertiary">Page content area</p>
      </div>
    </PageLayout>
  ),
}

export const BodyOnly: Story = {
  render: () => (
    <PageLayout>
      <p className="text-word-secondary">
        No header rendered — just the body content.
      </p>
    </PageLayout>
  ),
}
