import type { Meta, StoryObj } from "@storybook/react-vite"

import { Icon, IconSprite, type IconName } from "@/components/icon"

const ALL_ICONS: IconName[] = [
  "info",
  "x",
  "house",
  "house-off",
  "like",
  "dislike",
  "email",
  "email-check",
  "email-question-mark",
  "email-x",
  "at",
  "search",
  "menu",
  "chevron-up",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "arrow-up",
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "map-pin",
  "edit",
  "trash",
  "download",
  "upload",
  "copy",
  "share",
  "refresh",
  "plus",
  "minus",
  "filter",
  "bell",
  "alert-circle",
  "check",
  "check-circle",
  "alert-triangle",
  "eye",
  "eye-off",
  "lock",
  "clock",
  "heart",
  "star",
  "bookmark",
  "flag",
  "link",
  "external-link",
  "clipboard",
  "file",
  "folder",
  "grid",
  "list",
  "more-vertical",
  "more-horizontal",
  "undo",
  "redo",
  "maximize",
  "minimize",
  "zoom-in",
  "zoom-out",
  "pause",
  "play",
  "zap",
  "calendar",
  "user",
  "message",
  "phone",
  "help-circle",
  "settings",
  "activity",
  "trending-up",
  "send",
  "inbox",
  "archive",
  "repeat",
]

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
    size: "md",
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
        <Icon name="house" size="md" />
      </span>
      <span className="text-primary">
        <Icon name="house" size="md" />
      </span>
      <span className="text-green-900">
        <Icon name="house" size="md" />
      </span>
      <span className="text-orange-900">
        <Icon name="house" size="md" />
      </span>
      <span className="text-destructive">
        <Icon name="house" size="md" />
      </span>
    </div>
  ),
}
