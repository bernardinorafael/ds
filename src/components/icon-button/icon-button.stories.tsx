import type { Meta, StoryObj } from "@storybook/react-vite"

import { IconSprite } from "@/components/icon"
import { TooltipProvider } from "@/components/tooltip"

import { IconButton } from "./icon-button"

const meta = {
  title: "IconButton",
  component: IconButton,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <IconSprite />
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    icon: "trash",
    "aria-label": "Delete",
  },
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["ghost", "secondary", "primary", "danger"] as const).map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <div className="flex items-center gap-1.5">
            <IconButton icon="trash" aria-label="Delete" intent={intent} size="sm" />
            <IconButton icon="trash" aria-label="Delete" intent={intent} size="md" />
          </div>
          <div className="flex items-center gap-1.5">
            <IconButton
              icon="trash"
              aria-label="Delete"
              intent={intent}
              size="sm"
              shape="circle"
            />
            <IconButton
              icon="trash"
              aria-label="Delete"
              intent={intent}
              size="md"
              shape="circle"
            />
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["ghost", "secondary", "primary", "danger"] as const).map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <div className="flex items-center gap-3">
            {(["square", "circle"] as const).map((shape) => (
              <div key={shape} className="flex items-center gap-1.5">
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  intent={intent}
                  shape={shape}
                  size="sm"
                />
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  intent={intent}
                  shape={shape}
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["ghost", "secondary", "primary", "danger"] as const).map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <div className="flex items-center gap-3">
            {(["sm", "md"] as const).map((size) => (
              <div key={size} className="flex items-center gap-1.5">
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  intent={intent}
                  size={size}
                />
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  intent={intent}
                  size={size}
                  disabled
                />
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  intent={intent}
                  size={size}
                  shape="circle"
                />
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  intent={intent}
                  size={size}
                  shape="circle"
                  disabled
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["square", "circle"] as const).map((shape) => (
        <div key={shape} className="flex flex-col gap-2">
          <span className="text-word-secondary text-sm">{shape}</span>
          <div className="flex items-center gap-3">
            {(["ghost", "secondary", "primary", "danger"] as const).map((intent) => (
              <div key={intent} className="flex items-center gap-1.5">
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  {...{ shape, intent, size: "sm" }}
                />
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  {...{ shape, intent, size: "md" }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const WithTooltip: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      {(["square", "circle"] as const).map((shape) => (
        <div key={shape} className="flex flex-col gap-2">
          <span className="text-word-secondary text-sm">{shape}</span>
          <div className="flex items-center gap-3">
            {(["ghost", "secondary", "primary", "danger"] as const).map((intent) => (
              <div key={intent} className="flex items-center gap-1.5">
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  tooltip="Delete item"
                  {...{ shape, intent, size: "sm" }}
                />
                <IconButton
                  icon="trash"
                  aria-label="Delete"
                  tooltip="Delete item"
                  {...{ shape, intent, size: "md" }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}
