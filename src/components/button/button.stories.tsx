import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

// --- Variants ---
export const Primary: Story = {
  args: {
    variant: "primary",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
}

export default meta
