import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { Field, useFieldControl } from "@/components/field"

const meta = {
  title: "Field",
  component: Field,
  tags: ["autodocs"],
  args: {
    label: "Email address",
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

// Minimal input that wires itself to the parent Field
const FieldInput = ({ placeholder }: { placeholder?: string }) => {
  const fieldProps = useFieldControl()
  return (
    <input
      {...fieldProps}
      placeholder={placeholder ?? "Enter value"}
      className="border-border focus-visible:ring-primary/50 w-full rounded-sm border px-3 py-1.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    />
  )
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-100">
        <Field label="No message" description="A description below the label">
          <FieldInput placeholder="No validation state" />
        </Field>
      </div>

      <div className="w-100">
        <Field label="Error" message="This field is required" messageIntent="error">
          <FieldInput placeholder="Error state" />
        </Field>
      </div>

      <div className="w-100">
        <Field label="Warning" message="This value looks unusual" messageIntent="warning">
          <FieldInput placeholder="Warning state" />
        </Field>
      </div>

      <div className="w-100">
        <Field label="Success" message="Looks good!" messageIntent="success">
          <FieldInput placeholder="Success state" />
        </Field>
      </div>
    </div>
  ),
}

export const Optional: Story = {
  render: () => (
    <div className="w-100">
      <Field label="Phone number" optional>
        <FieldInput placeholder="+1 (555) 000-0000" />
      </Field>
    </div>
  ),
}

export const MessageSwap: Story = {
  render: () => {
    const messages = [
      {
        content: "Password must be at least 8 characters",
        intent: "error" as const,
      },
      {
        content: "Check your email format",
        intent: "warning" as const,
      },
      {
        content: "All good!",
        intent: "success" as const,
      },
    ]

    const Demo = () => {
      const [index, setIndex] = useState<number | null>(null)
      const current = index !== null ? messages[index] : undefined

      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {messages.map((msg, i) => {
              const buttonText = msg.intent[0].toUpperCase() + msg.intent.slice(1)
              return (
                <Button
                  key={i}
                  size="sm"
                  onClick={() => setIndex(index === i ? null : i)}
                >
                  {index === i ? "Clear message" : buttonText}
                </Button>
              )
            })}
          </div>

          <div className="w-100">
            <Field
              label="Password"
              message={current?.content}
              description="Must be at least 8 characters long"
              messageIntent={current?.intent}
            >
              <FieldInput placeholder="Enter password" />
            </Field>
          </div>
        </div>
      )
    }

    return <Demo />
  },
}
