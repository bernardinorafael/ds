import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card } from "@/components/card"
import { CheckboxWithLabel } from "@/components/checkbox-with-label"
import { Fieldset } from "@/components/fieldset"

const meta = {
  title: "CheckboxWithLabel",
  component: CheckboxWithLabel,
  tags: ["autodocs"],
  args: {
    id: "default",
    children: "Label",
  },
} satisfies Meta<typeof CheckboxWithLabel>

export default meta

type Story = StoryObj<typeof meta>

const SIZES = ["sm", "md", "lg"] as const

const STATES = [
  { label: "default", props: {} },
  { label: "checked", props: { defaultChecked: true } },
  { label: "disabled", props: { disabled: true } },
  { label: "disabled + checked", props: { disabled: true, defaultChecked: true } },
] as const

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {STATES.map(({ label, props }) => (
        <div key={label} className="flex items-start gap-3">
          <span className="text-word-secondary w-28 pt-0.5 text-sm">{label}</span>
          <div className="flex items-start gap-6">
            <CheckboxWithLabel id={`${label}-plain`} {...props}>
              Receive updates
            </CheckboxWithLabel>
            <CheckboxWithLabel
              id={`${label}-desc`}
              description="Alerts about suspicious activity"
              {...props}
            >
              Security alerts
            </CheckboxWithLabel>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {SIZES.map((size) => (
        <div key={size} className="flex items-start gap-3">
          <span className="text-word-secondary w-28 pt-0.5 text-sm">{size}</span>
          <div className="flex items-start gap-6">
            <CheckboxWithLabel id={`${size}-plain`} size={size} defaultChecked>
              Receive updates
            </CheckboxWithLabel>
            <CheckboxWithLabel
              id={`${size}-desc`}
              size={size}
              description="Alerts about suspicious activity"
            >
              Security alerts
            </CheckboxWithLabel>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const InsideFieldset: Story = {
  render: () => (
    <Card spacing="cozy" className="max-w-4xl">
      <Card.Body>
        <Card.Row>
          <Fieldset
            legend="Email notifications"
            description="Choose which emails you would like to receive"
          >
            <div className="flex flex-col gap-3">
              <CheckboxWithLabel id="product" defaultChecked>
                Product updates
              </CheckboxWithLabel>
              <CheckboxWithLabel
                id="news"
                description="News, promotions and exclusive offers"
              >
                News and promotions
              </CheckboxWithLabel>
              <CheckboxWithLabel id="security-alerts" defaultChecked>
                Security alerts
              </CheckboxWithLabel>
            </div>
          </Fieldset>
        </Card.Row>
      </Card.Body>
    </Card>
  ),
}
