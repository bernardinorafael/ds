import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card } from "@/components/card"
import { RadioGroup } from "@/components/radio-group"
import { TooltipProvider } from "@/components/tooltip"

const meta = {
  title: "RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    "aria-label": "Radio group",
    options: [
      {
        value: "monthly",
        label: "Monthly",
      },
      {
        value: "yearly",
        label: "Yearly",
      },
    ],
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

const SIZES = ["sm", "md"] as const

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size, i) => (
        <div key={size} className="flex items-start gap-3">
          <span className="text-word-secondary w-28 pt-0.5 text-sm">{size}</span>
          <RadioGroup
            key={`${size}-${i}`}
            aria-label={`Size ${size}`}
            size={size}
            defaultValue="yearly"
            options={[
              {
                value: "monthly",
                label: "Monthly",
              },
              {
                value: "yearly",
                label: "Yearly",
              },
            ]}
          />
        </div>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <span className="text-word-secondary w-28 pt-0.5 text-sm">default</span>
        <RadioGroup
          aria-label="Default state"
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
        />
      </div>
      <div className="flex items-start gap-3">
        <span className="text-word-secondary w-28 pt-0.5 text-sm">selected</span>
        <RadioGroup
          aria-label="Selected state"
          defaultValue="yearly"
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
        />
      </div>
      <div className="flex items-start gap-3">
        <span className="text-word-secondary w-28 pt-0.5 text-sm">disabled</span>
        <RadioGroup
          aria-label="Disabled state"
          defaultValue="yearly"
          disabled
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
        />
      </div>
    </div>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup
      aria-label="Membership type"
      defaultValue="unlimited"
      options={[
        {
          value: "unlimited",
          label: "Unlimited membership",
          description: "Access to all features with no usage limits",
          badgeProps: { intent: "pro", children: "Pro" },
        },
        {
          value: "limited",
          label: "Limited membership",
          description: "Basic access with monthly usage caps",
        },
      ]}
    />
  ),
}

export const WithBadge: Story = {
  render: () => (
    <RadioGroup
      aria-label="Plan selection"
      defaultValue="free"
      options={[
        { value: "free", label: "Free" },
        {
          value: "pro",
          label: "Pro",
          badgeProps: { intent: "pro", children: "Pro" },
        },
        {
          value: "enterprise",
          label: "Enterprise",
          disabled: true,
          badgeProps: { intent: "primary", children: "Coming soon" },
        },
      ]}
    />
  ),
}

export const WithTooltip: Story = {
  render: () => (
    <RadioGroup
      aria-label="Plan selection"
      defaultValue="free"
      options={[
        { value: "free", label: "Free" },
        {
          value: "pro",
          label: "Pro",
          badgeProps: { intent: "pro", children: "Pro" },
        },
        {
          value: "enterprise",
          label: "Enterprise",
          disabled: true,
          badgeProps: { intent: "primary", children: "Coming soon" },
          tooltip:
            "in qui excepteur incididunt anim duis sit qui eiusmod ut duis id eiusmod labore",
        },
      ]}
    />
  ),
}

export const InsideCard: Story = {
  render: () => (
    <Card spacing="cozy" className="max-w-lg">
      <Card.Header>
        <Card.Title>Default membership limit</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Row>
          <RadioGroup
            aria-label="Default membership limit"
            defaultValue="unlimited"
            options={[
              {
                value: "unlimited",
                label: "Unlimited membership",
                description: "Access to all features with no usage limits",
                badgeProps: { intent: "pro", children: "Pro" },
              },
              {
                value: "limited",
                label: "Limited membership",
                description: "Basic access with monthly usage caps",
              },
            ]}
          />
        </Card.Row>
      </Card.Body>
    </Card>
  ),
}
