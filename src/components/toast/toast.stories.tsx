import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { IconSprite } from "@/components/icon"
import { toast, Toaster } from "@/components/toast"

const meta = {
  title: "Toast",
  component: Toaster,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button intent="secondary" onClick={() => toast.info("Info message")}>
        Info
      </Button>
      <Button intent="secondary" onClick={() => toast.success("Changes saved")}>
        Success
      </Button>
      <Button
        intent="secondary"
        onClick={() => toast.warning("This action is irreversible")}
      >
        Warning
      </Button>
      <Button intent="secondary" onClick={() => toast.error("Something went wrong")}>
        Error
      </Button>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        intent="secondary"
        onClick={() =>
          toast.success("Amet mollit nostrud minim", {
            action: {
              label: "Action",
              onClick: () => toast.info("Ipsum consectetur et exercitation exercitation"),
            },
          })
        }
      >
        With action
      </Button>
    </div>
  ),
}

export const WithCancel: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        intent="secondary"
        onClick={() =>
          toast.warning("Delete this item?", {
            duration: Infinity,
            action: {
              label: "Confirm",
              onClick: () => toast.success("Deleted"),
            },
            cancel: { label: "Cancel" },
          })
        }
      >
        With cancel
      </Button>
    </div>
  ),
}

export const Singleton: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        intent="secondary"
        onClick={() =>
          toast.warning("You have unsaved changes", {
            id: "unsaved",
            duration: Infinity,
            cancel: { label: "Dismiss" },
          })
        }
      >
        Show singleton
      </Button>
      <p className="text-word-secondary w-full text-sm">
        Click multiple times — only one toast appears. Duplicates trigger a jingle instead
        of stacking.
      </p>
    </div>
  ),
}

export const Jingle: Story = {
  render: () => {
    let toastId = ""
    return (
      <div className="flex flex-wrap gap-3">
        <Button
          intent="secondary"
          onClick={() => {
            if (!toastId || !toast.get(toastId)) {
              toastId = toast.warning("Unsaved changes", {
                duration: Infinity,
                cancel: { label: "Dismiss" },
              })
            } else {
              toast.jingle(toastId)
            }
          }}
        >
          Show or jingle
        </Button>
      </div>
    )
  },
}

export const HoverPause: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        intent="secondary"
        onClick={() => toast.info("Hover me to pause the timer", { duration: 3000 })}
      >
        3s with hover pause
      </Button>
      <p className="text-word-secondary w-full text-sm">
        Hover the toast to pause auto-dismiss. The remaining time resumes when you move
        away.
      </p>
    </div>
  ),
}

export const ToastLimit: Story = {
  render: () => {
    let count = 0
    return (
      <div className="flex flex-wrap gap-3">
        <Button
          intent="secondary"
          onClick={() => {
            count++
            toast.info(`Toast #${count}`, { duration: 8000 })
          }}
        >
          Spam toasts
        </Button>
        <p className="text-word-secondary w-full text-sm">
          Maximum 3 toasts visible at once. Oldest gets evicted when a 4th arrives.
        </p>
      </div>
    )
  },
}

export const CustomDuration: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        intent="secondary"
        onClick={() => toast.info("Disappears in 5s", { duration: 5000 })}
      >
        5 seconds
      </Button>
      <Button
        intent="secondary"
        onClick={() =>
          toast.info("Stays until dismissed", {
            duration: Infinity,
            cancel: { label: "Dismiss" },
          })
        }
      >
        Persistent
      </Button>
    </div>
  ),
}

export const DismissAll: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        intent="secondary"
        onClick={() => {
          toast.info("First toast", { duration: Infinity })
          toast.success("Second toast", { duration: Infinity })
          toast.warning("Third toast", { duration: Infinity })
        }}
      >
        Show 3 toasts
      </Button>
      <Button intent="secondary" onClick={() => toast.dismissAll()}>
        Dismiss all
      </Button>
    </div>
  ),
}
