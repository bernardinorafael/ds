import type { Meta, StoryObj } from "@storybook/react-vite"

import { Field } from "@/components/field"
import { Textarea } from "@/components/textarea"

const meta = {
  title: "Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea size="sm" placeholder="Small" />
      <Textarea size="md" placeholder="Medium" />
      <Textarea size="lg" placeholder="Large" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea placeholder="Default" />
      <Textarea aria-invalid={true} placeholder="Error" />
      <Textarea disabled placeholder="Disabled" />
      <Textarea readOnly value="Read only value" />
    </div>
  ),
}

export const Validity: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea validity="error" placeholder="Error" />
      <Textarea validity="warning" placeholder="Warning" />
      <Textarea validity="success" placeholder="Success" />
    </div>
  ),
}

export const Rows: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea minRows={2} placeholder="Min 2 rows" />
      <Textarea minRows={5} placeholder="Min 5 rows" />
      <Textarea minRows={3} maxRows={6} placeholder="Min 3, max 6 rows" />
    </div>
  ),
}

export const WithField: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Field label="Description">
        <Textarea placeholder="Enter a description" />
      </Field>

      <Field label="Description" message="This field is required" messageIntent="error">
        <Textarea placeholder="Enter a description" />
      </Field>

      <Field label="Description" optional description="Max 500 characters.">
        <Textarea placeholder="Enter a description" maxLength={500} />
      </Field>
    </div>
  ),
}
