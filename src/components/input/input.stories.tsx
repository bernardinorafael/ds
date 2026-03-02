import type { Meta, StoryObj } from "@storybook/react-vite"

import { Field } from "@/components/field"
import { IconSprite } from "@/components/icon"
import { Input } from "@/components/input"

const meta = {
  title: "Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
      </>
    ),
  ],
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

export const WithPrefix: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input size="sm" prefix="http://" placeholder="example.com" />
      <Input size="md" prefix="http://" placeholder="example.com" />
      <Input size="lg" prefix="http://" placeholder="example.com" />
    </div>
  ),
}

export const WithSuffix: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input size="sm" suffix="@domain.com" placeholder="john" />
      <Input size="md" suffix="@domain.com" placeholder="john" />
      <Input size="lg" suffix="@domain.com" placeholder="john" />
    </div>
  ),
}

export const WithPrefixAndSuffix: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input size="sm" prefix="https://" suffix=".com" placeholder="example" />
      <Input size="md" prefix="https://" suffix=".com" placeholder="example" />
      <Input size="lg" prefix="https://" suffix=".com" placeholder="example" />
    </div>
  ),
}

export const Password: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input type="password" size="sm" defaultValue="secret123" />
      <Input type="password" size="md" defaultValue="secret123" />
      <Input type="password" size="lg" defaultValue="secret123" />
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
