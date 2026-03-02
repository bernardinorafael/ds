import type { Meta, StoryObj } from "@storybook/react-vite"

import { Avatar } from "@/components/avatar"

const meta = {
  title: "Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    name: "Rafael Bernardino",
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar name="Rafael Bernardino" size="xs" />
      <Avatar name="Rafael Bernardino" size="sm" />
      <Avatar name="Rafael Bernardino" size="md" />
      <Avatar name="Rafael Bernardino" size="lg" />
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar
        name="Rafael Bernardino"
        src="https://i.pravatar.cc/96?u=rafael"
        size="xs"
      />
      <Avatar
        name="Rafael Bernardino"
        src="https://i.pravatar.cc/96?u=rafael"
        size="sm"
      />
      <Avatar
        name="Rafael Bernardino"
        src="https://i.pravatar.cc/96?u=rafael"
        size="md"
      />
      <Avatar
        name="Rafael Bernardino"
        src="https://i.pravatar.cc/96?u=rafael"
        size="lg"
      />
    </div>
  ),
}

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Avatar name="Online User" src="https://i.pravatar.cc/96?u=online" status="online" />
      <Avatar name="Offline User" src="https://i.pravatar.cc/96?u=offline" status="offline" />
      <Avatar name="Busy User" src="https://i.pravatar.cc/96?u=busy" status="busy" />
    </div>
  ),
}

export const StatusSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-4">
        <Avatar name="Online User" status="online" size="xs" />
        <Avatar name="Online User" status="online" size="sm" />
        <Avatar name="Online User" status="online" size="md" />
        <Avatar name="Online User" status="online" size="lg" />
      </div>
      <div className="flex items-end gap-4">
        <Avatar name="Busy User" status="busy" size="xs" />
        <Avatar name="Busy User" status="busy" size="sm" />
        <Avatar name="Busy User" status="busy" size="md" />
        <Avatar name="Busy User" status="busy" size="lg" />
      </div>
    </div>
  ),
}

export const FallbackInitials: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Rafael Bernardino" />
      <Avatar name="Ana" />
      <Avatar name="Carlos Eduardo Silva" />
    </div>
  ),
}
