import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { IconSprite } from "@/components/icon"
import { TooltipProvider } from "@/components/tooltip"

const meta = {
  title: "Button",
  component: Button,
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
    children: "Button",
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

const INTENTS = ["primary", "secondary", "danger", "ghost"] as const

export const Intents: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {INTENTS.map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <Button intent={intent}>{intent}</Button>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {INTENTS.map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <div className="flex items-center gap-2">
            <Button intent={intent} size="sm">
              Small
            </Button>
            <Button intent={intent} size="md">
              Medium
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {INTENTS.map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <div className="flex items-center gap-2">
            <Button isLoading intent={intent} size="sm">
              Small
            </Button>
            <Button isLoading intent={intent} size="md">
              Medium
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {INTENTS.map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <div className="flex items-center gap-2">
            <Button disabled intent={intent} size="sm">
              Small
            </Button>
            <Button disabled intent={intent} size="md">
              Medium
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {INTENTS.map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <div className="flex items-center gap-2">
            <Button intent={intent} leftIcon="plus-outline">
              Create
            </Button>
            <Button intent={intent} rightIcon="arrow-right-outline">
              Next
            </Button>
            <Button intent={intent} leftIcon="arrow-left-outline" rightIcon="arrow-right-outline">
              Navigate
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const WithTooltip: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {INTENTS.map((intent) => (
        <div key={intent} className="flex items-center gap-3">
          <span className="text-word-secondary w-20 text-sm">{intent}</span>
          <div className="flex items-center gap-2">
            <Button intent={intent} size="sm" tooltip="Tooltip label">
              Small
            </Button>
            <Button intent={intent} size="md" tooltip="Tooltip label">
              Medium
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
}

export default meta
