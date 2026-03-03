import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Breadcrumb } from "@/components/breadcrumb"
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
    <PageLayout title="Users" description="Manage your team members and their roles">
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithActions: Story = {
  render: () => (
    <PageLayout
      title="Users"
      description="Manage your team members and their roles"
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
      description="Manage your team members and their roles"
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithBackAction: Story = {
  render: () => (
    <PageLayout
      title="User details"
      description="View and edit user information"
      backAction={
        <Button intent="link-underline" size="sm" leftIcon="chevron-left-outline">
          Back
        </Button>
      }
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithBreadcrumb: Story = {
  render: () => (
    <PageLayout
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Link href="#">Users</Breadcrumb.Link>
          <Breadcrumb.Page>John Doe</Breadcrumb.Page>
        </Breadcrumb>
      }
      title="John Doe"
      description="View and edit user information"
      actions={
        <Button intent="primary" leftIcon="edit-outline">
          Edit
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
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Link href="#">Organization</Breadcrumb.Link>
          <Breadcrumb.Link href="#">Team</Breadcrumb.Link>
          <Breadcrumb.Page>Team members</Breadcrumb.Page>
        </Breadcrumb>
      }
      title="Team members"
      titleBadge={
        <Badge intent="pro" size="sm">
          Pro
        </Badge>
      }
      description="Manage your organization's team members"
      afterDescription={
        <p className="text-word-tertiary text-sm">Last updated 2 hours ago</p>
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
        <Button intent="link-underline" size="sm" leftIcon="chevron-left-outline">
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
