import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  DatePicker,
  DateRangePicker,
  Group,
  Label,
} from "react-aria-components"

import { IconSprite } from "@/components/icon"
import { Segment } from "@/components/segment"

const meta = {
  title: "Segment",
  component: Segment,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Segment>

export default meta
type Story = StoryObj<typeof meta>

export const SingleDate: Story = {
  render: () => (
    <DatePicker>
      <Label className="mb-2 block text-sm font-book text-gray-1100">
        Date
      </Label>
      <Group>
        <Segment />
      </Group>
    </DatePicker>
  ),
}

export const Invalid: Story = {
  render: () => (
    <DatePicker isInvalid>
      <Label className="mb-2 block text-sm font-book text-gray-1100">
        Invalid date
      </Label>
      <Group>
        <Segment isInvalid />
      </Group>
    </DatePicker>
  ),
}

export const RangeSegments: Story = {
  render: () => (
    <DateRangePicker>
      <Label className="mb-2 block text-sm font-book text-gray-1100">
        Date range
      </Label>
      <Group className="flex items-center gap-2">
        <Segment slot="start" />
        <span className="text-gray-700">&rarr;</span>
        <Segment slot="end" />
      </Group>
    </DateRangePicker>
  ),
}
