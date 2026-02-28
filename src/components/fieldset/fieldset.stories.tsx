import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card } from "@/components/card"
import { CheckboxWithLabel } from "@/components/checkbox-with-label"
import { Field } from "@/components/field"
import { Fieldset } from "@/components/fieldset"
import { Input } from "@/components/input"

const meta = {
  title: "Fieldset",
  component: Fieldset,
  tags: ["autodocs"],
  args: {
    legend: "Fieldset",
    description: "Description",
  },
} satisfies Meta<typeof Fieldset>

export default meta

type Story = StoryObj<typeof meta>

export const InsideCard: Story = {
  render: () => (
    <Card spacing="cozy" className="max-w-4xl">
      <Card.Header>
        <Card.Title>Profile Settings</Card.Title>
        <Card.Description>
          Manage your personal information and account preferences
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <Card.Row>
          <Fieldset
            legend="Personal information"
            description="Your name and contact details"
          >
            <Field label="Full name" description="As it appears on your official ID">
              <Input placeholder="John Doe" />
            </Field>
          </Fieldset>
        </Card.Row>
        <Card.Row>
          <Fieldset
            legend="Your avatar"
            description="For best results, use a square image under 3MB"
          >
            <div className="flex flex-col gap-2">
              <p className="text-word-primary text-base font-medium">Avatar</p>
              <p className="text-word-secondary text-sm">
                Supported formats: PNG, JPG, JPEG
              </p>
            </div>
          </Fieldset>
        </Card.Row>
        <Card.Row>
          <Fieldset
            legend="Email notifications"
            description="Choose which emails you would like to receive"
          >
            <div className="flex flex-col gap-5">
              <CheckboxWithLabel id="product" defaultChecked>
                Product updates
              </CheckboxWithLabel>
              <CheckboxWithLabel
                id="news"
                description="Receive news about launches, promotions and exclusive offers directly in your email"
              >
                News and promotions
              </CheckboxWithLabel>
              <CheckboxWithLabel
                id="security"
                defaultChecked
                description="Alerts about suspicious activity on your account"
              >
                Security alerts
              </CheckboxWithLabel>
            </div>
          </Fieldset>
        </Card.Row>
      </Card.Body>
    </Card>
  ),
}
