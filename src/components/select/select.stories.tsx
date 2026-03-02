import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Field, useFieldControl } from "@/components/field"
import { IconSprite } from "@/components/icon"
import { Select } from "@/components/select"

const meta = {
  title: "Select",
  component: Select,
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
    placeholder: "Select an option",
    items: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
      { label: "Date", value: "date" },
      { label: "Elderberry", value: "elderberry" },
    ],
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="w-72">
        <Select {...args} placeholder="Default" />
      </div>
      <div className="w-72">
        <Select {...args} placeholder="Loading" loading />
      </div>
      <div className="w-72">
        <Select {...args} placeholder="Disabled" disabled />
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="w-72">
        <Select {...args} size="sm" placeholder="Small" />
      </div>
      <div className="w-72">
        <Select {...args} size="md" placeholder="Medium (default)" />
      </div>
    </div>
  ),
}

export const WithPrefix: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} prefix="Country:" placeholder="Select country" />
    </div>
  ),
}

export const WithDescriptions: Story = {
  render: (args) => (
    <div className="w-80">
      <Select
        {...args}
        placeholder="Select a plan"
        items={[
          { label: "Starter", description: "Up to 5 users", value: "starter" },
          { label: "Pro", description: "Up to 25 users", value: "pro" },
          { label: "Business", description: "Unlimited users", value: "business" },
          {
            label: "Enterprise",
            description: "Custom pricing",
            value: "enterprise",
            disabled: true,
          },
        ]}
      />
    </div>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <div className="w-72">
      <Select
        {...args}
        placeholder="Select action"
        items={[
          { label: "Settings", value: "settings", icon: "settings-outline" },
          { label: "Search", value: "search", icon: "search-outline" },
          { label: "Notifications", value: "notifications", icon: "bell-outline" },
          { label: "Profile", value: "profile", icon: "user-outline" },
        ]}
      />
    </div>
  ),
}

export const Grouped: Story = {
  render: (args) => (
    <div className="w-72">
      <Select
        {...args}
        placeholder="Select fruit"
        items={[
          {
            label: "Citrus",
            items: [
              { label: "Orange", value: "orange" },
              { label: "Lemon", value: "lemon" },
              { label: "Grapefruit", value: "grapefruit" },
            ],
          },
          {
            label: "Berries",
            items: [
              { label: "Strawberry", value: "strawberry" },
              { label: "Blueberry", value: "blueberry" },
              { label: "Raspberry", value: "raspberry" },
            ],
          },
          {
            label: "Tropical",
            items: [
              { label: "Mango", value: "mango" },
              { label: "Pineapple", value: "pineapple" },
              { label: "Coconut", value: "coconut" },
            ],
          },
        ]}
      />
    </div>
  ),
}

export const EmptyState: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="w-72">
        <Select {...args} placeholder="Default empty" items={[]} />
      </div>
      <div className="w-72">
        <Select
          {...args}
          placeholder="Custom empty"
          items={[]}
          emptyLabel="Nothing to show"
        />
      </div>
    </div>
  ),
}

// Wires itself to the parent Field via useFieldControl
const FieldSelectControl = ({
  value,
  onValueChange,
}: {
  value?: string
  onValueChange: (v: string) => void
}) => {
  const fieldProps = useFieldControl()
  return (
    <Select
      {...fieldProps}
      value={value}
      onValueChange={onValueChange}
      placeholder="Select fruit"
      items={[
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry" },
      ]}
    />
  )
}

export const InsideField: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<string | undefined>(undefined)
      return (
        <div className="w-72">
          <Field
            label="Fruit"
            description="Pick your favorite"
            message={!value ? "Please select a fruit" : undefined}
            messageIntent="error"
          >
            <FieldSelectControl value={value} onValueChange={setValue} />
          </Field>
        </div>
      )
    }
    return <Demo />
  },
}
