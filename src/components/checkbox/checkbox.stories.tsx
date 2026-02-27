import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@/components/checkbox"

const meta = {
  title: "Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    "aria-label": "Checkbox",
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => {
    const [indeterminate, setIndeterminate] = useState<boolean | "indeterminate">(
      "indeterminate"
    )
    return (
      <div className="flex items-center gap-6 p-4">
        <Checkbox aria-label="Unchecked" />
        <Checkbox aria-label="Checked" defaultChecked />
        <Checkbox
          aria-label="Indeterminate"
          checked={indeterminate}
          onCheckedChange={setIndeterminate}
        />
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [indeterminateSm, setIndeterminateSm] = useState<boolean | "indeterminate">(
      "indeterminate"
    )
    const [indeterminateMd, setIndeterminateMd] = useState<boolean | "indeterminate">(
      "indeterminate"
    )
    const [indeterminateLg, setIndeterminateLg] = useState<boolean | "indeterminate">(
      "indeterminate"
    )
    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center gap-6">
          <Checkbox aria-label="Small unchecked" size="sm" />
          <Checkbox aria-label="Small checked" size="sm" defaultChecked />
          <Checkbox
            aria-label="Small indeterminate"
            size="sm"
            checked={indeterminateSm}
            onCheckedChange={setIndeterminateSm}
          />
        </div>
        <div className="flex items-center gap-6">
          <Checkbox aria-label="Medium unchecked" size="md" />
          <Checkbox aria-label="Medium checked" size="md" defaultChecked />
          <Checkbox
            aria-label="Medium indeterminate"
            size="md"
            checked={indeterminateMd}
            onCheckedChange={setIndeterminateMd}
          />
        </div>
        <div className="flex items-center gap-6">
          <Checkbox aria-label="Large unchecked" size="lg" />
          <Checkbox aria-label="Large checked" size="lg" defaultChecked />
          <Checkbox
            aria-label="Large indeterminate"
            size="lg"
            checked={indeterminateLg}
            onCheckedChange={setIndeterminateLg}
          />
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4">
      <Checkbox aria-label="Disabled unchecked" disabled />
      <Checkbox aria-label="Disabled checked" disabled defaultChecked />
      <Checkbox aria-label="Disabled indeterminate" disabled checked="indeterminate" />
    </div>
  ),
}
