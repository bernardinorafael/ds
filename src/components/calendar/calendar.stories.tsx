import { useState } from "react"

import { getLocalTimeZone, today, type DateValue } from "@internationalized/date"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DateRange } from "react-aria-components"

import { Calendar } from "@/components/calendar"
import { IconSprite } from "@/components/icon"

const meta: Meta = {
  title: "Calendar",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <div className="w-69 rounded-3xl bg-white p-4 shadow-md ring-1 ring-black/10">
          <Story />
        </div>
      </>
    ),
  ],
}

export default meta
type Story = StoryObj

export const SingleSelection: Story = {
  render: () => {
    const [value, setValue] = useState<DateValue | null>(null)
    return (
      <Calendar value={value} onChange={setValue}>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
  },
}

export const RangeSelection: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null)
    return (
      <Calendar mode="range" value={value} onChange={setValue} scrollNavigation>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
  },
}

export const WithMinMax: Story = {
  render: () => {
    const now = today(getLocalTimeZone())
    return (
      <Calendar minValue={now.subtract({ days: 30 })} maxValue={now}>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <Calendar isDisabled>
      <Calendar.Header />
      <Calendar.Grid />
    </Calendar>
  ),
}

export const LocalePtBR: Story = {
  render: () => {
    const [value, setValue] = useState<DateValue | null>(null)
    return (
      <Calendar value={value} onChange={setValue} locale="pt-BR">
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
  },
}
