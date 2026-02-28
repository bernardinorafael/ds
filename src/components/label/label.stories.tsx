import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@/components/label"

const meta = {
  title: "Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    htmlFor: "field",
    children: "Email address",
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

// TODO: when Input component is created, pair each Label with an <Input> so
// stories show labels associated with real controls instead of floating alone.
export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Label htmlFor="a">Default</Label>
      <Label htmlFor="b" optional>
        With optional badge
      </Label>
      <Label htmlFor="c" disabled>
        Disabled
      </Label>
      <Label htmlFor="d" disabled optional>
        Disabled with optional
      </Label>
      <Label htmlFor="e" omitLabel>
        Hidden (sr-only)
      </Label>
    </div>
  ),
}
