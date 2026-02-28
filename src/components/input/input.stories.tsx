import type { Meta, StoryObj } from "@storybook/react-vite"

import { Field } from "@/components/field"
import { Input } from "@/components/input"

const meta = {
  title: "Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Types: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="url" placeholder="URL" />
      <Input type="tel" placeholder="Phone" />
      <Input type="search" placeholder="Search" />
      <Input type="search" placeholder="Search loading" loading />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input placeholder="Default" />
      <Input aria-invalid={true} placeholder="Error" />
      <Input disabled placeholder="Disabled" />
      <Input readOnly value="Read only" />
    </div>
  ),
}

export const WithField: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Field label="Email address">
        <Input placeholder="Enter your email" />
      </Field>

      <Field label="Email address" message="This field is required" messageIntent="error">
        <Input placeholder="Enter your email" />
      </Field>

      <Field label="Email address" optional description="We will never share your email.">
        <Input placeholder="Enter your email" />
      </Field>
    </div>
  ),
}
