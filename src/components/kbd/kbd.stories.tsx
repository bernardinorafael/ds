import type { Meta, StoryObj } from "@storybook/react-vite"

import { Kbd } from "@/components/kbd"

const meta = {
  title: "Kbd",
  component: Kbd,
  tags: ["autodocs"],
  args: {
    children: "K",
  },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd intent="neutral">Ctrl</Kbd>
      <Kbd intent="danger">Delete</Kbd>
      <Kbd intent="primary">Enter</Kbd>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        <Kbd size="sm">Esc</Kbd>
        <Kbd size="sm">K</Kbd>
      </div>
      <div className="flex items-center gap-1">
        <Kbd size="base">Shift</Kbd>
        <Kbd size="base">K</Kbd>
      </div>
    </div>
  ),
}

export const Combos: Story = {
  render: () => (
    <div className="text-word-secondary flex flex-col gap-4 text-sm">
      <div className="flex flex-wrap items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>N</Kbd>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Kbd intent="danger">⌘</Kbd>
        <Kbd intent="danger">D</Kbd>
      </div>
    </div>
  ),
}
