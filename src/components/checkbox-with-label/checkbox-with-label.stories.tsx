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

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <CheckboxWithLabel id="without-desc" defaultChecked>
        Product updates
      </CheckboxWithLabel>
      <CheckboxWithLabel
        id="with-desc"
        description="Alerts about suspicious activity on your account"
      >
        Security alerts
      </CheckboxWithLabel>
      <CheckboxWithLabel id="disabled-without-desc" disabled>
        Product updates
      </CheckboxWithLabel>
      <CheckboxWithLabel
        id="disabled-with-desc"
        disabled
        defaultChecked
        description="Alerts about suspicious activity on your account"
      >
        Security alerts
      </CheckboxWithLabel>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-3">
        <CheckboxWithLabel id="sm-1" size="sm" defaultChecked>
          Small checkbox
        </CheckboxWithLabel>
        <CheckboxWithLabel
          id="sm-2"
          size="sm"
          description="Helper text aligned with the small checkbox"
        >
          Small with description
        </CheckboxWithLabel>
      </div>
      <div className="flex flex-col gap-3">
        <CheckboxWithLabel id="md-1" size="md" defaultChecked>
          Medium checkbox
        </CheckboxWithLabel>
        <CheckboxWithLabel
          id="md-2"
          size="md"
          description="Helper text aligned with the medium checkbox"
        >
          Medium with description
        </CheckboxWithLabel>
      </div>
      <div className="flex flex-col gap-3">
        <CheckboxWithLabel id="lg-1" size="lg" defaultChecked>
          Large checkbox
        </CheckboxWithLabel>
        <CheckboxWithLabel
          id="lg-2"
          size="lg"
          description="Helper text aligned with the large checkbox"
        >
          Large with description
        </CheckboxWithLabel>
      </div>
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
