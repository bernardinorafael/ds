import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { IconSprite } from "@/components/icon"
import { Sheet } from "@/components/sheet"

const meta = {
  title: "Sheet",
  component: Sheet,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
      </>
    ),
  ],
  args: {
    children: null,
  },
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Sheet size="base" trigger={<Button intent="secondary">Base</Button>}>
        <Sheet.Content>
          <Sheet.Header title="Base sheet" description="490px wide panel." />
          <Sheet.Section>
            <p className="text-word-secondary text-base">Base sheet content.</p>
          </Sheet.Section>
        </Sheet.Content>
      </Sheet>

      <Sheet size="lg" trigger={<Button intent="secondary">Large</Button>}>
        <Sheet.Content>
          <Sheet.Header title="Large sheet" description="720px wide panel." />
          <Sheet.Section>
            <p className="text-word-secondary text-base">Large sheet content.</p>
          </Sheet.Section>
        </Sheet.Content>
      </Sheet>
    </div>
  ),
}

export const WithScrollableContent: Story = {
  render: () => (
    <Sheet trigger={<Button intent="secondary">Open sheet</Button>}>
      <Sheet.Content>
        <Sheet.Header title="Notifications" description="Your recent activity." />
        <Sheet.Section>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border-surface-100 border-b pb-4">
              <p className="text-sm font-medium">Notification {i + 1}</p>
              <p className="text-word-secondary text-sm">
                This is a sample notification item to demonstrate scrollable content.
              </p>
            </div>
          ))}
        </Sheet.Section>
      </Sheet.Content>
    </Sheet>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Sheet trigger={<Button intent="secondary">Open sheet</Button>}>
      <Sheet.Content>
        <Sheet.Header
          title="Edit profile"
          description="Update your personal information and preferences."
        />
        <Sheet.Section>
          <p className="text-word-secondary text-base">Form fields would go here.</p>
        </Sheet.Section>
      </Sheet.Content>
      <Sheet.Footer>
        <Sheet.Close>Cancel</Sheet.Close>
        <Button>Save changes</Button>
      </Sheet.Footer>
    </Sheet>
  ),
}

export const NonDismissible: Story = {
  render: () => (
    <Sheet dismissible={false} trigger={<Button intent="secondary">Open sheet</Button>}>
      <Sheet.Content>
        <Sheet.Header
          title="Unsaved changes"
          description="Use the buttons below to save or discard."
        />
        <Sheet.Section>
          <p className="text-word-secondary text-base">
            Clicking outside or pressing Escape will not close this sheet.
          </p>
        </Sheet.Section>
      </Sheet.Content>
      <Sheet.Footer>
        <Sheet.Close>Discard</Sheet.Close>
        <Button>Save changes</Button>
      </Sheet.Footer>
    </Sheet>
  ),
}

function AsyncSheetExample() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen} trigger={<Button>Save changes</Button>}>
      <Sheet.Content>
        <Sheet.Header
          title="Save changes"
          description="Are you sure you want to save these changes?"
        />
        <Sheet.Section>
          <p className="text-word-secondary text-base">
            Review your changes before saving.
          </p>
        </Sheet.Section>
      </Sheet.Content>
      <Sheet.Footer>
        <Sheet.Close disabled={isLoading}>Cancel</Sheet.Close>
        <Button isLoading={isLoading} onClick={handleSave}>
          Save
        </Button>
      </Sheet.Footer>
    </Sheet>
  )
}

export const Async: Story = {
  render: () => <AsyncSheetExample />,
}
