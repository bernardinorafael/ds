import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Tooltip, TooltipProvider } from "@/components/tooltip"

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    label: "Tooltip",
    children: <Button intent="secondary">Hover me</Button>,
  },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Sides: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-12">
      <Tooltip label="Top" side="top">
        <Button size="sm" intent="secondary">
          Top
        </Button>
      </Tooltip>
      <Tooltip label="Right" side="right">
        <Button size="sm" intent="secondary">
          Right
        </Button>
      </Tooltip>
      <Tooltip label="Bottom" side="bottom">
        <Button size="sm" intent="secondary">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip label="Left" side="left">
        <Button size="sm" intent="secondary">
          Left
        </Button>
      </Tooltip>
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <div className="p-12">
      <Tooltip label="Click to view details">
        <Badge size="md" intent="info">
          3 pending
        </Badge>
      </Tooltip>
    </div>
  ),
}

export const LongContent: Story = {
  render: () => (
    <div className="p-12">
      <Tooltip label="aute esse sit proident eiusmod ex nulla sunt cupidatat sunt laborum officia quis velit nisi enim nostrud aliqua sint occaecat elit dolore pariatur deserunt non duis ullamco voluptate pariatur amet">
        <Button size="sm" intent="secondary">
          Long tooltip
        </Button>
      </Tooltip>
    </div>
  ),
}

export const SkipDelay: Story = {
  render: () => (
    <div className="p-12">
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip label="Bold">
            <Button size="sm" intent="secondary">
              B
            </Button>
          </Tooltip>
          <Tooltip label="Italic">
            <Button size="sm" intent="secondary">
              I
            </Button>
          </Tooltip>
          <Tooltip label="Underline">
            <Button size="sm" intent="secondary">
              U
            </Button>
          </Tooltip>
          <Tooltip label="Strikethrough">
            <Button size="sm" intent="secondary">
              S
            </Button>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  ),
}
