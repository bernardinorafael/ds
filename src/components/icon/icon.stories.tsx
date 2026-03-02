import type { Meta, StoryObj } from "@storybook/react-vite"

import { Icon, IconSprite } from "@/components/icon"
import { ICON_NAMES } from "@/components/icon/icons"

const meta = {
  title: "Icon",
  component: Icon,
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
    name: "circle-info-outline",
    size: "md",
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {ICON_NAMES.map((name) => (
        <div key={name} className="flex items-center gap-4">
          <Icon name={name} size="sm" />
          <Icon name={name} size="md" />
          <Icon name={name} size="lg" />
          <span className="text-word-secondary text-sm">{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <span className="text-gray-900">
        <Icon name="circle-info-outline" size="md" />
      </span>
      <span className="text-primary">
        <Icon name="circle-info-outline" size="md" />
      </span>
      <span className="text-green-900">
        <Icon name="circle-info-outline" size="md" />
      </span>
      <span className="text-orange-900">
        <Icon name="circle-info-outline" size="md" />
      </span>
      <span className="text-destructive">
        <Icon name="circle-info-outline" size="md" />
      </span>
    </div>
  ),
}
