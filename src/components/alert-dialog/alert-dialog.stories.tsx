import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { AlertDialog } from "@/components/alert-dialog"
import { Button } from "@/components/button"

const meta = {
  title: "AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <AlertDialog size="sm" trigger={<Button intent="secondary">Small</Button>}>
        <AlertDialog.Content>
          <AlertDialog.Header title="Small alert" />
          <AlertDialog.Section>
            <p className="text-word-secondary text-base">
              Small alert dialog content (420px).
            </p>
          </AlertDialog.Section>
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Cancel />
          <AlertDialog.Action>Confirm</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog>

      <AlertDialog size="base" trigger={<Button intent="secondary">Base</Button>}>
        <AlertDialog.Content>
          <AlertDialog.Header title="Base alert" />
          <AlertDialog.Section>
            <p className="text-word-secondary text-base">
              Base alert dialog content (490px).
            </p>
          </AlertDialog.Section>
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Cancel />
          <AlertDialog.Action>Confirm</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog>

      <AlertDialog size="lg" trigger={<Button intent="secondary">Large</Button>}>
        <AlertDialog.Content>
          <AlertDialog.Header title="Large alert" />
          <AlertDialog.Section>
            <p className="text-word-secondary text-base">
              Large alert dialog content (610px).
            </p>
          </AlertDialog.Section>
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Cancel />
          <AlertDialog.Action>Confirm</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog>
    </div>
  ),
}

function AsyncAlertDialogExample() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setOpen(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      trigger={<Button intent="danger">Delete account</Button>}
    >
      <AlertDialog.Content>
        <AlertDialog.Header
          title="Delete account"
          description="This action cannot be undone. Your account and all data will be permanently removed."
        />
      </AlertDialog.Content>
      <AlertDialog.Footer>
        <AlertDialog.Cancel disabled={isLoading} />
        <AlertDialog.Action isLoading={isLoading} onClick={handleDelete}>
          Delete
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog>
  )
}

export const Async: Story = {
  render: () => <AsyncAlertDialogExample />,
}

export const WithNotice: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <AlertDialog trigger={<Button intent="danger">Danger notice</Button>}>
        <AlertDialog.Content>
          <AlertDialog.Header
            title="Delete workspace"
            description="This will permanently delete the workspace."
          />
          <AlertDialog.Section>
            <AlertDialog.Notice intent="danger">
              This action is irreversible and cannot be undone.
            </AlertDialog.Notice>
          </AlertDialog.Section>
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Cancel />
          <AlertDialog.Action>Delete</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog>

      <AlertDialog trigger={<Button intent="secondary">Warning notice</Button>}>
        <AlertDialog.Content>
          <AlertDialog.Header
            title="Downgrade plan"
            description="You are about to downgrade your plan."
          />
          <AlertDialog.Section>
            <AlertDialog.Notice intent="warning">
              Active integrations will be disconnected.
            </AlertDialog.Notice>
          </AlertDialog.Section>
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Cancel />
          <AlertDialog.Action>Downgrade</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog>

      <AlertDialog trigger={<Button intent="secondary">Neutral notice</Button>}>
        <AlertDialog.Content>
          <AlertDialog.Header
            title="Reset settings"
            description="Reset all settings to their default values."
          />
          <AlertDialog.Section>
            <AlertDialog.Notice intent="neutral">
              You can reconfigure your settings at any time.
            </AlertDialog.Notice>
          </AlertDialog.Section>
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Cancel />
          <AlertDialog.Action>Reset</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog>
    </div>
  ),
}
