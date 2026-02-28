import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { Field } from "@/components/field"
import { Input } from "@/components/input"

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

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-100">
        <Field label="No message" description="A description below the label">
          <Input placeholder="No validation state" />
        </Field>
      </div>

      <div className="w-100">
        <Field label="Error" message="This field is required" messageIntent="error">
          <Input placeholder="Error state" />
        </Field>
      </div>

      <div className="w-100">
        <Field label="Warning" message="This value looks unusual" messageIntent="warning">
          <Input placeholder="Warning state" />
        </Field>
      </div>

      <div className="w-100">
        <Field label="Success" message="Looks good!" messageIntent="success">
          <Input placeholder="Success state" />
        </Field>
      </div>
    </div>
  ),
}

export const Optional: Story = {
  render: () => (
    <div className="w-100">
      <Field label="Phone number" optional>
        <Input placeholder="+1 (555) 000-0000" />
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
              <Input placeholder="Enter password" />
            </Field>
          </div>
        </div>
      )
    }

    return <Demo />
  },
}
