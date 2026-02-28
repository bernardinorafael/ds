import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { Card } from "@/components/card"

const meta = {
  title: "Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Backgrounds: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <Card background="soft" className="w-80">
        <Card.Header>
          <Card.Title>Soft background</Card.Title>
          <Card.Description>Uses surface-100 as the background</Card.Description>
        </Card.Header>
        <Card.Body>
          <p className="text-foreground text-sm">Body content goes here.</p>
        </Card.Body>
      </Card>

      <Card background="intense" className="w-80">
        <Card.Header>
          <Card.Title>Intense background</Card.Title>
          <Card.Description>Uses surface-50 as the background</Card.Description>
        </Card.Header>
        <Card.Body>
          <p className="text-foreground text-sm">Body content goes here.</p>
        </Card.Body>
      </Card>
    </div>
  ),
}

export const Spacing: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <Card spacing="compact" className="w-64">
        <Card.Header>
          <Card.Title>Compact</Card.Title>
        </Card.Header>
        <Card.Body>
          <p className="text-foreground text-sm">Compact padding.</p>
        </Card.Body>
      </Card>

      <Card spacing="cozy" className="w-64">
        <Card.Header>
          <Card.Title>Cozy</Card.Title>
        </Card.Header>
        <Card.Body>
          <p className="text-foreground text-sm">Cozy padding.</p>
        </Card.Body>
      </Card>
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card className="w-96">
      <Card.Header>
        <Card.Title>Settings</Card.Title>
        <Card.Description>Manage your account preferences</Card.Description>
        <Card.Actions>
          <Button size="sm">Edit</Button>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <p className="text-foreground text-sm">Settings content here.</p>
      </Card.Body>
    </Card>
  ),
}

export const WithRows: Story = {
  render: () => (
    <Card className="w-96">
      <Card.Header>
        <Card.Title>Members</Card.Title>
        <Card.Description>Team members and roles</Card.Description>
      </Card.Header>
      <Card.Body>
        <Card.Row>
          <p className="text-foreground text-sm">Alice — Admin</p>
        </Card.Row>
        <Card.Row>
          <p className="text-foreground text-sm">Bob — Editor</p>
        </Card.Row>
        <Card.Row>
          <p className="text-foreground text-sm">Charlie — Viewer</p>
        </Card.Row>
      </Card.Body>
    </Card>
  ),
}

export const Collapsible: Story = {
  render: function Render() {
    const [bodyOpen, setBodyOpen] = useState(true)
    const [footerOpen, setFooterOpen] = useState(true)

    return (
      <Card className="w-96">
        <Card.Header>
          <Card.Title>Collapsible sections</Card.Title>
          <Card.Actions>
            <Button size="sm" onClick={() => setBodyOpen((v) => !v)}>
              {bodyOpen ? "Hide body" : "Show body"}
            </Button>
            <Button size="sm" intent="secondary" onClick={() => setFooterOpen((v) => !v)}>
              {footerOpen ? "Hide footer" : "Show footer"}
            </Button>
          </Card.Actions>
        </Card.Header>
        <Card.Body open={bodyOpen} onOpenChange={setBodyOpen}>
          <p className="text-foreground text-sm">This body can be collapsed.</p>
        </Card.Body>
        <Card.Footer open={footerOpen} onOpenChange={setFooterOpen}>
          <p className="text-secondary-foreground text-sm">
            This footer can be collapsed too.
          </p>
        </Card.Footer>
      </Card>
    )
  },
}

export const Complete: Story = {
  render: () => (
    <Card className="w-md">
      <Card.Header>
        <Card.Title>Project overview</Card.Title>
        <Card.Description>Summary of your project status and metrics</Card.Description>
        <Card.Actions>
          <Button size="sm">View all</Button>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <Card.Row>
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm">Tasks completed</span>
            <span className="text-foreground text-sm font-medium">24 / 30</span>
          </div>
        </Card.Row>
        <Card.Row>
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm">Team members</span>
            <span className="text-foreground text-sm font-medium">8</span>
          </div>
        </Card.Row>
        <Card.Row>
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm">Due date</span>
            <span className="text-foreground text-sm font-medium">Mar 15, 2026</span>
          </div>
        </Card.Row>
      </Card.Body>
      <Card.Footer>
        <p className="text-secondary-foreground text-sm">Last updated 2 hours ago</p>
        <Card.Actions>
          <Button size="sm" intent="secondary">
            Refresh
          </Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  ),
}
