import type { Meta, StoryObj } from "@storybook/react-vite"

import { Icon, IconSprite, type IconName } from "@/components/icon"

const ALL_ICONS: IconName[] = ["info"]

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
    name: "info",
    size: "base",
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {ALL_ICONS.map((name) => (
        <div key={name} className="flex items-center gap-4">
          <Icon name={name} size="sm" />
          <Icon name={name} size="base" />
          <span className="text-word-secondary text-sm">{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Icon name="info" className="text-gray-900" size="base" />
      <Icon name="info" className="text-primary" size="base" />
      <Icon name="info" className="text-green-900" size="base" />
      <Icon name="info" className="text-orange-900" size="base" />
      <Icon name="info" className="text-destructive" size="base" />
    </div>
  ),
}
