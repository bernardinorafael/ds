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
