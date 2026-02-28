import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { IconSprite } from "@/components/icon"

const meta = {
  title: "Button",
  component: Button,
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
    children: "Button",
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button intent="primary">Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="danger">Danger</Button>
      <Button intent="ghost">Ghost</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button intent="primary" size="sm">
          Small
        </Button>
        <Button intent="primary" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button intent="secondary" size="sm">
          Small
        </Button>
        <Button intent="secondary" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button intent="danger" size="sm">
          Small
        </Button>
        <Button intent="danger" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button intent="ghost" size="sm">
          Small
        </Button>
        <Button intent="ghost" size="md">
          Medium
        </Button>
      </div>
    </div>
  ),
}

// --- States ---

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button isLoading intent="primary" size="sm">
          Small
        </Button>
        <Button isLoading intent="primary" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button isLoading intent="secondary" size="sm">
          Small
        </Button>
        <Button isLoading intent="secondary" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button isLoading intent="danger" size="sm">
          Small
        </Button>
        <Button isLoading intent="danger" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button isLoading intent="ghost" size="sm">
          Small
        </Button>
        <Button isLoading intent="ghost" size="md">
          Medium
        </Button>
      </div>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button intent="primary" leftIcon="plus">
          Create
        </Button>
        <Button intent="primary" rightIcon="arrow-right">
          Next
        </Button>
        <Button intent="primary" leftIcon="arrow-left" rightIcon="arrow-right">
          Navigate
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button intent="secondary" leftIcon="plus">
          Create
        </Button>
        <Button intent="secondary" rightIcon="arrow-right">
          Next
        </Button>
        <Button intent="secondary" leftIcon="arrow-left" rightIcon="arrow-right">
          Navigate
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button intent="danger" leftIcon="trash">
          Delete
        </Button>
        <Button intent="danger" rightIcon="arrow-right">
          Next
        </Button>
        <Button intent="danger" leftIcon="arrow-left" rightIcon="arrow-right">
          Navigate
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button intent="ghost" leftIcon="x">
          Close
        </Button>
        <Button intent="ghost" rightIcon="arrow-right">
          Next
        </Button>
        <Button intent="ghost" leftIcon="arrow-left" rightIcon="arrow-right">
          Navigate
        </Button>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button disabled intent="primary" size="sm">
          Small
        </Button>
        <Button disabled intent="primary" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button disabled intent="secondary" size="sm">
          Small
        </Button>
        <Button disabled intent="secondary" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button disabled intent="danger" size="sm">
          Small
        </Button>
        <Button disabled intent="danger" size="md">
          Medium
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button disabled intent="ghost" size="sm">
          Small
        </Button>
        <Button disabled intent="ghost" size="md">
          Medium
        </Button>
      </div>
    </div>
  ),
}

export default meta
