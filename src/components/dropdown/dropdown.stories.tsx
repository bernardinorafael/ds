import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { IconSprite } from "@/components/icon"
import { TooltipProvider } from "@/components/tooltip"

import { Dropdown } from "./dropdown"

const meta = {
  title: "Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <IconSprite />
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Dropdown>

export default meta

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button intent="secondary">Actions</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive>Delete</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button intent="secondary">Menu</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item icon="user-outline">Profile</Dropdown.Item>
        <Dropdown.Item icon="bell-outline">Notifications</Dropdown.Item>
        <Dropdown.Item icon="search-outline">Search</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item icon="trash-outline" destructive>
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

export const WithCheckbox: Story = {
  render: function WithCheckboxRender() {
    const [showStatus, setShowStatus] = useState(true)
    const [showActivity, setShowActivity] = useState(false)

    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button intent="secondary">View</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Toggle columns</Dropdown.Label>
          <Dropdown.CheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
            Status
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
            Activity
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

export const WithRadio: Story = {
  render: function WithRadioRender() {
    const [sort, setSort] = useState("name")

    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button intent="secondary">Sort by</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Sort order</Dropdown.Label>
          <Dropdown.RadioGroup value={sort} onValueChange={setSort}>
            <Dropdown.RadioItem value="name">Name</Dropdown.RadioItem>
            <Dropdown.RadioItem value="date">Date</Dropdown.RadioItem>
            <Dropdown.RadioItem value="size">Size</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

export const Grouped: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button intent="secondary">Options</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.Label>Account</Dropdown.Label>
          <Dropdown.Item icon="user-outline">Profile</Dropdown.Item>
          <Dropdown.Item icon="bell-outline">Notifications</Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Label>Danger zone</Dropdown.Label>
          <Dropdown.Item icon="trash-outline" destructive>
            Delete account
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown>
  ),
}

export const WithSubMenu: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button intent="secondary">More</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>New file</Dropdown.Item>
        <Dropdown.Sub>
          <Dropdown.SubTrigger>Share</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item>Email</Dropdown.Item>
            <Dropdown.Item>Slack</Dropdown.Item>
            <Dropdown.Item>Copy link</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
        <Dropdown.Separator />
        <Dropdown.Item destructive>Delete</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
}

export const KitchenSink: Story = {
  render: function KitchenSinkRender() {
    const [bookmarked, setBookmarked] = useState(true)
    const [pinned, setPinned] = useState(false)
    const [notifications, setNotifications] = useState(true)
    const [theme, setTheme] = useState("system")

    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button intent="secondary">Kitchen Sink</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {/* Quick actions */}
          <Dropdown.Group>
            <Dropdown.Label>Quick actions</Dropdown.Label>
            <Dropdown.Item icon="edit-outline">Edit project</Dropdown.Item>
            <Dropdown.Item icon="clipboard-outline">Copy to clipboard</Dropdown.Item>
            <Dropdown.Item icon="download-outline">Export</Dropdown.Item>
          </Dropdown.Group>

          <Dropdown.Separator />

          {/* Preferences with checkboxes */}
          <Dropdown.Group>
            <Dropdown.Label>Preferences</Dropdown.Label>
            <Dropdown.CheckboxItem checked={bookmarked} onCheckedChange={setBookmarked}>
              Bookmarked
            </Dropdown.CheckboxItem>
            <Dropdown.CheckboxItem checked={pinned} onCheckedChange={setPinned}>
              Pinned to sidebar
            </Dropdown.CheckboxItem>
            <Dropdown.CheckboxItem
              checked={notifications}
              onCheckedChange={setNotifications}
            >
              Notifications
            </Dropdown.CheckboxItem>
          </Dropdown.Group>

          <Dropdown.Separator />

          {/* Theme radio group */}
          <Dropdown.Group>
            <Dropdown.Label>Theme</Dropdown.Label>
            <Dropdown.RadioGroup value={theme} onValueChange={setTheme}>
              <Dropdown.RadioItem value="light" icon="eye-open-outline">
                Light
              </Dropdown.RadioItem>
              <Dropdown.RadioItem value="dark" icon="eye-closed-outline">
                Dark
              </Dropdown.RadioItem>
              <Dropdown.RadioItem value="system" icon="computer-outline">
                System
              </Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Group>

          <Dropdown.Separator />

          {/* Sub-menu */}
          <Dropdown.Sub>
            <Dropdown.SubTrigger icon="paper-plane-outline">
              Share with
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item icon="email-outline">Email</Dropdown.Item>
              <Dropdown.Item icon="link-outline">Copy link</Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item icon="lock-outline">Private link</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>

          <Dropdown.Separator />

          {/* Disabled + destructive */}
          <Dropdown.Item icon="lock-outline" disabled tooltip="You don't have permission">
            Lock project
          </Dropdown.Item>
          <Dropdown.Item icon="trash-outline" destructive>
            Delete project
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}
