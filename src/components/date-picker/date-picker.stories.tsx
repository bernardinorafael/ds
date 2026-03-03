import { useState } from "react"

import { getLocalTimeZone, today, type DateValue } from "@internationalized/date"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { DatePicker } from "@/components/date-picker"
import { IconSprite } from "@/components/icon"
import { Provider } from "@/components/provider"

const meta: Meta = {
  title: "DatePicker",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider>
        <IconSprite />
        <div className="w-64">
          <Story />
        </div>
      </Provider>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<DateValue | null>(null)
    return <DatePicker value={value} onChange={setValue} label="Start date" />
  },
}

export const WithDefaultValue: Story = {
  render: () => (
    <DatePicker defaultValue={today(getLocalTimeZone())} label="Event date" />
  ),
}

export const WithMinMax: Story = {
  render: () => {
    const now = today(getLocalTimeZone())
    return (
      <DatePicker
        minValue={now.subtract({ days: 30 })}
        maxValue={now.add({ days: 30 })}
        label="Booking date"
      />
    )
  },
}

export const InvalidState: Story = {
  render: () => <DatePicker isInvalid label="Invalid date" />,
}

export const DisabledState: Story = {
  render: () => (
    <DatePicker isDisabled defaultValue={today(getLocalTimeZone())} label="Disabled" />
  ),
}

export const InputOnly: Story = {
  render: () => {
    const [value, setValue] = useState<DateValue | null>(null)
    return <DatePicker value={value} onChange={setValue} inputOnly label="Birth date" />
  },
}

export const LocalePtBR: Story = {
  render: () => {
    const [value, setValue] = useState<DateValue | null>(null)
    return (
      <DatePicker
        value={value}
        onChange={setValue}
        locale="pt-BR"
        label="Data de início"
      />
    )
  },
}
