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

// --- Variants ---

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
}

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
}

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
}

export const Info: Story = {
  args: {
    variant: "info",
    children: "Info",
  },
}

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger",
  },
}

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary",
  },
}

export const Beta: Story = {
  args: {
    variant: "beta",
    children: "Beta",
  },
}

export const Slate: Story = {
  args: {
    variant: "slate",
    children: "Slate",
  },
}

export const Pro: Story = {
  args: {
    variant: "pro",
    children: "Pro",
  },
}

export const AddOn: Story = {
  args: {
    variant: "add-on",
    children: "Add-on",
  },
}
