import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card } from "@/components/card"
import { Fieldset } from "@/components/fieldset"
import { SwitchWithLabel } from "@/components/switch-with-label"

const meta = {
  title: "SwitchWithLabel",
  component: SwitchWithLabel,
  tags: ["autodocs"],
  args: {
    id: "default",
    children: "Label",
  },
} satisfies Meta<typeof SwitchWithLabel>

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
            <SwitchWithLabel id={`${label}-plain`} {...props}>
              Receive updates
            </SwitchWithLabel>
            <SwitchWithLabel
              id={`${label}-desc`}
              description="Alerts about suspicious activity"
              {...props}
            >
              Security alerts
            </SwitchWithLabel>
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
            <SwitchWithLabel id={`${size}-plain`} size={size} defaultChecked>
              Receive updates
            </SwitchWithLabel>
            <SwitchWithLabel
              id={`${size}-desc`}
              size={size}
              description="Alerts about suspicious activity"
            >
              Security alerts
            </SwitchWithLabel>
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
            legend="Notifications"
            description="Choose which notifications you would like to receive"
          >
            <div className="flex flex-col gap-3">
              <SwitchWithLabel id="product" defaultChecked>
                Product updates
              </SwitchWithLabel>
              <SwitchWithLabel
                id="news"
                description="News, promotions and exclusive offers"
              >
                News and promotions
              </SwitchWithLabel>
              <SwitchWithLabel id="security-alerts" defaultChecked>
                Security alerts
              </SwitchWithLabel>
            </div>
          </Fieldset>
        </Card.Row>
      </Card.Body>
    </Card>
  ),
}
