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
    <div className="flex flex-col gap-8">
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

      <div className="flex items-center gap-6">
        <span className="text-gray-900">
          <Icon name="heart-fill" size="md" />
        </span>
        <span className="text-red-1000">
          <Icon name="heart-fill" size="md" />
        </span>
        <span className="text-primary">
          <Icon name="star-fill" size="md" />
        </span>
        <span className="text-yellow-900">
          <Icon name="star-fill" size="md" />
        </span>
        <span className="text-green-900">
          <Icon name="shield-check-fill" size="md" />
        </span>
        <span className="text-blue-900">
          <Icon name="gem-fill" size="md" />
        </span>
        <span className="text-purple-900">
          <Icon name="rocket-fill" size="md" />
        </span>
        <span className="text-orange-900">
          <Icon name="flame-fill" size="md" />
        </span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-green-1000">
          <Icon name="circle-info-fill" size="md" />
        </span>
        <span className="text-orange-1000">
          <Icon name="bell-fill" size="md" />
        </span>
        <span className="text-destructive">
          <Icon name="bug-fill" size="md" />
        </span>
        <span className="text-sky-900">
          <Icon name="earth-fill" size="md" />
        </span>
        <span className="text-purple-1000">
          <Icon name="wand-fill" size="md" />
        </span>
        <span className="text-primary">
          <Icon name="bolt-fill" size="md" />
        </span>
      </div>
    </div>
  ),
}
