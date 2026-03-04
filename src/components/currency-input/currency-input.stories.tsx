import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { CurrencyInput } from "@/components/currency-input"
import { Field } from "@/components/field"
import { IconSprite } from "@/components/icon"
import { Provider } from "@/components/provider"

const meta = {
  title: "CurrencyInput",
  component: CurrencyInput,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider>
        <IconSprite />
        <Story />
      </Provider>
    ),
  ],
  args: {
    currency: "BRL",
    value: 0,
    onChange: () => {},
  },
} satisfies Meta<typeof CurrencyInput>

export default meta

type Story = StoryObj<typeof meta>

function CurrencyInputDemo({
  currency,
  size,
  ...props
}: {
  currency: "BRL" | "EUR" | "USD"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  readOnly?: boolean
  validity?: "initial" | "error" | "warning" | "success"
}) {
  const [value, setValue] = useState(0)

  return (
    <CurrencyInput
      currency={currency}
      value={value}
      onChange={setValue}
      size={size}
      {...props}
    />
  )
}

function CurrencyInputWithValue({
  currency,
  initialValue = 123456,
  ...props
}: {
  currency: "BRL" | "EUR" | "USD"
  initialValue?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <CurrencyInput currency={currency} value={value} onChange={setValue} {...props} />
  )
}

export const Currencies: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <CurrencyInputDemo currency="BRL" />
      <CurrencyInputDemo currency="USD" />
      <CurrencyInputDemo currency="EUR" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <CurrencyInputDemo currency="BRL" size="sm" />
      <CurrencyInputDemo currency="BRL" size="md" />
      <CurrencyInputDemo currency="BRL" size="lg" />
    </div>
  ),
}

export const WithValues: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <CurrencyInputWithValue currency="BRL" initialValue={123456} />
      <CurrencyInputWithValue currency="USD" initialValue={9999} />
      <CurrencyInputWithValue currency="EUR" initialValue={50000} />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <CurrencyInputDemo currency="BRL" />
      <CurrencyInputDemo currency="BRL" validity="error" />
      <CurrencyInputDemo currency="BRL" validity="warning" />
      <CurrencyInputDemo currency="BRL" validity="success" />
      <CurrencyInputDemo currency="BRL" disabled />
      <CurrencyInputWithValue currency="BRL" readOnly />
    </div>
  ),
}

export const WithField: Story = {
  render: () => {
    function FieldDemo() {
      const [value, setValue] = useState(0)

      return (
        <div className="flex w-80 flex-col gap-6">
          <Field label="Price">
            <CurrencyInput currency="BRL" value={value} onChange={setValue} />
          </Field>

          <Field
            label="Monthly fee"
            message="Minimum value is R$ 10,00"
            messageIntent="error"
          >
            <CurrencyInput currency="BRL" value={value} onChange={setValue} />
          </Field>

          <Field label="Budget" optional description="Enter the total budget amount.">
            <CurrencyInput currency="USD" value={value} onChange={setValue} />
          </Field>
        </div>
      )
    }

    return <FieldDemo />
  },
}
