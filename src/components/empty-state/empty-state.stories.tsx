import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { EmptyState } from "@/components/empty-state"
import { IconSprite } from "@/components/icon"

const meta = {
  title: "EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "No items found",
  },
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const WithAction: Story = {
  render: () => (
    <EmptyState
      icon="inbox-outline"
      title="No products found for applied filters"
      description="You can try changing your filters or switching to test mode to expand your results. Otherwise, you can create a product."
    >
      <Button intent="primary" size="sm">
        Add a product
      </Button>
    </EmptyState>
  ),
}

export const WithoutAction: Story = {
  render: () => (
    <EmptyState
      icon="search-outline"
      title="No results found"
      description="Try adjusting your search or filter to find what you're looking for."
    />
  ),
}

export const TitleOnly: Story = {
  render: () => <EmptyState title="Nothing here yet" />,
}

export const MultipleActions: Story = {
  render: () => (
    <EmptyState
      icon="ufo-fill"
      title="No entries yet"
      description="Get started by creating your first entry or importing existing data."
    >
      <Button intent="primary" size="sm">
        Create entry
      </Button>
      <Button intent="secondary" size="sm">
        Import data
      </Button>
    </EmptyState>
  ),
}
