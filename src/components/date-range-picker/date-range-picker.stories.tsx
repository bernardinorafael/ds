import { useState } from "react"

import { getLocalTimeZone, today } from "@internationalized/date"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DateRange } from "react-aria-components"

import { DateRangePicker } from "@/components/date-range-picker"
import { IconSprite } from "@/components/icon"

const meta: Meta = {
  title: "DateRangePicker",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <div className="w-80">
          <Story />
        </div>
      </>
    ),
  ],
}

export default meta
type Story = StoryObj

const now = today(getLocalTimeZone())

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null)
    return <DateRangePicker value={value} onChange={setValue} label="Booking period" />
  },
}

export const WithPresets: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null)
    return (
      <DateRangePicker
        value={value}
        onChange={setValue}
        presets={[
          {
            label: "Today",
            value: {
              start: now,
              end: now,
            },
          },
          {
            label: "Last 7 days",
            value: {
              start: now.subtract({ days: 7 }),
              end: now,
            },
          },
          {
            label: "Last 14 days",
            value: {
              start: now.subtract({ days: 14 }),
              end: now,
            },
          },
          {
            label: "Last 30 days",
            value: {
              start: now.subtract({ days: 30 }),
              end: now,
            },
          },
          {
            label: "Last 3 months",
            value: {
              start: now.subtract({ months: 3 }),
              end: now,
            },
          },
          {
            label: "Last 6 months",
            value: {
              start: now.subtract({ months: 6 }),
              end: now,
            },
          },
        ]}
        label="Filter period"
      />
    )
  },
}

export const DoubleMonth: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null)
    return (
      <DateRangePicker
        value={value}
        onChange={setValue}
        doubleMonth
        presets={[
          { label: "Today", value: { start: now, end: now } },
          { label: "Last 7 days", value: { start: now.subtract({ days: 7 }), end: now } },
          {
            label: "Last 14 days",
            value: { start: now.subtract({ days: 14 }), end: now },
          },
          {
            label: "Last 30 days",
            value: { start: now.subtract({ days: 30 }), end: now },
          },
          {
            label: "Last 3 months",
            value: { start: now.subtract({ months: 3 }), end: now },
          },
          {
            label: "Last 6 months",
            value: { start: now.subtract({ months: 6 }), end: now },
          },
        ]}
        label="Period"
      />
    )
  },
}

export const WithDefaultValue: Story = {
  render: () => (
    <DateRangePicker
      defaultValue={{
        start: now,
        end: now.add({ days: 7 }),
      }}
      label="Event period"
    />
  ),
}

export const WithMinMax: Story = {
  render: () => (
    <DateRangePicker
      minValue={now.subtract({
        days: 30,
      })}
      maxValue={now.add({
        days: 60,
      })}
      label="Available dates"
    />
  ),
}

export const InvalidState: Story = {
  render: () => <DateRangePicker isInvalid label="Invalid range" />,
}

export const DisabledState: Story = {
  render: () => (
    <DateRangePicker
      isDisabled
      defaultValue={{
        start: now,
        end: now.add({
          days: 3,
        }),
      }}
      label="Disabled"
    />
  ),
}

export const LocalePortugues: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null)
    return (
      <DateRangePicker
        value={value}
        onChange={setValue}
        locale="pt-BR"
        label="Período"
        clearLabel="Limpar"
        applyLabel="Aplicar"
        presets={[
          { label: "Hoje", value: { start: now, end: now } },
          {
            label: "Últimos 7 dias",
            value: { start: now.subtract({ days: 7 }), end: now },
          },
          {
            label: "Últimos 30 dias",
            value: { start: now.subtract({ days: 30 }), end: now },
          },
        ]}
      />
    )
  },
}
