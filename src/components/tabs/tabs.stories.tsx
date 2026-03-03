import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Tabs } from "@/components/tabs"
import { TooltipProvider } from "@/components/tooltip"

const meta = {
  title: "Tabs",
  component: Tabs,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <p className="mb-3 text-sm font-medium text-word-secondary">Size: sm</p>
        <Tabs defaultValue="general" size="sm">
          <Tabs.List>
            <Tabs.Trigger value="general">General</Tabs.Trigger>
            <Tabs.Trigger value="security">Security</Tabs.Trigger>
            <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="general">
            <div className="py-4 text-base text-word-primary">General settings content</div>
          </Tabs.Content>
          <Tabs.Content value="security">
            <div className="py-4 text-base text-word-primary">Security settings content</div>
          </Tabs.Content>
          <Tabs.Content value="billing">
            <div className="py-4 text-base text-word-primary">Billing settings content</div>
          </Tabs.Content>
        </Tabs>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-word-secondary">Size: md (default)</p>
        <Tabs defaultValue="general" size="md">
          <Tabs.List>
            <Tabs.Trigger value="general">General</Tabs.Trigger>
            <Tabs.Trigger value="security">Security</Tabs.Trigger>
            <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="general">
            <div className="py-4 text-base text-word-primary">General settings content</div>
          </Tabs.Content>
          <Tabs.Content value="security">
            <div className="py-4 text-base text-word-primary">Security settings content</div>
          </Tabs.Content>
          <Tabs.Content value="billing">
            <div className="py-4 text-base text-word-primary">Billing settings content</div>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="inbox">
      <Tabs.List>
        <Tabs.Trigger value="inbox">
          Inbox
          <Badge intent="primary" size="sm">
            12
          </Badge>
        </Tabs.Trigger>
        <Tabs.Trigger value="drafts">
          Drafts
          <Badge intent="secondary" size="sm">
            3
          </Badge>
        </Tabs.Trigger>
        <Tabs.Trigger value="sent">Sent</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="inbox">
        <div className="py-4 text-base text-word-primary">Inbox messages</div>
      </Tabs.Content>
      <Tabs.Content value="drafts">
        <div className="py-4 text-base text-word-primary">Draft messages</div>
      </Tabs.Content>
      <Tabs.Content value="sent">
        <div className="py-4 text-base text-word-primary">Sent messages</div>
      </Tabs.Content>
    </Tabs>
  ),
}

export const DisabledWithTooltip: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <Tabs.List>
        <Tabs.Trigger value="active">Active</Tabs.Trigger>
        <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
        <Tabs.Trigger value="archived" disabled tooltip="Archived items are read-only">
          Archived
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="active">
        <div className="py-4 text-base text-word-primary">Active items</div>
      </Tabs.Content>
      <Tabs.Content value="pending">
        <div className="py-4 text-base text-word-primary">Pending items</div>
      </Tabs.Content>
      <Tabs.Content value="archived">
        <div className="py-4 text-base text-word-primary">Archived items</div>
      </Tabs.Content>
    </Tabs>
  ),
}

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState("overview")
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-word-secondary">
            Active tab: <span className="font-medium text-word-primary">{value}</span>
          </p>
          <Tabs value={value} onValueChange={setValue}>
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
              <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview">
              <div className="py-4 text-base text-word-primary">Overview content</div>
            </Tabs.Content>
            <Tabs.Content value="analytics">
              <div className="py-4 text-base text-word-primary">Analytics content</div>
            </Tabs.Content>
            <Tabs.Content value="reports">
              <div className="py-4 text-base text-word-primary">Reports content</div>
            </Tabs.Content>
          </Tabs>
        </div>
      )
    }
    return <Demo />
  },
}
