import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge intent="secondary">Secondary</Badge>
      <Badge intent="success">Success</Badge>
      <Badge intent="warning">Warning</Badge>
      <Badge intent="info">Info</Badge>
      <Badge intent="danger">Danger</Badge>
      <Badge intent="primary">Primary</Badge>
      <Badge intent="beta">Beta</Badge>
      <Badge intent="slate">Slate</Badge>
      <Badge intent="pro">Pro</Badge>
      <Badge intent="add-on">Add-on</Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Badge intent="secondary" size="sm">
          Small
        </Badge>
        <Badge intent="success" size="sm">
          Small
        </Badge>
        <Badge intent="primary" size="sm">
          Small
        </Badge>
        <Badge intent="slate" size="sm">
          Small
        </Badge>
        <Badge intent="pro" size="sm">
          Small
        </Badge>
        <Badge intent="beta" size="sm">
          Small
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge intent="secondary" size="md">
          Medium
        </Badge>
        <Badge intent="success" size="md">
          Medium
        </Badge>
        <Badge intent="primary" size="md">
          Medium
        </Badge>
        <Badge intent="slate" size="md">
          Medium
        </Badge>
        <Badge intent="pro" size="md">
          Medium
        </Badge>
        <Badge intent="beta" size="md">
          Medium
        </Badge>
      </div>
    </div>
  ),
}
