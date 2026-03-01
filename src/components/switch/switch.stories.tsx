import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Switch } from "@/components/switch"

const meta = {
  title: "Switch",
  component: Switch,
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch size="sm" aria-label="Small" defaultChecked />
      <Switch size="md" aria-label="Medium" defaultChecked />
      <Switch size="lg" aria-label="Large" defaultChecked />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <Switch size="sm" aria-label="Unchecked" />
        <Switch size="md" aria-label="Unchecked" />
        <Switch size="lg" aria-label="Unchecked" />
      </div>
      <div className="flex items-center gap-6">
        <Switch size="sm" aria-label="Checked" defaultChecked />
        <Switch size="md" aria-label="Checked" defaultChecked />
        <Switch size="lg" aria-label="Checked" defaultChecked />
      </div>
      <div className="flex items-center gap-6">
        <Switch size="sm" aria-label="Disabled unchecked" disabled />
        <Switch size="md" aria-label="Disabled unchecked" disabled />
        <Switch size="lg" aria-label="Disabled unchecked" disabled />
      </div>
      <div className="flex items-center gap-6">
        <Switch size="sm" aria-label="Disabled checked" disabled defaultChecked />
        <Switch size="md" aria-label="Disabled checked" disabled defaultChecked />
        <Switch size="lg" aria-label="Disabled checked" disabled defaultChecked />
      </div>
    </div>
  ),
}

export const Validity: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <Switch size="md" aria-label="Initial" validity="initial" defaultChecked />
        <Switch size="md" aria-label="Error" validity="error" defaultChecked />
        <Switch size="md" aria-label="Warning" validity="warning" defaultChecked />
        <Switch size="md" aria-label="Success" validity="success" defaultChecked />
      </div>
      <div className="flex items-center gap-6">
        <Switch size="md" aria-label="Initial" validity="initial" />
        <Switch size="md" aria-label="Error" validity="error" />
        <Switch size="md" aria-label="Warning" validity="warning" />
        <Switch size="md" aria-label="Success" validity="success" />
      </div>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="flex items-center gap-3">
        <Switch
          size="md"
          aria-label="Controlled switch"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <span className="text-word-secondary text-sm select-none">
          {checked ? "On" : "Off"}
        </span>
      </div>
    )
  },
}
