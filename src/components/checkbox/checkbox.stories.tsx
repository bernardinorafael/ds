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

const SIZES = ["sm", "md", "lg"] as const

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {SIZES.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-word-secondary w-8 text-sm">{size}</span>
          <div className="flex items-center gap-4">
            <Checkbox aria-label="Unchecked" size={size} />
            <Checkbox aria-label="Checked" size={size} defaultChecked />
            <Checkbox aria-label="Indeterminate" size={size} checked="indeterminate" />
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {SIZES.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-word-secondary w-8 text-sm">{size}</span>
          <div className="flex items-center gap-4">
            <Checkbox aria-label="Unchecked" size={size} disabled />
            <Checkbox aria-label="Checked" size={size} disabled defaultChecked />
            <Checkbox
              aria-label="Indeterminate"
              size={size}
              disabled
              checked="indeterminate"
            />
          </div>
        </div>
      ))}
    </div>
  ),
}
