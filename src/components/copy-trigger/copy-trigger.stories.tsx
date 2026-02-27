import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { CopyTrigger } from "@/components/copy-trigger"

const meta = {
  title: "CopyTrigger",
  component: CopyTrigger,
  tags: ["autodocs"],
  args: {
    text: "Hello, world!",
    children: "Copy",
  },
} satisfies Meta<typeof CopyTrigger>

export default meta

type Story = StoryObj<typeof meta>

export const WithButton: Story = {
  render: () => (
    <CopyTrigger text="some-api-key-1234">
      <Button size="sm" intent="secondary">
        Copy API key
      </Button>
    </CopyTrigger>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <CopyTrigger text="user@example.com">
      <Badge intent="info">user@example.com</Badge>
    </CopyTrigger>
  ),
}

export const WithText: Story = {
  render: () => (
    <CopyTrigger text="abc-123-def">
      <span className="text-foreground text-sm underline decoration-dotted underline-offset-2">
        abc-123-def
      </span>
    </CopyTrigger>
  ),
}
