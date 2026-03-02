import type { Meta, StoryObj } from "@storybook/react-vite"

import { Chip } from "@/components/chip"
import { IconSprite } from "@/components/icon"

const meta = {
  title: "Chip",
  component: Chip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
      </>
    ),
  ],
  args: {
    children: "Label",
  },
} satisfies Meta<typeof Chip>

export default meta

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip intent="secondary">Secondary</Chip>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Chip size="sm">Small</Chip>
        <Chip size="sm" icon="check-circle-outline">
          Small
        </Chip>
        <Chip size="sm" onRemove={() => {}}>
          Small
        </Chip>
        <Chip size="sm" icon="check-circle-outline" onRemove={() => {}}>
          Small
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip size="md">Medium</Chip>
        <Chip size="md" icon="check-circle-outline">
          Medium
        </Chip>
        <Chip size="md" onRemove={() => {}}>
          Medium
        </Chip>
        <Chip size="md" icon="check-circle-outline" onRemove={() => {}}>
          Medium
        </Chip>
      </div>
    </div>
  ),
}

export const Fonts: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Chip font="sans">Sans label</Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip font="mono">Mono label</Chip>
      </div>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip icon="check-circle-outline">Status</Chip>
      <Chip icon="bolt-outline">Active</Chip>
    </div>
  ),
}

export const Removable: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip onRemove={() => {}}>React</Chip>
      <Chip onRemove={() => {}} icon="circle-info-outline">
        Online
      </Chip>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip disabled>Disabled</Chip>
      <Chip disabled onRemove={() => {}}>
        Removable
      </Chip>
    </div>
  ),
}
